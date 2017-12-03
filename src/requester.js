const Got = require('got')
const Url = require('url')
const Boom = require('boom')

module.exports = function Requester (defaultParams) {
  const { hostname, port, protocol } = defaultParams

  function getGotParams (requestInfo) {
    const timeout = 10 ^ 4 // 10 seconds
    const retries = 2
    const { pathname, query, hash } = requestInfo

    const url = Url.format({
      protocol,
      hostname,
      port,
      pathname,
      query,
      hash,
    })

    const { method, body } = requestInfo
    const gotOptions = {
      method,
      body,
      encoding: null,
      timeout,
      retries,
      followRedirect: true,
      decompress: false,
    }

    return {
      url,
      gotOptions,
    }
  }

  async function exec (requestInfo) {
    const options = getGotParams(requestInfo)
    try {
      const response = await Got(options.url, options.gotOptions)
      return response
    } catch (err) {
      if (!err.response) {
        return Boom.badGateway()
      }
      return err.response
    }
  }

  return {
    exec,
  }
}
