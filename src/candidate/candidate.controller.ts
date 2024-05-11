import { Controller, Get, Param, Query, ValidationPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CandidateService } from './candidate.service';
import {
  PublicJobListItemDTO,
  PublicJobListResponseDTO,
} from './candidate.dto';
import { SearchParamsDto } from 'src/shared/shared.dto';

@Controller('candidate')
@ApiTags('Candidate | APIs accessible to candidates (General users)')
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}
  @Get('/jobs')
  @ApiResponse({
    status: 200,
    type: PublicJobListResponseDTO,
  })
  async getJobListings(
    @Query(new ValidationPipe({ transform: true })) params: SearchParamsDto,
  ): Promise<PublicJobListResponseDTO> {
    return await this.candidateService.getJobListings(params);
  }

  //   @Get('/jobs/job_listing_id')
  //   @ApiResponse({
  //     status: 200,
  //     type: PublicJobListItemDTO,
  //   })
  //   async getJobListing(
  //     @Param('job_listing_id') job_listing_id: number,
  //   ): Promise<PublicJobListItemDTO> {
  //     // return await this.candidateService.getJobs(params);
  //     return {};
  //   }
}
