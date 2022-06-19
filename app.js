//PORT FOR THE API ENDPOINT________________________
const { APP_PORT,DATABASE } = require('./globals')
//_________________________________________________
//Module Importing
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
//cross-origin
const cors = require('cors');
//----------------------------------------------------------------------------------Stock Libraries
//Student
//--Test
const TestQuery_cnxt = require("./contexts/Common/TestQuery");
const Auth_cnxt = require("./contexts/Client/Auth");
const Trans_cnxt = require("./contexts/Client/Transaction");


//-----------------------------------------------------------------------------------Custome Libraries
//-----------------------------------------------------------------------------------Express Server Algorithms
app.use(bodyParser.json());
app.use(cors({origin: '*'}));


app.use(function(req, res, next) {
    //Header allowences of METHODS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With','Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


//context channelling Student
app.use('/Test/TestQuery', TestQuery_cnxt);
app.use('/', Auth_cnxt);
app.use('/', Trans_cnxt);

app.get('/', (req, res) => { 
    res.send('Not a accessbled Address graph'); 
});


app.listen(APP_PORT, (e) => {
    
    console.log("*                   PORT : "+APP_PORT+"                        *");
    console.log("********************************************************");

});


