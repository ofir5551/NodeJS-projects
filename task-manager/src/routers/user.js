const express = require('express')
const auth = require('../middleware/auth')
const router = new express.Router()
const User = require('../models/user')

// Endpoint for creating a new user
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (err) {
        res.status(400).send(err)
    }
})

// Endpoint for logging a user in
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (err) {
        res.status(400).send({ error: err.message})
    }
})

// Endpoint for logging a user out from current session (delete currently used token)
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.user.save()

        res.status(200).send({ message: `${req.user.name} has logged out` })
    } catch (err) {
        res.status(500).send()
    }
})

// Endpoint for logging a user out from all sessions (delete all tokens)
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()

        res.status(200).send({ message: `${req.user.name} has logged out from all devices` })
    } catch (err) {
        res.status(500).send()
    }
})

// Endpoint for viewing all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (err) {
        res.status(500).send()
    }
})

// Endpoint to get the user's home page
router.get('/users/home', auth, async (req, res) => {
    res.send(req.user)
})

// Endpoint for updating currently logged in user 
router.patch('/users/me', auth, async (req, res) => {
    // Set allowed fields to update and check send error if user trying to modify unallowed fields
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'password', 'age', 'email']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates: unexisting field' })
    }

    try {
        updates.forEach(update => req.user[update] = req.body[update])
        await req.user.save()

        res.send(req.user)
    } catch (err) {
        res.status(400).send(err)
    }
})

// Endpoint for deleting a user
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()

        res.send(req.user)
    } catch (err) {
        res.status(500).send()
    }
})

module.exports = router