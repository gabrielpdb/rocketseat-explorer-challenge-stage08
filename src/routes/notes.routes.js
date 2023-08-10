const { Router } = require('express')

const notesRoutes = Router()

notesRoutes.get('/', (req, res) => res.send('notes'))

module.exports = notesRoutes
