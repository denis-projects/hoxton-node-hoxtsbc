import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({ log: ['query', 'error', 'warn', 'info'] })

const users = [
    {
        email: 'denis@email.com',
        fullName: 'Denis Mimini',
        password: 'denis123',
        amountInAccount: 1000
    },
    {
        email: 'nico@email.com',
        fullName: 'Nicolas Marcora',
        password: 'nico123',
        amountInAccount: 1000
    },
    {
        email: 'ed@email.com',
        fullName: 'Edgar Putans',
        password: 'ed123',
        amountInAccount: 1000
    }
]

const transactions = [
    {
        userId: 1,
        amount: 300,
        currency: 'USD',
        receiverOrSender: 'sender',
        completedAt: '3/16/2022',
        isPositive: true
    },
    {
        userId: 2,
        amount: 400,
        currency: 'USD',
        receiverOrSender: 'receiver',
        completedAt: '3/16/2022',
        isPositive: true
    },
    {
        userId: 2,
        amount: 500,
        currency: 'USD',
        receiverOrSender: 'sender',
        completedAt: '3/16/2022',
        isPositive: true
    }
]

async function createStuff() {
    for (const user of users) {
        await prisma.user.create({ data: user })
    }

    for (const transaction of transactions) {
        await prisma.transaction.create({ data: transaction })
    }
}

createStuff()