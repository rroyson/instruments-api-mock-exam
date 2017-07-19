const { trim, toLower, replace, concat, compose } = require('ramda')

module.exports = prefix => value =>
  compose(trim, toLower, replace(/ /g, '_'), concat(prefix))(value)
