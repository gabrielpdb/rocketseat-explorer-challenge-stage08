const { Router } = require('express')

const usersRoutes = Router()

usersRoutes.get('/', (req, res) => res.send('users'))

module.exports = usersRoutes
