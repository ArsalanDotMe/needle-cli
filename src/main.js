const program = require('commander')
const pkg = require('../package.json')

const needleClient = require('./client')

program
  .version(pkg.version)
  .option('-p, --port <n>', 'Port of your local service', parseInt)
  .option('-h, --hostname [hostname]', 'host name of your local service', 'localhost')
  .option('-P, --protocol', 'Protocol for your local server: [http, https]', 'http')
  .parse(process.argv)

const params = {
  version: pkg.version,
  tunnelHost: 'needle.live',
  tunnelProtocol: 'https',
  port: program.port,
  protocol: program.protocol,
  hostname: program.hostname,
}

const client = needleClient(params)
client.start()
