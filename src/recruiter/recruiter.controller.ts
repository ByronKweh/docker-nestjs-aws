import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('recruiter')
@ApiTags('Recruiter | Recruiter related APIs')
export class RecruiterController {}
