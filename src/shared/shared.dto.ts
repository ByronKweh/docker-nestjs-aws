import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';

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

export class PaginatedResponseDTO {
  @ApiProperty({
    example: 2,
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
