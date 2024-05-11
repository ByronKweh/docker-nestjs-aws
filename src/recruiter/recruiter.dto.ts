import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger/dist/decorators/api-property.decorator';
import {
  IsOptional,
  IsInt,
  Min,
  IsString,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';

export class SearchParamsDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
  })
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({
    description: 'Number of results per page',
    example: 10,
  })
  page_size?: number;
}

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

export class JobListResponseDTO {
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
  @ApiProperty({
    example: 1,
  })
  page: number;
  @ApiProperty({
    example: 10,
  })
  page_size: number;
  @ApiProperty({
    example: 100,
  })
  page_count: number;
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
