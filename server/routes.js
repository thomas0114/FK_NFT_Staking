const routes = require('next-routes')()

routes
  .add('/wager/new', '/wager/new')
  .add('/wager/:address', '/wager/details')
  .add('/oracle/:address', '/oracle/details')

module.exports = routes
