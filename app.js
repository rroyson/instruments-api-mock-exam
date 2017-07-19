require('dotenv').config()
const express = require('express')
const app = express()
const dal = require('./dal.js')
const port = process.env.PORT || 4000
const { pathOr, keys } = require('ramda')
const bodyParser = require('body-parser')
const HTTPError = require('node-http-error')
const checkFields = require('./lib/check-fields')
const checkInstrumentFields = checkFields([
  'name',
  'category',
  'group',
  'retailPrice',
  'manufacturer'
])
// const checkUpdateFields = checkFields([
//   'name',
//   'category',
//   'group',
//   'retailPrice',
//   'manufacturer',
//   '_rev',
//   '_id'
// ])

app.use(bodyParser.json())

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
app.post('/instruments', function(req, res, next) {
  const instrument = pathOr(null, ['body'], req)
  const checkResults = checkInstrumentFields(instrument)

  if (checkResults.length > 0) {
    console.log('checkResults', checkResults)

    return next(
      new HTTPError(400, 'Missing required fields in the request body.', {
        fields: checkResults
      })
    )
  }

  dal.createInstrument(instrument, function(err, result) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(201).send(result)
  })
})
// READ   -  GET /instruments/:id
app.get('/instruments/:id', function(req, res, next) {
  console.log('req:', req)
  const instrumentId = pathOr(null, ['params', 'id'], req)

  if (instrumentId) {
    dal.getInstrument(instrumentId, function(err, doc) {
      if (err) return next(new HTTPError(err.status, err.message, err))
      res.status(200).send(doc)
    })
  } else {
    return next(new HTTPError(400, 'Missing instrument id in path.'))
  }
})
// UPDATE -  PUT /instruments/:id

app.put('/instruments/:id', function(req, res, next) {
  const instrument = pathOr(null, ['params', 'id'], req)
  const body = pathOr(null, ['body'], req)
  if (!body || keys(body).length === 0)
    return next(new HTTPError(400, 'Missing instrument in request body'))

  dal.updateInstrument(body, function(err, response) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(200).send(response)
  })
})
// DELETE -  DELETE /instruments/:id

app.delete('/instruments/:id', function(req, res, next) {
  const instrument = pathOr(null, ['params', 'id'], req)

  dal.deleteInstrument(instrument, function(err, result) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(200).send(result)
  })
})
// LIST -    GET /instruments

app.get('/instruments', function(req, res, next) {
  const limit = pathOr(10, ['query', 'limit'], req)
  const lastItem = pathOr(null, ['query', 'lastItem'], req)
  const filter = pathOr(null, ['query', 'filter'], req)

  dal.listInstruments(filter, lastItem, Number(limit), function(err, data) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(200).send(data)
  })
})

//ERROR MIDDLEWARE

app.use(function(err, req, res, next) {
  console.log(req.method, req.path, err)
  res.status(err.status || 500)
  res.send(err)
})

app.listen(port, () => console.log('API Running on port:', port))
