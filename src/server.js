require('express-async-errors')
const database = require('./database/sqlite')
const express = require('express')
const routes = require('./routes')

const app = express()
app.use(express.json())
app.use(routes)

database()

const PORT = 3331

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
