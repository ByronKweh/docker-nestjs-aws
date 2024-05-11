import { Controller, Get, Param, Query, ValidationPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SearchParamsDto } from 'src/shared/shared.dto';
import {
  JobDetailsResponseDTO,
  PublicJobListResponseDTO,
} from './candidate.dto';
import { CandidateService } from './candidate.service';

@Controller('candidate')
@ApiTags('Candidate | APIs accessible to candidates (General users)')
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}
  @Get('/job-listings')
  @ApiResponse({
    status: 200,
    type: PublicJobListResponseDTO,
  })
  async getJobListings(
    @Query(new ValidationPipe({ transform: true })) params: SearchParamsDto,
  ): Promise<PublicJobListResponseDTO> {
    return await this.candidateService.getJobListings(params);
  }

  @Get('/job-listings/:job_listing_id')
  @ApiResponse({
    status: 200,
    type: JobDetailsResponseDTO,
  })
  async getJobListingDetails(
    @Param('job_listing_id') job_listing_id: number,
  ): Promise<JobDetailsResponseDTO> {
    return await this.candidateService.getJobListingDetails(job_listing_id);
  }
}
