import { Test, TestingModule } from '@nestjs/testing';
import { RecruiterController } from './recruiter.controller';
import { JwtService } from '@nestjs/jwt';
import { RecruiterService } from './recruiter.service';
import { PrismaService } from 'src/prisma.service';

describe('RecruiterController', () => {
  let controller: RecruiterController;
  let recruiterService: RecruiterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecruiterController],
      providers: [JwtService, RecruiterService, PrismaService],
    }).compile();

    controller = module.get<RecruiterController>(RecruiterController);
    recruiterService = module.get<RecruiterService>(RecruiterService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return job listings for the logged-in recruiter', async () => {
    //@ts-expect-error they don't expect our auth guard to add a user into the request
    const req = {
      user: {
        id: 'recruiter123',
      },
    } as Request;

    const params = {
      searchTerm: 'developer',
      page: 1,
      pageSize: 10,
    };

    const expectedResult = {
      listings: [],
      page: 1,
      page_count: 10,
      page_size: 10,
    };
    const receruiterServiceMock = jest
      .spyOn(recruiterService, 'getJobListingByRecruiter')
      .mockResolvedValue(expectedResult);

    const result = await controller.getJobListingsByRecruiter(req, params);

    expect(result).toEqual(expectedResult);
    //TODO Fix this
    //@ts-expect-error jest doesnt' expect our auth guard to add a user into the request
    expect(receruiterServiceMock).toHaveBeenCalledWith(req.user.id, params);
  });
});
