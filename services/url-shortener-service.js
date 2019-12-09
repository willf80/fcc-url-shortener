'use strict'

const mongooseDb = require('../config/db/mongoose')
const dns = require('dns')

function isValidUrl (url, callback) {
  // Validate url
  const regex = /^https?:\/{2}w{3}\.[\w-]+\.[\w-]+(?:\/{1}.*|\/{1}\?{1}.*)?$/g
  const domainRegex = /(^https?:\/{2}w{3}\.)(?<domaine>\w+\.\w+)/
  const invalidError = { error: 'invalid URL' }

  if (!regex.test(url)) return callback(invalidError)

  const domaine = url.match(domainRegex).groups.domaine

  dns.lookup(domaine, (err) => {
    if (err) return callback(invalidError)
    callback(null, url)
  })
}

// Use schema
const UrlShortener = mongooseDb.UrlShortener

const createShortUrl = (request, callback) => {
  isValidUrl(request.body.url, (err, validUrl) => {
    if (err) return callback(err)

    UrlShortener.findOne({ original_url: RegExp(`${validUrl}`, 'gi') }, (err, urlShortener) => {
      if (err) return callback(err)
      if (urlShortener) return callback(null, urlShortener)

      // save new shortener url
      UrlShortener.estimatedDocumentCount((err, count) => {
        if (err) return callback(err)
        console.log(count)

        UrlShortener.create({ original_url: validUrl, short_url: count + 1 }, (err, data) => {
          if (err) return callback(err)
          callback(null, data)
        })
      })
    })
  })
}

const getShortUrl = (id, callback) => {
  // return original url
  console.log(id)
  UrlShortener.findOne({ short_url: `${id}` }).select('original_url')
    .exec((err, data) => {
      console.log('error', err, 'data', data)
      if (err || !data) {
        console.log('error', err)
        const error = { error: 'No short url found for given input' }
        return callback(error)
      }

      callback(null, data.original_url)
    })
}

module.exports = { createShortUrl, getShortUrl }
