const express = require('express');
const app = express();
const Router = express.Router();
const mariadb = require('../../connection');
const bodyParser = require('body-parser')


app.use(bodyParser.json());

Router.get('/Login', (req, res) => {

    if(Object.keys(req.query).length < 1)
    {
        res.send({ 
            error:true,
            message:"element of query were not found"
        })
    }

    if(!req.query.email)
    { 
        res.send({ 
            error:true,
            message:"email is expacted as a element of query"
        })
    }

    if(!req.query.password)
    { 
        res.send({ 
            error:true,
            message:"password is expacted as a element of query"
        })
    }




    mariadb.query(`SELECT * FROM client WHERE email = '${req.query.email}'`, (err, rows, fields) => {
        if (!err) {
            if(rows.length > 0)
            {
                if(req.query.password == rows.password)
                {
                    res.send(rows)
                }
            }
            else
            {
                res.send({ 
                    error:true,
                    message:"Could't find any user with this email"
                })
            }
           
        } else {
            res.send({ 
                error:true,
                message:err
            })

        }
    })





});


Router.post('/Registration', (req, res, next) => {

    if(Object.keys(req.query).length < 1)
    {
        res.send({ 
            error:true,
            message:"element of query were not found"
        })
    }

    if(!req.query.firstname)
    { 
        res.send({ 
            error:true,
            message:"firstname is expacted as a element of query"
        })
    }

    if(!req.query.lastname)
    { 
        res.send({ 
            error:true,
            message:"lastname is expacted as a element of query"
        })
    }

    if(!req.query.email)
    { 
        res.send({ 
            error:true,
            message:"email is expacted as a element of query"
        })
    }

    if(!req.query.password)
    { 
        res.send({ 
            error:true,
            message:"password is expacted as a element of query"
        })
    }


    mariadb.query(`INSERT INTO client VALUES(DEFAULT,'${req.query.firstname}','${req.query.lastname}','${req.query.email}','${req.query.password}',DEFAULT)`, (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            res.send({
                error:true,
                message:err
            });
        }
    })
});

module.exports = Router;