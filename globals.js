//DB CRDS
const USERNAME = "root";
const PASSWORD = ""
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