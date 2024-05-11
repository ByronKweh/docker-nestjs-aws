import { Controller, Delete, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReceruiterAuthGuard } from 'src/auth/guards/recruiter.guard';

@Controller('recruiter')
@ApiTags('Recruiter | Recruiter related APIs')
export class RecruiterController {
  @Get('/jobs')
  @ApiBearerAuth()
  @UseGuards(ReceruiterAuthGuard)
  getJobListingsByRecruiter() {}

  @Post('/jobs')
  createJobListing() {}

  @Put('/jobs/:job_id')
  updateJobListing() {}

  @Delete('/jobs/:job_id')
  deleteJobListing() {}
}
