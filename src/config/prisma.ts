//this is used anywhere where we want to query db

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export default prisma;