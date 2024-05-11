import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReceruiterAuthGuard } from 'src/auth/guards/recruiter.guard';
import { RecruiterService } from './recruiter.service';
import { JobListResponseDTO, SearchParamsDto } from './recruiter.dto';

@Controller('recruiter')
@ApiTags('Recruiter | Recruiter related APIs')
export class RecruiterController {
  constructor(private readonly recruiterService: RecruiterService) {}

  @Get('/jobs')
  @ApiBearerAuth()
  @UseGuards(ReceruiterAuthGuard)
  @ApiResponse({
    status: 200,
    type: JobListResponseDTO,
  })
  async getJobListingsByRecruiter(
    @Request() req,
    @Query(new ValidationPipe({ transform: true })) params: SearchParamsDto,
  ) {
    return await this.recruiterService.getJobListingByRecruiter(
      req.user.id,
      params,
    );
  }

  @Post('/jobs')
  createJobListing() {}

  @Put('/jobs/:job_id')
  updateJobListing() {}

  @Delete('/jobs/:job_id')
  deleteJobListing() {}
}
