import express from 'express'
import logger from'morgan'

import { Server } from 'socket.io'
import { createServer } from 'node:http'

import dotenv from 'dotenv'
import { createClient } from '@libsql/client'

dotenv.config()

const port = process.env.PORT ?? 3000

const app = express()
const server = createServer(app)
const io = new Server(server, {
  connectionStateRecovery: {}
})

const db = createClient({
  url: process.env.DB_URL,
  authToken: process.env.DB_TOKEN
})

await db.execute(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    username TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`)

io.on('connection', async (socket) => {
  console.log('an user connected')

  socket.on('disconnect', () => {
    console.log('an user disconnected')
  })

  socket.on('chat message', async (msg) => {
    const username = socket.handshake.auth.username ?? 'anonymous'
    let result

    try {
      result = await db.execute({
        sql: 'INSERT INTO messages (content, username) VALUES(:msg, :username)',
        args: { msg, username }
      })
    } catch (error) {
      console.error('Error to insert messages: ', error)
      return
    }

    io.emit('chat message', msg, result.lastInsertRowid.toString(), username)
  })

  console.log('Data auth connection: ', socket.handshake.auth)

  if (!socket.recovered) {
    try {
      const result = await db.execute({
        sql: 'SELECT * FROM messages WHERE id > ? ORDER BY timestamp ASC',
        args: [socket.handshake.auth.serverOffset ?? 0]
      })

      result.rows.forEach((row) => {
        socket.emit('chat message', row.content, row.id.toString(), row.username)
      })
    } catch (error) {
      console.log('Error to get messages: ', error)
    }
  }
})

app.use(logger('dev'))

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/client/index.html')
})

server.listen(port, () => console.log('listening on port ' + port))