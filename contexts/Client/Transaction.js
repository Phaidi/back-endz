const express = require('express');
const app = express();
const Router = express.Router();
const mariadb = require('../../connection');
const bodyParser = require('body-parser')


app.use(bodyParser.json());

Router.put('/AccBal', (req, res) => {

    if(Object.keys(req.query).length < 1)
    {
        res.send({ 
            error:true,
            message:"element of query were not found"
        })
        return
    }

    if(!req.query.email)
    { 
        res.send({ 
            error:true,
            message:"email is expacted as a element of query"
        })
        return
    }

    if(!req.query.amount)
    { 
        res.send({ 
            error:true,
            message:"amount is expacted as a element of query"
        })
        return
    }

    if(!req.query.type)
    { 
        res.send({ 
            error:true,
            message:"type is '-' or '+' expacted as a element of query"
        })
        return
    }

    if(req.query.type == "+")
    {
        mariadb.query(`SELECT balance FROM client WHERE email = ${req.query.email}`, (err, rows, fields) => {
            if (!err) {
                let newAmt = rows.balance + req.query.amount
                mariadb.query(`UPDATE client SET balance = ${newAmt} WHERE email = '${req.query.email}'`, (err, rows, fields) => {
                    if (!err) {
                        res.send(rows)
                        return
                    }
                    else
                    {
                        res.send({ 
                            error:true,
                            message:err
                        })
                        return
                    }
                });
            } else {
                res.send({ 
                    error:true,
                    message:err
                })
                return
            }
        })
    }
    else
    { 
        mariadb.query(`SELECT balance FROM client WHERE email = '${req.query.email}'`, (err, rows, fields) => {
            if (!err) {
                let newAmt = rows.balance - req.query.amount
                mariadb.query(`UPDATE client SET balance = ${newAmt} WHERE email = '${req.query.email}'`, (err, rows, fields) => {
                    if (!err) {
                        res.send(rows)
                        return
                    }
                    else
                    {
                        res.send({ 
                            error:true,
                            message:err
                        })
                        return
                    }
                });
            } else {
                res.send({ 
                    error:true,
                    message:err
                })
                return
            }
        })
    }

    
});



module.exports = Router;