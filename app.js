require('dotenv').config()

const express = require('express')
const app = express()
const dal = require('./dal.js')
const port = process.env.PORT || 4000
const { pathOr } = require('ramda')

app.get('/', function(req, res, next) {
  res.send(
    'Welcome to the Instruments API.  Try /test and verify dal is working...'
  )
})

app.get('/test', function(req, res, next) {
  dal.test(
    (err, response) =>
      err
        ? res.status(500).send('Problem with the dal.')
        : res.status(200).send(response)
  )
})

// CREATE -  POST /instruments
// READ   -  GET /instruments/:id
// UPDATE -  PUT /instruments/:id
// DELETE -  DELETE /instruments/:id
// LIST -    GET /instruments

app.listen(port, () => console.log('API Running on port:', port))
