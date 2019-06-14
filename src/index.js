import express from 'express'
import path from 'path'
import { helloObject } from './module-1'

const app = express()

const {
    PORT = 3000
} = process.env

app.use(express.static(path.join(__dirname, '../dist/public')))

// Catch all or 404
app.all('*', (req, res) => {
    res.json(helloObject())
})

app.listen(PORT, () => {
    console.log(`server stated at http://localhost:${PORT}`)
})