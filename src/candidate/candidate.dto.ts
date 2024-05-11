import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponseDTO } from 'src/shared/shared.dto';

export class PublicJobListResponseDTO extends PaginatedResponseDTO {
  @ApiProperty({
    example: [
      {
        id: 1,
        title: 'Test Job 1',
        description: 'Come get a better job',
        date_posted: '22/22/2024',
      },
      {
        id: 2,
        title: 'Test Job 2',
        description: ' Come get the best job',
        date_posted: '22/22/2024',
      },
    ],
  })
  listings: PublicJobListItemDTO[];
}

export class PublicJobListItemDTO {
  id: number;
  title: string;
  description: string;
  date_posted: string;
}

export class JobDetailsResponseDTO {
  id: number;
  title: string;
  description: string;
  location: string;
  date_posted: Date;
}
