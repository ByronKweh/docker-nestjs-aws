import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import {
  CreateJobListingDTO,
  EditJobListingDTO,
  JobListResponseDTO,
  JobListingStatus,
  RecruiterJobListItemDTO,
} from './recruiter.dto';
import * as moment from 'moment-timezone';
import { SearchParamsDto } from 'src/shared/shared.dto';

@Injectable()
export class RecruiterService {
  private readonly logger = new Logger(RecruiterService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getJobListingByRecruiter(
    user_id: number,
    params: SearchParamsDto,
  ): Promise<JobListResponseDTO> {
    const page_size = params.page_size || 10;
    const page = params.page || 1;
    const skip = (page - 1) * page_size;

    return await this.prisma.$transaction(async ($prisma) => {
      const job_listings = await $prisma.job_listing.findMany({
        where: {
          created_by_id: user_id,
        },
        orderBy: {
          updated_at: 'desc',
        },
        skip: skip,
        take: page_size,
      });

      const parsed_job_listings: RecruiterJobListItemDTO[] = job_listings.map(
        (job_listing) => {
          return {
            id: job_listing.id,
            title: job_listing.title,
            description: job_listing.description,
            location: job_listing.location,
            status: job_listing.date_posted
              ? JobListingStatus.PUBLISHED
              : JobListingStatus.DRAFT,
          };
        },
      );

      const count = await $prisma.job_listing.count({
        where: {
          created_by_id: user_id,
        },
      });

      return {
        listings: parsed_job_listings,
        page: page,
        page_size: page_size,
        page_count: Math.ceil(count / page_size),
      };
    });
  }

  async createJobListing(user_id: number, data: CreateJobListingDTO) {
    return await this.prisma.job_listing.create({
      data: {
        title: data.title,
        description: data.description,
        location: data.location,
        created_by: {
          connect: {
            user_id: user_id,
          },
        },
        date_posted: data.should_publish ? moment().toISOString() : undefined,
      },
    });
  }

  async isValidJobListingAndUserId(user_id: number, job_listing_id: number) {
    const listing = await this.prisma.job_listing.findFirst({
      where: {
        id: job_listing_id,
      },
      include: {
        created_by: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!listing || listing.created_by.user_id !== user_id) {
      return false;
    }

    return true;
  }

  async updateJobListing(
    user_id: number,
    job_listing_id: number,
    payload: EditJobListingDTO,
  ) {
    if (!(await this.isValidJobListingAndUserId(user_id, job_listing_id))) {
      throw new BadRequestException();
    }

    const { should_publish, ...update_data } = payload;

    if (!should_publish) {
      return await this.prisma.job_listing.update({
        where: {
          id: job_listing_id,
        },
        data: {
          ...update_data,
          date_posted: null,
        },
      });
    }

    return await this.prisma.job_listing.update({
      where: {
        id: job_listing_id,
      },
      data: {
        ...update_data,
        date_posted: moment().toISOString(),
      },
    });
  }

  async deleteJobListing(user_id: number, job_listing_id: number) {
    if (!(await this.isValidJobListingAndUserId(user_id, job_listing_id))) {
      throw new UnauthorizedException();
    }

    return await this.prisma.job_listing.delete({
      where: {
        id: job_listing_id,
      },
    });
  }

  async publishJobListing(user_id: number, job_listing_id: number) {
    if (!(await this.isValidJobListingAndUserId(user_id, job_listing_id))) {
      throw new UnauthorizedException();
    }

    const listing = await this.prisma.job_listing.findFirst({
      where: {
        id: job_listing_id,
      },
    });

    if (listing.date_posted)
      throw new BadRequestException('Job already published');

    return await this.prisma.job_listing.update({
      where: {
        id: job_listing_id,
      },
      data: {
        date_posted: moment().toISOString(),
      },
    });
  }

  async getJobListingDetails(user_id: number, job_listing_id: number) {
    if (!(await this.isValidJobListingAndUserId(user_id, job_listing_id))) {
      throw new UnauthorizedException();
    }

    return await this.prisma.job_listing.findFirst({
      where: {
        id: job_listing_id,
      },
    });
  }
}
