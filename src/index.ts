import cors from 'cors'
import express from 'express'
import HttpServer from './class/server.class'
import logger from '../lib/logger'
import routes from './routes'

const server: any = HttpServer.instance

server.app.enable('trusty proxy')

server.app.use(express.urlencoded({ extended: true, limit: '50mb' }))
server.app.use(express.json({ limit: '50mb' }))

server.app.use(cors({ origin: true, credentials: true }))

server.app.use('/api/books', routes)

server.start()

process.on('uncaughtException', (err) => {
  logger.error(`[index/uncaughtException]: ${err.message}`)
  process.exit(1)
})