import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';
import { PaginatedResponseDTO } from 'src/shared/shared.dto';

export interface RecruiterJobListItemDTO {
  id: number;
  title: string;
  description: string;
  location: string;
  status: JobListingStatus;
}

export enum JobListingStatus {
  PUBLISHED = 'PUBLISHED',
  DRAFT = 'DRAFT',
}

export class JobListResponseDTO extends PaginatedResponseDTO {
  @ApiProperty({
    example: [
      {
        id: 1,
        title: 'Test Job 1',
        location: 'Singapore',
        description: 'Come get a better job',
        status: JobListingStatus.DRAFT,
      },
      {
        id: 2,
        title: 'Test Job 2',
        location: 'Worldwide',
        description: ' Come get the best job',
        status: JobListingStatus.PUBLISHED,
      },
    ],
  })
  listings: RecruiterJobListItemDTO[];
}

export class CreateJobListingDTO {
  @ApiProperty({
    example: 'Sample Title',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Sample description',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 'Sample location',
  })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({
    example: true,
  })
  @IsBoolean()
  should_publish: boolean;
}

export class EditJobListingDTO extends CreateJobListingDTO {}
