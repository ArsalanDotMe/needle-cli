const SocketIO = require('socket.io-client')
const chalk = require('chalk')
const Promise = require('bluebird')

const Requester = require('./requester')

module.exports = function needleClient (params) {
  let socket = null
  let tunnel = null
  const { version } = params

  function onSocketConnect () {
    console.log(chalk.green(`Connected to ${params.tunnelHost}`))
  }

  async function onTunnelPush (requestInfo, reply) {
    const { hostname, port, protocol } = params
    const requester = Requester({
      hostname,
      port,
      protocol,
    })

    const response = await requester.exec(requestInfo)
    reply(response)
  }

  async function initWebSockets () {
    const connectTimeout = 1000 * 5
    socket = SocketIO(params.tunnelHost)

    await new Promise((resolve) => {
      socket.on('connect', () => {
        onSocketConnect()
        resolve()
      })
    }).timeout(connectTimeout)

    socket.on('tunnel:push', onTunnelPush)
  }

  function onNewTunnelCreated (newTunnel) {
    tunnel = newTunnel
    console.log(chalk.green(`Your local service is live at ${params.tunnelProtocol}://${tunnel.slug}.${params.tunnelHost}`))
  }

  async function start () {
    await initWebSockets()
    socket.emit('tunnel:new', { version }, onNewTunnelCreated)
  }

  return {
    start,
    initWebSockets,
  }
}
