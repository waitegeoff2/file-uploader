//here you are importing an instance of your prisma client package (in node modules) 
//to send queries to database. you are grabbing it from the code that was generated for your schema
const { PrismaClient } = require('../generated/prisma')
const prisma = new PrismaClient();

// async function main() {
//     const allUsers = await prisma.user.findMany()
//   console.log(allUsers)
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect()
//   })
//   .catch(async (e) => {
//     console.error(e)
//     await prisma.$disconnect()
//     process.exit(1)
//   })

// exporting the prisma client to be used elsewhere
module.exports = prisma;