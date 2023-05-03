const mongoose = require('mongoose')

const Review = new mongoose.Schema(
    {
        movieID: { type: String, required: true },
        review: { type: String, required: true },
        reviewer: { type: String, required: true },
    },
    { collection: 'reviews' }
)

const model = mongoose.model('ReviewData', Review)

module.exports = model