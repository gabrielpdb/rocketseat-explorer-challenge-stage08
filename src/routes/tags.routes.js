const { Router } = require('express')

const tagsRoutes = Router()

tagsRoutes.get('/', (req, res) => res.send('tags'))

module.exports = tagsRoutes
