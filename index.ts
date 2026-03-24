import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
  // Trocamos "your_table_name" por "category"
  const data = await prisma.category.findMany();
  console.log(data);
};

main();
