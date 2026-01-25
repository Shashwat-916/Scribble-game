import express from "express"
import { HTTP_PORT } from "@repo/env/common"
import prisma from "@repo/prisma/prisma"

const app = express()

app.use(express.json())

app.listen(HTTP_PORT, () => {
    console.log(`HTTP : Server running on PORT :${HTTP_PORT}`)
})