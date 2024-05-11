import { Module } from '@nestjs/common';
import { CandidateController } from './candidate.controller';
import { CandidateService } from './candidate.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [CandidateController],
  providers: [CandidateService, PrismaService],
})
export class CandidateModule {}
