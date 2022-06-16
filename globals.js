//DB CRDS
const USERNAME = "admin";
const PASSWORD = "icep2020"
const DATABASE_HOSTNAME = "localhost";
//API PORTS
const HOSTNAME = "localhost"
const APP_PORT = process.env.PORT || 7000;


function DATABASE()
{ 
    if(DATABASE_HOSTNAME == 'localhost')
        return "localhost"
    else
        return "awshosted"

}

module.exports = {
    HOSTNAME,
    DATABASE_HOSTNAME,
    USERNAME,
    PASSWORD,
    APP_PORT,
    DATABASE
}