const PouchDB = require('pouchdb')
PouchDB.plugin(require('pouchdb-find'))

//////////////////////
//      TEST
//////////////////////
const test = (callback) => {
 callback(null, "dal is ok.")
}


const dal = {
  test
}

module.exports = dal
