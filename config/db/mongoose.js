const mongoose = require('mongoose')

mongoose.connect(process.env.MONGOLAB_URI, { useUnifiedTopology: true, useNewUrlParser: true })

const Schema = mongoose.Schema

// Create schema
const urlShortenerSchema = new Schema({ original_url: String, short_url: Number })
const UrlShortener = mongoose.model('UrlShortener', urlShortenerSchema)

module.exports.mongoose = mongoose
module.exports.UrlShortener = UrlShortener
