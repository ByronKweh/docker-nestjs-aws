import { Test, TestingModule } from '@nestjs/testing';
import { CandidateController } from './candidate.controller';
import { CandidateService } from './candidate.service';
import { PrismaService } from 'src/prisma.service';

describe('CandidateController', () => {
  let controller: CandidateController;
  let service: CandidateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CandidateController],
      providers: [CandidateService, PrismaService],
    }).compile();

    controller = module.get<CandidateController>(CandidateController);
    service = module.get<CandidateService>(CandidateService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getJobListings() - should return job listings ', async () => {
    const params = {
      page: 1,
      page_size: 10,
    };

    const expectedResult = {
      listings: [],
      page: 1,
      page_count: 10,
      page_size: 10,
    };
    const receruiterServiceMock = jest
      .spyOn(service, 'getJobListings')
      .mockResolvedValue(expectedResult);

    const result = await controller.getJobListings(params);

    expect(result).toEqual(expectedResult);
    expect(receruiterServiceMock).toHaveBeenCalledWith(params);
  });

  it('getJobListingDetails() - should return job listing details', async () => {
    const job_listing_id = 123;
    const expectedResult = {
      id: 5,
      title: 'Sample Title',
      description: 'Sample description',
      date_posted: new Date(),
      location: 'Sample location',
    };
    const receruiterServiceMock = jest
      .spyOn(service, 'getJobListingDetails')
      .mockResolvedValue(expectedResult);

    const result = await controller.getJobListingDetails(job_listing_id);

    expect(result).toEqual(expectedResult);
    expect(receruiterServiceMock).toHaveBeenCalledWith(job_listing_id);
  });
});
