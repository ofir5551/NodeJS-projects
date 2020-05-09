const express = require('express')
const router = new express.Router()
const User = require('../models/user')

// Endpoint for creating a new user
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        res.status(201).send(user)
    } catch (err) {
        res.status(400).send(err)
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

// Endpoint to fetch a single user by id
router.get('/users/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findById(_id)

        if (!user) { // User not found in database
            return res.status(404).send()
        }
    
        res.send(user)
    } catch (err) {
        res.status(500).send(err)
    }
})

// Endpoint for updating user by id
router.patch('/users/:id', async (req, res) => {
    // Set allowed fields to update and check send error if user trying to modify unallowed fields
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'password', 'age', 'email']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates: unexisting field'})
    }

    try {
        const user = await User.findById(req.params.id)

        updates.forEach(update => user[update] = req.body[update])
        await user.save()

        // const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (err) {
        res.status(400).send(err)
    }
})

// Endpoint for deleting a user
router.delete('/users/:id' , async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (err) {
        res.status(500).send()
    }
})

module.exports = router