import { Test, TestingModule } from '@nestjs/testing';
import { RecruiterController } from './recruiter.controller';
import { JwtService } from '@nestjs/jwt';
import { RecruiterService } from './recruiter.service';
import { PrismaService } from 'src/prisma.service';
import { RequestUserEntity } from 'src/auth/auth.dto';

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

  it('getJobListingsByRecruiter() - should return job listings for the logged-in recruiter', async () => {
    const user = {
      id: 123,
      username: '123',
    } as RequestUserEntity;

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

    const result = await controller.getJobListingsByRecruiter(user, params);

    expect(result).toEqual(expectedResult);
    //TODO Fix this
    expect(receruiterServiceMock).toHaveBeenCalledWith(user.id, params);
  });

  it('createJobListing() - should call the service create function with the payload provided', async () => {
    const user = {
      id: 123,
      username: '123',
    } as RequestUserEntity;

    const payload = {
      title: 'Sample 2 Title',
      description: 'Sample 2 description',
      location: 'Sample 2 location',
      should_publish: false,
    };

    const expectedResult = {
      id: 4,
      title: 'Sample 2 Title',
      location: 'Sample 2 location',
      description: 'Sample 2 description',
      date_posted: null,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
      created_by_id: 1,
    };

    const receruiterServiceMock = jest
      .spyOn(recruiterService, 'createJobListing')
      .mockResolvedValue(expectedResult);

    const result = await controller.createJobListing(user, payload);

    expect(result).toEqual(expectedResult);
    //TODO Fix this
    expect(receruiterServiceMock).toHaveBeenCalledWith(user.id, payload);
  });

  it('updateJobListing() - should call the service update function with the payload provided', async () => {
    const job_listing_id = 1;

    const user = {
      id: 123,
      username: '123',
    } as RequestUserEntity;

    const payload = {
      title: 'Sample Update Title',
      description: 'Sample Update description',
      location: 'Sample Update location',
      should_publish: false,
    };

    const expectedResult = {
      id: 2,
      title: 'Test Job 2',
      location: 'Worldwide',
      description: ' Come get the best job',
      date_posted: null,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
      created_by_id: 1,
    };

    const receruiterServiceMock = jest
      .spyOn(recruiterService, 'updateJobListing')
      .mockResolvedValue(expectedResult);

    const result = await controller.updateJobListing(
      job_listing_id,
      user,
      payload,
    );

    expect(result).toEqual(expectedResult);
    //TODO Fix this
    expect(receruiterServiceMock).toHaveBeenCalledWith(
      user.id,
      job_listing_id,
      payload,
    );
  });

  it('deleteJobListing() - should call the service create function with the payload provided', async () => {
    const job_listing_id = 1;

    const user = {
      id: 123,
      username: '123',
    } as RequestUserEntity;

    const expectedResult = {
      id: 2,
      title: 'Test Job 2',
      location: 'Worldwide',
      description: ' Come get the best job',
      date_posted: null,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
      created_by_id: 1,
    };

    const receruiterServiceMock = jest
      .spyOn(recruiterService, 'deleteJobListing')
      .mockResolvedValue(expectedResult);

    const result = await controller.deleteJobListing(job_listing_id, user);

    expect(result).toEqual(expectedResult);
    //TODO Fix this
    expect(receruiterServiceMock).toHaveBeenCalledWith(user.id, job_listing_id);
  });
});
