require('dotenv').config()
const express = require('express')

const app = express()
app.use(express.json())

const countriesRouter = require('./routes/countries')

app.use('/countries', countriesRouter)

const port = process.env.PORT || 3001

app.listen(port, () => console.log('Server started'))
