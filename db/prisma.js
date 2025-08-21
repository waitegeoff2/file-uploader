//here you are importing an instance of your prisma client package (in node modules) 
//to send queries to database. you are grabbing it from the code that was generated for your schema
const { PrismaClient } = require('../generated/prisma')
const prisma = new PrismaClient();

module.exports = prisma;