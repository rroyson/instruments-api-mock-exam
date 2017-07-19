const PouchDB = require('pouchdb')
PouchDB.plugin(require('pouchdb-find'))
const db = new PouchDB(process.env.COUCHDB_URL + process.env.COUCHDB_NAME)
const buildPk = require('./lib/build-pk')
const instrumentPk = buildPk('instrument_')
const { pathOr, assoc, split, head, last } = require('ramda')
const HTTPError = require('node-http-error')

//////////////////////
//      TEST
//////////////////////
const test = callback => {
  callback(null, 'dal is ok.')
}

//CREATE
const createInstrument = function(instrument, callback) {
  //instrument_cello_cello_platinum
  const guitarName = pathOr('', ['name'], instrument)
  const guitarCategory = pathOr('', ['category'], instrument)
  const pk = instrumentPk(`${guitarCategory} ${guitarName}`)
  console.log('pk: ', pk)

  instrument = assoc('_id', pk, instrument)
  instrument = assoc('type', 'instrument', instrument)
  createDoc(instrument, callback)
}

//READ
function getInstrument(instrumentId, callback) {
  db.get(instrumentId, function(err, doc) {
    if (err) return callback(err)

    doc.type === 'instrument'
      ? callback(null, doc)
      : callback(new HTTPError(400, 'id is not instrument.'))
  })
}

function getDoc(id, callback) {
  db.get(id, function(err, doc) {
    if (err) return callback(err)
    callback(null, doc)
  })
}

//UPDATE

function updateInstrument(inst, callback) {
  inst = assoc('type', 'instrument', inst)
  createDoc(inst, callback)
}

//LIST

function listInstruments(filter, lastItem, limit, callback) {
  var query = {}
  if (filter) {
    console.log('hit if statement')

    const arrFilter = split(':', filter)
    const filterField = head(arrFilter)
    const filterValue = last(arrFilter)

    const selectorValue = assoc(filterField, filterValue, {})
    console.log('selectorValue', selectorValue)
    // selectorValue = {storeNumber: 1004}
    query = {
      selector: selectorValue,
      limit
    }
  } else if (lastItem) {
    console.log('hit if/else')
    // we need to grab the next page of documents
    query = {
      selector: {
        _id: { $gt: lastItem },
        type: 'instrument'
      },
      limit
    }
  } else {
    console.log('hit else statement')
    query = {
      selector: {
        _id: { $gte: null },
        type: 'instrument'
      },
      limit
    }
  }

  find(query, function(err, data) {
    console.log('query:', query)
    console.log('err', err)
    console.log('data', data.docs)
    if (err) return callback(err)
    callback(null, data.docs)
  })
}

//DELETE

function deleteInstrument(instId, callback) {
  db
    .get(instId)
    .then(function(doc) {
      return db.remove(doc)
    })
    .then(function(result) {
      callback(null, result)
    })
    .catch(function(err) {
      callback(err)
    })
}
//Helper functions

function createDoc(doc, callback) {
  console.log('createDoc', doc)
  db.put(doc).then(res => callback(null, res)).catch(err => callback(err))
}

function find(query, callback) {
  console.log('hit find function')
  console.log('query', JSON.stringify(query, null, 2))
  query ? db.find(query, callback) : callback(null, [])
}

const dal = {
  test,
  createInstrument,
  getInstrument,
  listInstruments,
  updateInstrument,
  deleteInstrument
}

module.exports = dal
