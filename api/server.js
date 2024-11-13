// BUILD YOUR SERVER HERE
const express = require("express")
const server = express()
server.use(express.json())
const User = require("./users/model")

const api = "/api/users"

//Now get the server 

server.get(api, async (req, res) => {
    try {
        const user = await User.find()
        if (!user) res.status(404).json({ message: "There is no user" })
        res.status(200).json(user)
    }
    catch (err) {
        res.status(500).json({ message: `Something happend during fetching Users ${err}` })
    }
})
server.get(`${api}/:id`, async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id)
        if (!user) res.status(404).json({ message: `does not exist` })
        res.status(200).json(user)
    }
    catch (err) {
        res.status(500).json({ message: `Name or Bio is missing` })
    }
})

server.post(api, (req, res) => {
    const user = req.body

    if (!user.name || !user.bio) {
        res.status(400).json({ message: "provide name and bio" })
    }
    else {
        User.insert(user)
            .then(user => {
                res.status(201).json(user)
            })
            .catch(err => {
                res.status(500).json({
                    message: "There is an error Creating User",
                    err: err.message,
                    stack: err.stack
                })
            })

    }
})

server.delete(`${api}/:id`, async (req, res) => {

    try {
        const possibleUser = await User.findById(req.params.id)
        if (!possibleUser) {
            res.status(404).json({ message: "does not exist" })
        }
        else {
            const deleteUser = await User.remove(possibleUser.id)
            res.status(200).json(deleteUser)
        }
    }
    catch (err) {
        res.status(500).json({
            message: "There is an Error Deleteing User",
            error: err.message,
            stack: err.stack
        })
    }
})

server.put(`${api}/:id`, async (req, res) => {
    try {
        const possibleUser = await User.findById(req.params.id)
        if (!possibleUser) {
            res.status(404).json({ message: "does not exist" })
        }
        else {
            if (!req.body.name || !req.body.bio) res.status(400).json({ message: "provide name and bio" })
            else {
                const update=await User.update(req.params.id,req.body)
                res.status(200).json(update)
            }
        }
    }
    catch (err) {
        res.status(500).json({
            message: "There is the error",
            error: err.message,
            stack: err.stack
        })
    }
})


module.exports = server; 
