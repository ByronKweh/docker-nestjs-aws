# nestjs-jobs-backend

## Requirements 

- 🐳[**Docker**](https://docs.docker.com/get-docker/) - Latest
- 💡[**Node**](https://nodejs.org/en/download/current) - v18.20.2 (LTS)
- 🧶[**Yarn**](https://classic.yarnpkg.com/lang/en/docs/install/) - Latest
- 🎼[**Docker Compose**](https://docs.docker.com/compose/install/) - Latest

## Quickstart 

### To run the backend in watch mode & use the dockerized database
```bash
yarn:docker
```
### To run all tests
```bash
yarn test
```

## Technologies

- 🐅[**NestJs**](https://docs.nestjs.com/)
- 🏦[**Prisma**](https://www.prisma.io/docs/getting-started/quickstart)
- 😎[**Swagger**](https://swagger.io/solutions/api-documentation/)

## Development Guide

### Making database changes 

- Update the `schema.prisma` file
- Run `yarn migrate`

### Overview 
#### Modules: 

- Auth Module -> Handles all authentication
- Recruiter Module -> For recruiter functions
- Candidate Module -> For general functions
