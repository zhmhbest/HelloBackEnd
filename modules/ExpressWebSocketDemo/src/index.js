// 切换工作路径到当前文件目录下
process.chdir(__dirname)

const path = require('path')

const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const listenPort = 3000

// 映射 socket.io 到 node_modules
app.use('/static/socket.io.js', (req, res) => {
    res.sendFile(path.join(__dirname, '../node_modules/socket.io/client-dist/socket.io.js'))
});

// 静态目录
app.use('/static', express.static('static'))


// 根目录
app.get('/', (req, res) => {
    res.redirect(301, '/static/index.html')
})

// Websocket
io.on('connection', client => {
    const clients = io.sockets
    console.log('WS Connection')
    client.emit('message', 'Welcome!');
    client.on('message', msg => {
        clients.emit('broadcast', msg);
    })
    client.on('disconnect', () => {
        console.log('WS Disconnected')
    })
})

// 启动服务
server.listen(listenPort, () => {
    const host = server.address().address
    const port = server.address().port
    console.log(`App listening at http://${host}:${port}`)
})
