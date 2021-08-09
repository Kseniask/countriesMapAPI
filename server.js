require('dotenv').config()
const express = require('express')

const app = express()
app.use(express.json())

const countriesRouter = require('./routes/countries')

app.use('/countries', countriesRouter)

app.listen(3001, () => console.log('Server started'))
