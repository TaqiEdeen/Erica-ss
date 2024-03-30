const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const console = require('console')
const app = express()
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const User = require('./public/user')




app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

app.use(express.static(path.join(__dirname, 'public')))



const mongo_URL = 'mongodb+srv://taqiiedeen:W3ca5esEZ8@cluster0.6accauq.mongodb.net/'

mongoose.connect(mongo_URL, function(err){
    if(err){
        throw err}
        else{
            console.log('Successfully connected to database')
        }
})

app.post('/register', (req, res) =>{
    const {username, password, email} =req.body

    User.findOne({username:username}, (err, user)=>{
        if(err){
            res.status(500).send('That username is taken. Try another.')
        }else if(user){
            res.status(500).send('That username is taken. Try another.')
        }else{
            const user = new User({username, password, email})
            user.save(err =>{
                if(err){
                    res.status(500).send('Error creating user')
                }else{
                    res.status(200).send('Successfully Registered')
                }
            })
        }
    })

})
app.post('/authenticate', (req, res) =>{
    const {username, password, email} =req.body
    User.findOne({username}, (err, user)=>{
        if(err){
            res.status(500).send('Error Authenticating User')
        }else if(!user){
            res.status(500).send('Username does not exist')
        }else{
            user.isCorrectPassword(password, (err, result)=>{
                if(err){
                    res.status(500).send('Failed to Authenticate')

                }else if(result){
                    res.status(200).send('User authenticated correctly')
                }else{
                    res.status(500).send('Wrong username and/or password')

                }
            })
        }
    })

})

app.listen(3000,()=>{
    console.log('Server is connected to the port 3000')
})

module.exports = app