import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment-timezone';

const prisma = new PrismaClient();
async function main() {
  const recruiter1 = await prisma.user.upsert({
    where: { username: 'recruiter@pulsifi.com' },
    update: {},
    create: {
      username: 'recruiter@pulsifi.com',
      password: await bcrypt.hash('password', 10),
      recruiter: {
        create: {
          job_listing: {
            createMany: {
              data: [
                {
                  title: 'Test Job 1',
                  description: 'Come get a better job',
                  date_posted: moment().toISOString(),
                  location: 'Singapore',
                },
                {
                  title: 'Test Job 2',
                  description: ' Come get the best job',
                  location: 'Worldwide',
                },
              ],
            },
          },
        },
      },
    },
  });
  const recruiter2 = await prisma.user.upsert({
    where: { username: 'recruiter2@pulsifi.com' },
    update: {},
    create: {
      username: 'recruiter2@pulsifi.com',
      password: await bcrypt.hash('password', 10),
      recruiter: {
        create: {
          job_listing: {
            createMany: {
              data: [
                {
                  title: 'Test Job X',
                  description: 'Come get a better X',
                  date_posted: moment().toISOString(),
                  location: 'Remote',
                },
                {
                  title: 'Test Job Y',
                  description: ' Come get the best Y',
                  location: 'USA',
                },
              ],
            },
          },
        },
      },
    },
  });
  const candidate1 = await prisma.user.upsert({
    where: { username: 'user@pulsifi.com' },
    update: {},
    create: {
      username: 'user@pulsifi.com',
      password: await bcrypt.hash('password', 10),
    },
  });
  console.log({ recruiter1, candidate1, recruiter2 });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
