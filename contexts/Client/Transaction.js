const express = require('express');
const app = express();
const Router = express.Router();
const mariadb = require('../../connection');
const bodyParser = require('body-parser')


app.use(bodyParser.json());

Router.put('/AccBal', (req, res) => {

    if (Object.keys(req.query).length < 1) {
        res.send({
            error: true,
            message: "element of query were not found"
        })
        return
    }

    if (!req.query.email) {
        res.send({
            error: true,
            message: "email is expacted as a element of query"
        })
        return
    }

    if (!req.query.amount) {
        res.send({
            error: true,
            message: "amount is expacted as a element of query"
        })
        return
    }

    if (!req.query.type) {
        res.send({
            error: true,
            message: "type is '-' or '+' expacted as a element of query"
        })
        return
    }

    if (req.query.type == "+") {
        mariadb.query(`SELECT balance FROM client WHERE email = ${req.query.email}`, (err, rows, fields) => {
            if (!err) {
                let newAmt = rows[0].balance + req.query.amount
                mariadb.query(`UPDATE client SET balance = ${newAmt} WHERE email = '${req.query.email}'`, (err, rows, fields) => {
                    if (!err) {
                        res.send(rows)
                        return
                    }
                    else {
                        res.send({
                            error: true,
                            message: err
                        })
                        return
                    }
                });
            } else {
                res.send({
                    error: true,
                    message: err
                })
                return
            }
        })
    }
    else {
        mariadb.query(`SELECT balance FROM client WHERE email = '${req.query.email}'`, (err, rows, fields) => {
            if (!err) {
                let newAmt = rows[0].balance - req.query.amount
                mariadb.query(`UPDATE client SET balance = ${newAmt} WHERE email = '${req.query.email}'`, (err, rows, fields) => {
                    if (!err) {
                        res.send(rows)
                        return
                    }
                    else {
                        res.send({
                            error: true,
                            message: err
                        })
                        return
                    }
                });
            } else {
                res.send({
                    error: true,
                    message: err
                })
                return
            }
        })
    }


});

/*========================     VOUCHER    =============================*/
Router.get('/voucher', (req, res) => {
    mariadb.query('select * from voucher', (err, results) => {
        if (err) console.log(err)

        res.json(results)
    })
})

/*========================     ROUTE    =============================*/
Router.post('/create_route', (req, res) => {

    const params = req.body;

    const routeParams = [params.origin_destination, params.cost, params.adminId]
    const routeQuery = `insert into route(origin_destination,cost,adminId)
                        values(?,?,?)`;

    mariadb.query(routeQuery, routeParams, (err, results) => {
        if (err) {
            console.log(err)
            res.send("Something went wrong")
        }
        else {
            res.send(results)
        }

    })
})

Router.get('/route/:id', (req, res) => {
    mariadb.query('select * from route where adminId =?', req.params.id, (err, results) => {
        if (err) console.log(err)

        res.json(results)
    })

})

Router.put('/update_route/:id', (req, res) => {
    const query = `UPDATE route
                    SET origin_destination = ?,
                        cost = ?
                    WHERE id = ?`
    const routeParams = [req.body.origin_destination, req.body.cost, req.params.id]

    mariadb.query(query, routeParams, (err, results) => {
        if (err) console.log(err)
        res.json(results)
    })

})

Router.delete('/delete_route/:id', (req, res) => {
    const query = `delete from route
                    WHERE id = ?`

    mariadb.query(query, req.params.id, (err, results) => {
        if (err) console.log(err)
        res.json(results)
    })

})

/*========================     TICKET    =============================*/
Router.post('/create_ticket', (req, res) => {
    mariadb.query('select balance from client where email =?', req.body.email, (err, results) => {

        if (results[0].balance > req.body.cost) {
            mariadb.query(`update client
            SET balance = balance - ?
            WHERE email = ?`, [req.body.cost, req.body.email], (error, rows) => {
            })

            const tickeParams = [req.body.pass_type, req.body.trip_type, req.body.quantity, req.body.status, req.body.routeId]
            const tickeQuery = `insert into ticket(pass_type, trip_type, quantity, status, routeId)
            values(?,?,?,?,?)`;

            mariadb.query(tickeQuery, tickeParams, (error, rows) => {
                if (error) {
                    console.log(error)
                }
                res.send(rows)
            })

        }

    })



    /*const tickeParams = [req.body.pass_type, req.body.trip_type, req.body.quantity, req.body.status, req.body.routeId]
    const tickeQuery = `insert into ticket(pass_type, trip_type, quantity, status, routeId)
            values(?,?,?,?,?)`;

    mariadb.query(tickeQuery, tickeParams, (error, results) => {
        if (error) {
            console.log(error)
        }
        res.send(results)
    })*/
})

Router.delete('/delete_ticket/:ticket_id', (req, res) => {
    mariadb.query('select * from ticket where id =?', req.params.ticket_id, (err, results) => {

        if (results[0].status === 'pending') {
            mariadb.query('select * from route where id =?', req.body.routeId, (err, response) => {

                mariadb.query(`update client
                SET balance = balance + ?
                WHERE email = ?`, [response[0].cost, req.body.email], (error, rows) => {
                })
            })

            const query = `delete from ticket
            WHERE id = ?`

            mariadb.query(query, req.params.ticket_id, (err, rows) => {
                if (err) console.log(err)
                res.json({ rows, message: "Deleted" })
            })
        }


        else {
            res.send('cannot be deleted')
        }

    })

})

Router.put('/update_status/:ticketId', (req, res) => {
    mariadb.query(`update ticket 
    SET status = ? 
    WHERE id =?`, [req.body.status, req.params.ticketId], (err, results)=>{
        if(err) console.log(err)
        res.send(results)
    })
})
module.exports = Router;