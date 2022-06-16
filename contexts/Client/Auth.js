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

    if(!req.query.password)
    { 
        res.send({ 
            error:true,
            message:"password is expacted as a element of query"
        })
        return
    }




    mariadb.query(`SELECT * FROM client WHERE email = '${req.query.email}'`, (err, rows, fields) => {
        if (!err) {
            if(rows.length > 0)
            {
            
                if(req.query.password == rows[0].password)
                {
                    res.send(rows)
                    return
                }
                else
                {
                    res.send({ 
                        error:true,
                        message:"Password is incorrect"    
                    })
                    return
                }
            }
            else
            {
                res.send({ 
                    error:true,
                    message:"Could't find any user with this email"    
                })
                return
            }
           
        } else {
            res.send({ 
                error:true,
                message:err
            })
            return

        }
    })





});


Router.post('/Registration', (req, res, next) => {

    if(Object.keys(req.body).length < 1)
    {
        res.send({ 
            error:true,
            message:"element of body were not found"
        })
        return
    }

    if(!req.body.firstname)
    { 
        res.send({ 
            error:true,
            message:"firstname is expacted as a element of body"
        })
        return
    }

    if(!req.body.lastname)
    { 
        res.send({ 
            error:true,
            message:"lastname is expacted as a element of body"
        })
        return
    }

    if(!req.body.email)
    { 
        res.send({ 
            error:true,
            message:"email is expacted as a element of body"
        })
    }

    if(!req.body.password)
    { 
        res.send({ 
            error:true,
            message:"password is expacted as a element of body"
        })
        return
    }


    mariadb.query(`INSERT INTO client VALUES(DEFAULT,'${req.body.firstname}','${req.body.lastname}','${req.body.email}','${req.body.password}',DEFAULT)`, (err, rows, fields) => {
        if (!err) {
            res.send(rows);
            return
        } else {
            res.send({
                error:true,
                message:err
            });
            return
        }
    })
});

module.exports = Router;