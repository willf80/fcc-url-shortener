'use strict'

const express = require('express')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')

const cors = require('cors')
const app = express()

// Configuration
dotenv.config()

// Load services
const urlShortenerService = require('./services/url-shortener-service')

// Basic Configuration
const port = process.env.PORT

app.use(cors())

// you should mount the body-parser here
app.use(bodyParser.urlencoded({ extended: false }), bodyParser.json())

app.use('/public', express.static(process.cwd() + '/public'))

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html')
})

app.post('/api/shorturl/new', function (req, res) {
  urlShortenerService.createShortUrl(req, (err, result) => {
    if (err) return res.json(err)
    res.json(result)
  })
})

app.get('/api/shorturl/:short_url', function (req, res) {
  urlShortenerService.getShortUrl(req.params.short_url, (err, originalUrl) => {
    if (err) return res.json(err)
    res.redirect(originalUrl)
  })
})

app.listen(port, function () {
  console.log('Node.js listening ...')
})
