import { Test, TestingModule } from '@nestjs/testing';
import { CandidateService } from './candidate.service';
import { PrismaService } from 'src/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('CandidateService', () => {
  let service: CandidateService;
  let prismaMock: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CandidateService,
        {
          provide: PrismaService,
          useValue: {
            $transaction: jest.fn(),
            job_listing: {
              findMany: jest.fn(),
              count: jest.fn(),
              create: jest.fn(),
              findFirst: jest.fn(),
              delete: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CandidateService>(CandidateService);
    //@ts-expect-error mocked prisma
    prismaMock = module.get<PrismaService>(PrismaService);
  });

  it('getJobListings() - should return job listings with pagination and formatted dates', async () => {
    const mockListings = [
      {
        id: 1,
        title: 'Software Engineer',
        description: 'Develop software',
        date_posted: new Date('2022-01-01'),
      },
      {
        id: 2,
        title: 'Product Manager',
        description: 'Manage products',
        date_posted: new Date('2022-02-01'),
      },
    ];

    prismaMock.$transaction.mockImplementation(async (callback) => {
      return callback(prismaMock);
    });

    //@ts-expect-error mocked prisma
    prismaMock.job_listing.findMany.mockResolvedValueOnce(mockListings);
    //@ts-expect-error mocked prisma
    prismaMock.job_listing.count.mockResolvedValue(20); // Assume there are 30 total entries

    const params = { page_size: 10, page: 1 };
    const result = await service.getJobListings(params);

    expect(result).toEqual({
      listings: [
        {
          id: 1,
          title: 'Software Engineer',
          description: 'Develop software',
          date_posted: '01/01/2022',
        },
        {
          id: 2,
          title: 'Product Manager',
          description: 'Manage products',
          date_posted: '01/02/2022',
        },
      ],
      page: 1,
      page_size: 10,
      page_count: 2,
    });

    expect(prismaMock.job_listing.findMany).toHaveBeenCalledWith({
      where: { date_posted: { not: null } },
      orderBy: { updated_at: 'desc' },
      skip: 0,
      take: 10,
    });

    expect(prismaMock.job_listing.count).toHaveBeenCalledWith({
      where: { date_posted: { not: null } },
    });
  });

  it('getJobListingDetails() - should return job listing details when found', async () => {
    const date = new Date();
    const mockJobDetails = {
      id: 1,
      title: 'Software Developer',
      description: 'Develop high-quality software.',
      date_posted: date,
      location: 'Remote',
    };
    //@ts-expect-error prisma mock resolve
    prismaMock.job_listing.findFirst.mockResolvedValue(mockJobDetails);

    const result = await service.getJobListingDetails(1);
    expect(result).toEqual(mockJobDetails);
    expect(prismaMock.job_listing.findFirst).toHaveBeenCalledWith({
      where: {
        id: 1,
        date_posted: { not: null },
      },
      select: {
        id: true,
        title: true,
        description: true,
        date_posted: true,
        location: true,
      },
    });
  });

  it('getJobListingDetails()  - should throw NotFoundException when job listing is not found', async () => {
    //@ts-expect-error prisma mock resolve
    prismaMock.job_listing.findFirst.mockResolvedValue(null);

    await expect(service.getJobListingDetails(1)).rejects.toThrow(
      NotFoundException,
    );
    expect(prismaMock.job_listing.findFirst).toHaveBeenCalledWith({
      where: {
        id: 1,
        date_posted: { not: null },
      },
      select: {
        id: true,
        title: true,
        description: true,
        date_posted: true,
        location: true,
      },
    });
  });
});
