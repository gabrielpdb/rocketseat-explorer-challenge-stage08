const { Router } = require('express')

const UsersController = require('../controllers/UsersController')
const usersRoutes = Router()

const usersController = new UsersController()

usersRoutes.post('/create', usersController.create)

module.exports = usersRoutes
