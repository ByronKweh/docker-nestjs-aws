import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import {
  CreateJobListingDTO,
  JobListResponseDTO,
  JobListingStatus,
  RecruiterJobListItemDTO,
  SearchParamsDto,
} from './recruiter.dto';
import * as moment from 'moment-timezone';

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
}
