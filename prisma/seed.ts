import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();
async function main() {
  const alice = await prisma.user.upsert({
    where: { username: 'recruiter@pulsifi.com' },
    update: {},
    create: {
      username: 'recruiter@pulsifi.com',
      password: await bcrypt.hash('passsword', 10),
      recruiter: {
        create: {},
      },
    },
  });
  const bob = await prisma.user.upsert({
    where: { username: 'user@pulsifi.com' },
    update: {},
    create: {
      username: 'user@pulsifi.com',
      password: await bcrypt.hash('passsword', 10),
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
