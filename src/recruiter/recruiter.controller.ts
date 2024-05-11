import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RecruiterAuthGuard } from 'src/auth/guards/recruiter.guard';
import { RecruiterService } from './recruiter.service';
import {
  CreateJobListingDTO,
  JobListResponseDTO,
  SearchParamsDto,
} from './recruiter.dto';
import { User } from 'src/auth/decorators/user.decorator';
import { RequestUserEntity } from 'src/auth/auth.dto';

@Controller('recruiter')
@ApiTags('Recruiter | Recruiter related APIs')
export class RecruiterController {
  constructor(private readonly recruiterService: RecruiterService) {}

  @Get('/jobs')
  @ApiBearerAuth()
  @UseGuards(RecruiterAuthGuard)
  @ApiResponse({
    status: 200,
    type: JobListResponseDTO,
  })
  async getJobListingsByRecruiter(
    @User() user: RequestUserEntity,
    @Query(new ValidationPipe({ transform: true })) params: SearchParamsDto,
  ) {
    return await this.recruiterService.getJobListingByRecruiter(
      user.id,
      params,
    );
  }

  @Post('/jobs')
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

  @Put('/jobs/:job_id')
  updateJobListing() {}

  @Delete('/jobs/:job_id')
  deleteJobListing() {}
}
