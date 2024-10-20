import {PrismaClient, medicine_type} from '@prisma/client'

const Prisma = new PrismaClient({
    errorFormat: "minimal"
})

export default Prisma