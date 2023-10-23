import express from 'express'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'

const app = express()

const PORT = 3000
databaseService.connect()
//route mac dinh cura express
app.use(express.json())
app.get('/', (req, res) => {
  res.send('Khang Tran')
})

app.use('/users', usersRouter)
//localhost:3000/users/tweets

// app sử dụng một err handler tổng
app.use(defaultErrorHandler)
app.listen(PORT, () => {
  console.log(`Sever mo tren port ${PORT}`)
})
