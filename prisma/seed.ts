import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment-timezone';

const prisma = new PrismaClient();
async function main() {
  const alice = await prisma.user.upsert({
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
  const bob = await prisma.user.upsert({
    where: { username: 'user@pulsifi.com' },
    update: {},
    create: {
      username: 'user@pulsifi.com',
      password: await bcrypt.hash('password', 10),
    },
  });
  console.log({ alice, bob });
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
