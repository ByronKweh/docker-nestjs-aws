import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RecruiterAuthGuard } from 'src/auth/guards/recruiter.guard';
import { RecruiterService } from './recruiter.service';
import {
  CreateJobListingDTO,
  EditJobListingDTO,
  JobListResponseDTO,
} from './recruiter.dto';
import { User } from 'src/auth/decorators/user.decorator';
import { RequestUserEntity } from 'src/auth/auth.dto';
import { SearchParamsDto } from 'src/shared/shared.dto';

@Controller('recruiter')
@ApiTags('Recruiter | Recruiter related APIs')
export class RecruiterController {
  constructor(private readonly recruiterService: RecruiterService) {}

  @Get('/job-listings')
  @ApiBearerAuth()
  @UseGuards(RecruiterAuthGuard)
  @ApiResponse({
    status: 200,
    type: JobListResponseDTO,
  })
  @ApiOperation({ summary: 'List all job listings created by recruiter' })
  async getJobListingsByRecruiter(
    @User() user: RequestUserEntity,
    @Query(new ValidationPipe({ transform: true })) params: SearchParamsDto,
  ): Promise<JobListResponseDTO> {
    return await this.recruiterService.getJobListingByRecruiter(
      user.id,
      params,
    );
  }

  @Post('/job-listings')
  @ApiBearerAuth()
  @UseGuards(RecruiterAuthGuard)
  @ApiResponse({
    status: 201,
  })
  async createJobListing(
    @User() user: RequestUserEntity,
    @Body() body: CreateJobListingDTO,
  ) {
    return await this.recruiterService.createJobListing(user.id, body);
  }

  @Put('/job-listings/:job_listing_id')
  @ApiBearerAuth()
  @UseGuards(RecruiterAuthGuard)
  @ApiResponse({
    status: 201,
  })
  async updateJobListing(
    @Param('job_listing_id') job_listing_id: number,
    @User() user: RequestUserEntity,
    @Body() body: EditJobListingDTO,
  ) {
    return await this.recruiterService.updateJobListing(
      user.id,
      job_listing_id,
      body,
    );
  }

  @Delete('/job-listings/:job_listing_id')
  @ApiBearerAuth()
  @UseGuards(RecruiterAuthGuard)
  @ApiResponse({
    status: 204,
  })
  async deleteJobListing(
    @Param('job_listing_id') job_listing_id: number,
    @User() user: RequestUserEntity,
  ) {
    return await this.recruiterService.deleteJobListing(
      user.id,
      job_listing_id,
    );
  }

  @Post('/job-listings/publish/:job_listing_id')
  @ApiBearerAuth()
  @UseGuards(RecruiterAuthGuard)
  @ApiResponse({
    status: 201,
  })
  async publishJobListing(
    @Param('job_listing_id') job_listing_id: number,
    @User() user: RequestUserEntity,
  ) {
    return await this.recruiterService.publishJobListing(
      user.id,
      job_listing_id,
    );
  }

  @Get('/job-listings/:job_listing_id')
  @ApiBearerAuth()
  @UseGuards(RecruiterAuthGuard)
  @ApiResponse({
    status: 200,
  })
  async getJobListingDetails(
    @Param('job_listing_id') job_listing_id: number,
    @User() user: RequestUserEntity,
  ) {
    return await this.recruiterService.publishJobListing(
      user.id,
      job_listing_id,
    );
  }
}
