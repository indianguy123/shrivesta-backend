//this is used anywhere where we want to query db

import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();
export default prisma;