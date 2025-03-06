const express = require('express')
const bcrypt = require('bcryptjs')
const db = require('../Mysql')

const router = express.Router()

//account

router.get('/account', (req,res) => {
const q = 'select * from account'

db.query(q,(err,data) => {
    if(err) return res.json(err)
        return res.json(data)
})
})

router.post('/Signup', async (req,res) => {

    const q = 'INSERT INTO account (`username`,`email`,`password`) VALUES (?)'
    
    const hashpassword = await bcrypt.hash(req.body.password,10)

    const values = [
        req.body.username,
        req.body.email,
        hashpassword
    ]

   
db.query(q, [values], (err,data) => {
    if(err) return res.json(err)
        return res.json('account has been created')
})

})

router.post('/Login', async (req,res) => {

        const q = 'SELECT * FROM account WHERE email = ?'
        
    db.query(q,[req.body.email], async (err,data) => {
        if(data.length === 0)return res.status(404).json('user not found')
            
            const isMatch = await bcrypt.compare(req.body.password,data[0].password)   
        
            if(!isMatch){
                return res.status(400).json({message:'wrong password'})
            }
            else {
                return res.status(200).json({message:'you have logged in'})
            }
        
        })
      
})

//end of account

module.exports = router