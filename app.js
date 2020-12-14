const WebSocket = require('ws')
const http = require('http')
const express = require('express')
/**
 * web server
 */
const app = express()
app.use('/', express.static('./public'))


const server = http.createServer(app)

let ws = new WebSocket.Server({server})

ws.on('connection', (client) => {
  client.on('message', (msg) => {
    let info = JSON.parse(msg)


    ws.clients.forEach((clientOne) => {
      if (clientOne === client) {
        info.code = 1
        console.log(info)
        clientOne.send(JSON.stringify(info))
      }
      else {
        info.code = 2
        console.log(info)
        clientOne.send(JSON.stringify(info))
      }
    })
    console.log('来自前端的消息' + msg)
  })
  client.on('close', () => {
    console.log('前端主动断开连接')
  })
})


server.listen(80, () => {
  console.log('servre started')
})

