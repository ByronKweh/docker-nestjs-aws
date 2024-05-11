import { Test, TestingModule } from '@nestjs/testing';
import { RecruiterService } from './recruiter.service';
import { PrismaService } from 'src/prisma.service';
import { JobListingStatus } from './recruiter.dto';
import * as moment from 'moment-timezone';

describe('RecruiterService', () => {
  let service: RecruiterService;
  let prismaMock: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecruiterService,
        {
          provide: PrismaService,
          useValue: {
            $transaction: jest.fn(),
            job_listing: {
              findMany: jest.fn(),
              count: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<RecruiterService>(RecruiterService);
    //@ts-expect-error Jest mock
    prismaMock = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('List job listings for recruiter - should handle default parameters when none are provided', async () => {
    prismaMock.$transaction.mockImplementation(async (callback) => {
      return callback(prismaMock);
    });
    //@ts-expect-error Jest mock
    prismaMock.job_listing.findMany.mockResolvedValue([]);
    //@ts-expect-error Jest mock
    prismaMock.job_listing.count.mockResolvedValue(0);

    const result = await service.getJobListingByRecruiter(1, {});

    expect(result).toEqual({
      listings: [],
      page: 1,
      page_size: 10,
      page_count: 0,
    });

    expect(prismaMock.job_listing.findMany).toHaveBeenCalledWith({
      where: { created_by_id: 1 },
      orderBy: { updated_at: 'desc' },
      skip: 0,
      take: 10,
    });

    expect(prismaMock.job_listing.count).toHaveBeenCalledWith({
      where: { created_by_id: 1 },
    });
  });

  it('List job listings for recruiter - should correctly paginate the results', async () => {
    prismaMock.$transaction.mockImplementation(async (callback) => {
      return callback(prismaMock);
    });

    //@ts-expect-error Jest mock
    prismaMock.job_listing.findMany.mockResolvedValueOnce([]); // Simulate no results for simplicity
    //@ts-expect-error Jest mock
    prismaMock.job_listing.count.mockResolvedValue(30); // Assume there are 30 total entries

    const result = await service.getJobListingByRecruiter(1, {
      page: 2,
      page_size: 5,
    });

    expect(result).toEqual(
      expect.objectContaining({
        page: 2,
        page_size: 5,
        page_count: 6, // 30 / 5
      }),
    );

    expect(prismaMock.job_listing.findMany).toHaveBeenCalledWith({
      where: { created_by_id: 1 },
      orderBy: { updated_at: 'desc' },
      skip: 5, // (2 - 1) * 5
      take: 5,
    });
  });

  it('List job listings for recruiter - should handle no job listings available', async () => {
    prismaMock.$transaction.mockImplementation(async (callback) => {
      return callback(prismaMock);
    });

    //@ts-expect-error Jest mock
    prismaMock.job_listing.findMany.mockResolvedValue([]);
    //@ts-expect-error Jest mock
    prismaMock.job_listing.count.mockResolvedValue(0);

    const result = await service.getJobListingByRecruiter(1, {
      page: 1,
      page_size: 10,
    });

    expect(result).toEqual({
      listings: [],
      page: 1,
      page_size: 10,
      page_count: 0,
    });
  });

  it('List job listings for recruiter - should handle errors gracefully', async () => {
    prismaMock.$transaction.mockImplementation(() => {
      throw new Error('Database error');
    });

    await expect(
      service.getJobListingByRecruiter(1, { page: 1, page_size: 10 }),
    ).rejects.toThrow('Database error');
  });

  it('List job listings for recruiter - should correctly parse job listings', async () => {
    const mockData = [
      {
        id: 1,
        title: 'Developer',
        description: 'Develop stuff',
        location: 'Remote',
        date_posted: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        title: 'Tester',
        description: 'Test stuff',
        location: 'On-site',
        date_posted: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    prismaMock.$transaction.mockImplementation(async (callback) => {
      return callback(prismaMock);
    });

    //@ts-expect-error Jest mock
    prismaMock.job_listing.findMany.mockResolvedValue(mockData);
    //@ts-expect-error Jest mock
    prismaMock.job_listing.count.mockResolvedValue(2);

    const result = await service.getJobListingByRecruiter(1, {
      page: 1,
      page_size: 10,
    });

    expect(result.listings).toEqual([
      {
        id: 1,
        title: 'Developer',
        description: 'Develop stuff',
        location: 'Remote',
        status: JobListingStatus.PUBLISHED,
      },
      {
        id: 2,
        title: 'Tester',
        description: 'Test stuff',
        location: 'On-site',
        status: JobListingStatus.DRAFT,
      },
    ]);
  });

  it('should create a job listing with date posted', async () => {
    const dto = {
      title: 'Software Engineer',
      description: 'Develop full-stack applications',
      location: 'Remote',
      should_publish: true,
    };
    const expectedDate = moment().toISOString();
    //@ts-expect-error Jest mock
    prismaMock.job_listing.create.mockResolvedValue({
      ...dto,
      created_by_id: 1,
      date_posted: expectedDate,
    });

    const result = await service.createJobListing(1, dto);

    expect(prismaMock.job_listing.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        title: dto.title,
        description: dto.description,
        location: dto.location,
        created_by: {
          connect: {
            user_id: 1,
          },
        },
        //TODO Fix this, moment mocking issue
        date_posted: expect.any(String),
      }),
    });
    expect(result).toEqual({
      ...dto,
      created_by_id: 1,
      date_posted: expectedDate,
    });
  });

  it('should create a job listing without date posted', async () => {
    const dto = {
      title: 'Software Engineer',
      description: 'Develop full-stack applications',
      location: 'Remote',
      should_publish: false,
    };

    //@ts-expect-error Jest mock doesnt recoginize optional create fields
    jest.spyOn(prismaMock.job_listing, 'create').mockResolvedValue({
      ...dto,
      created_by_id: 1,
      date_posted: undefined,
    });

    const result = await service.createJobListing(1, dto);
    expect(prismaMock.job_listing.create).toHaveBeenCalledWith({
      data: {
        title: dto.title,
        description: dto.description,
        location: dto.location,
        created_by: {
          connect: {
            user_id: 1,
          },
        },
        date_posted: undefined,
      },
    });
    expect(result).toEqual({
      ...dto,
      created_by_id: 1,
      date_posted: undefined,
    });
  });

  // it('Create job listing - should create published job listing', async () => {
  //   const prisma_spy = jest.spyOn(prisma.job_listing, 'create');
  // });

  // it('Create job listing - should create draft job listing', async () => {});
});
