import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as moment from 'moment-timezone';
import { SearchParamsDto } from 'src/shared/shared.dto';
import { PublicJobListResponseDTO } from './candidate.dto';

@Injectable()
export class CandidateService {
  constructor(private readonly prisma: PrismaService) {}

  async getJobListings(
    params: SearchParamsDto,
  ): Promise<PublicJobListResponseDTO> {
    const page_size = params.page_size || 10;
    const page = params.page || 1;
    const skip = (page - 1) * page_size;

    return await this.prisma.$transaction(async ($prisma) => {
      const result = await $prisma.job_listing.findMany({
        where: {
          date_posted: {
            not: null,
          },
        },
        orderBy: {
          updated_at: 'desc',
        },
        skip: skip,
        take: page_size,
      });

      const parsed_job_listings = result.map((job_listing) => {
        return {
          id: job_listing.id,
          title: job_listing.title,
          description: job_listing.description,
          date_posted: moment(job_listing.date_posted).format(`DD/MM/YYYY`),
        };
      });

      const count = await $prisma.job_listing.count({
        where: {
          date_posted: {
            not: null,
          },
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
}
