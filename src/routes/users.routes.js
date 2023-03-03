const { Router } = require('express')

const usersRoutes = Router()

usersRoutes.post('/', (req, res) => {
  res.send('foi')
})

module.exports = usersRoutes
