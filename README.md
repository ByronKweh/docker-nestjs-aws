# nestjs-jobs-backend

## Requirements 

- 🐳[**Docker**](https://docs.docker.com/get-docker/) - Latest - a platform designed to help developers build, share, and run container applications.
- 💡[**Node**](https://nodejs.org/en/download/current) - v18.20.2 (LTS) - a JavaScript runtime built on Chrome's V8 JavaScript engine.
- 🧶[**Yarn**](https://classic.yarnpkg.com/lang/en/docs/install/) - Latest - a package manager that doubles down as project manager. 
- 🎼[**Docker Compose**](https://docs.docker.com/compose/install/) - Latest - a tool for defining and running multi-container applications.

## Quickstart 

### To run the backend in watch mode & use the dockerized database
```bash
yarn:docker
```
### To run all tests
```bash
yarn test
```

## Playground 

You can play with the APIs via our Swagger [here](http://ec2-3-0-29-165.ap-southeast-1.compute.amazonaws.com:3000/swagger#/) or just run it locally and it should be available on `localhost:3000/swagger`

#### Recruiter 1 credentials 
username: `recruiter@pulsifi.com`
password; `password`

#### General candidate
username: `user@pulsifi.com`
password: `password`

#### Recruiter 2 credentials 
username: `recruiter2@pulsifi.com`
password; `password`

## Technologies

- 🐅[**NestJs**](https://docs.nestjs.com/) - a framework for building efficient, scalable Node.js server-side applications.
- 🏦[**Prisma**](https://www.prisma.io/docs/getting-started/quickstart) - unlocks a new level of developer experience when working with databases thanks to its intuitive data model, automated migrations, type-safety & auto-completion.
- 😎[**Swagger**](https://swagger.io/solutions/api-documentation/) - takes the manual work out of API documentation, with a range of solutions for generating, visualizing, and maintaining API docs.
- 🐈[**Github Actions**](https://github.com/features/actions) - automate all your software workflows, now with world-class CI/CD.

## Development Guide

### Standards 
- Please put all interfaces and classes into the `.dto.ts` files
- Shared interfaces and classes can be put into the `shared` folder
- Update the `config.ts` file for env changes to ensure run-time checks for the env works
- Controllers - Handle the high level things like swagger documentation decorators, class validators (to validate all inputs to the API, so we don't have to care if the client gives us something we don't expect)
- Services - Handles the business logic with a given set of *perfect* data from the controller
- Modules - Bundles a bunch of controllers and services so its easy to seperate domains

### Making database changes 

- Update the `schema.prisma` file
- Run `yarn migrate`

### Overview 
#### Modules: 

- Auth Module -> Handles all authentication
- Recruiter Module -> For recruiter functions
- Candidate Module -> For general functions

#### Deployment 
- Deployment only occurs when a new commit is committed to `main` branch
- The EC2 instance will pull the code from Github, and install new dependencies if needed
- Then the migrations in the code will be applied *safely* to the database via `npx prisma migrate deploy`
- The project is built
- The pm2 instances are killed and re-started using the new built files in the /dist folder

## CAUTION
- Be careful when adding new variables into the `.env` file as the deployed server needs to have it's `.env` manually updated, this is to prevent anyone knowing what is the actual database information that the staging environment is connected to.
- If you have an option to `reset database` when running `yarn migrate`, DO NOT DO IT. It means that you have written a migration that is not applicable unless the database is *NUKED*.

## Improvements
- Currently the only tests in the code base are unit tests, which is unfortunate. It means you can make a perfect API from the start of the controller function but it still does not test what's outside the API. (e.g. if the endpoint `@Get` is calling the wrong function, you can't test actual high level database behaviour because the nature of unit tests are to mock the database responses, etc.)
- There are quite a few `//@ts-expect-errors` in the code base due to either:
  - Prisma and jest issues such as jest not detecting the extension of interfaces when the `includes` keyword is used
  - The `moment-timezone` library has not been spied and mocked properly
- Proper deployments should be blue/green with 0 downtime, and preferrably would use something along the lines of CodePipeline with CodeDeploy instead. 
- Custom exceptions - Currently there's just BadRequestExceptions and NotFoundExceptions, would be best to extend the exiting exceptions and create more explicit exceptions to make it easier to differentiate (e.g. JobAlreadyPublishedException)
- *Possible Improvement* - Change to role based guards instead of standard guards
