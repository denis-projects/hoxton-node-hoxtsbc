import { PrismaClient, User } from '@prisma/client'
import express from 'express'
import cors from 'cors'
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import 'dotenv/config'


const prisma = new PrismaClient({ log: ['query', 'error', 'warn', 'info'] })
const app = express()
app.use(cors())
app.use(express.json())
const PORT = 4000

function createToken(id: number) {
    // @ts-ignore
    return jwt.sign({ id: id }, process.env.MY_SECRET, { expiresIn: "3days" })
}

async function getUserFromToken(token: string) {
    try {
        // @ts-ignore
        const decodedData = jwt.verify(token, process.env.MY_SECRET)
        // @ts-ignore
        const user = await prisma.user.findUnique({ where: { id: decodedData.id } })

        return user
    }
    catch (err) {
        throw Error('BOOM!')
    }
}


// Endpoint for registering

app.post(`/register`, async (req, res) => {
    const { email, password, fullName } = req.body
    try {
        const hash = bcrypt.hashSync(password, 8)

        const user = await prisma.user.create({
            data: {
                email: email, password: hash, fullName: fullName,
                amountInAccount: Math.floor(Math.random() * 1000)
            }
        })

        res.send({ user, token: createToken(user.id) })

    }
    catch (err) {
        // @ts-ignore
        res.status(400).send({ error: err.message })
    }
})


// Endpoint to log-in

app.post(`/log-in`, async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await prisma.user.findUnique({ where: { email: email }, include: { transactions: true } })
        // @ts-ignore
        const passwordMatches = bcrypt.compareSync(password, user.password)

        if (user && passwordMatches) {

            res.send({ user, token: createToken(user.id) })
        }
        else {
            throw Error('BOOM!')
        }
    }
    catch (err) {
        res.status(400).send({ error: "Email/password you provided invalid" })
    }
})


app.post(`/banking-info`, async (req, res) => {
    const { token } = req.body

    try {
        const user = await getUserFromToken(token)

        res.send(user)
    }
    catch (err) {
        // @ts-ignore
        res.status(400).send({ error: err.message })
    }
})

app.listen(PORT, () => {
    console.log(`Server up and running: http://localhost/${PORT}`)
})