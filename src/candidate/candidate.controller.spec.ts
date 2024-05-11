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

  it('getJobListings() - should return job listings for the logged-in recruiter', async () => {
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
    //TODO Fix this
    expect(receruiterServiceMock).toHaveBeenCalledWith(params);
  });
});
