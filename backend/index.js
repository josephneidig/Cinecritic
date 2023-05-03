const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./models/user.model')
const Review = require('./models/review.model')
const jwt = require('jsonwebtoken')

app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://127.0.0.1/cinecritic')

app.post('/api/register', async (req, res) => {
    console.log(req.body)
    try {
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        })
        res.json({ status: 'ok' })
    } catch (e) {
        res.json({ status: 'error', error: 'This email is already in use' })
    }
})

app.post('/api/login', async (req, res) => {
    const user = await User.findOne({
        email: req.body.email,
        password: req.body.password,
    })

    if (user) {
        const token = jwt.sign(
            {
                name: user.name,
                email: user.email,
            },
            'secretExample'
        )

        return res.json({ status: 'ok', user: token })
    } else {
        return res.json({ status: 'error', user: false})
    }
})

app.get('/api/quote', async (req, res) => {
    const token = req.headers['x-access-token']

    try {
        const decoded = jwt.verify(token, 'secretExample')
        const email = decoded.email
        const user = await User.findOne({ email: email })

        return  res.json({ status: 'ok', quote: user.quote })
    } catch (e) {
        console.log(e)
        res.json({ status: 'error', error: 'Invalid token' })
    }
})

app.post('/api/quote', async (req, res) => {
    const token = req.headers['x-access-token']

    try {
        const decoded = jwt.verify(token, 'secretExample')
        const email = decoded.email
        await User.updateOne({ email: email }, { $set: { quote: req.body.quote }})
        return res.json({ status: 'ok' })
    } catch (e) {
        console.log(e)
        res.json({ status: 'error', error: 'Invalid token' })
    }
})

app.get('/api/review', async (req, res) => {
    const token = req.headers['movie']

    try {
        const review = await Review.findOne({ movieID: token })
        return res.json({ status: 'ok', review: review.review, reviewer: review.reviewer })
    } catch (e) {
        console.log(e)
        //res.json({ status: 'error', error: 'Invalid token' })
    }
})

app.post('/api/review', async (req, res) => {
    const token = req.headers['x-access-token']

    try {
        const decoded = jwt.verify(token, 'secretExample')
        const username = decoded.name
        console.log(req.body)
        const review = await Review.create({
            movieID: req.body.movieID,
            review: req.body.review,
            reviewer: req.body.reviewer,
        })
        res.json({ status: 'ok' })
    } catch (e) {
        res.json({ status: 'error', error: 'Error encountered. Did you enter a review?' })
    }
})

app.listen(4000, () => {
    console.log('Server started on 4000')
})