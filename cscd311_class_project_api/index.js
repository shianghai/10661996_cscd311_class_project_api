/*
    Name: Shiangah Francis
    ID  : 10660742
 */

const SAS   = require('./main/app_server/server.js');
const port  = process.env.PORT || 3000; //8080

let path    = require('path');


function startAppServer(){

    SAS.Database.DatabaseConnector('mongodb://localhost/school_db').setOnCompleteListener((connection)=>{

        connection.on('error', console.error.bind(console, 'database connection failed: '));
        connection.once('open', function() {

            console.log("database connection successfully");

            //create dummy data
            require('./main/app_server/models/dummy-data.js')();

            //Start Server

            let app = SAS.AppServer;

            app.use(require('express').static(path.join(__dirname + '/main/views/static/public')));
            app.set('views', path.join(__dirname + '/main/views/static/html'));
            // app.use(require('express').session({ secret: 'techupstudio' }));
            // app.use(express.bodyParser({uploadDir: '.../views/static/public/media'}));


            let APIServer = app.listen(port, ()=>{
                let host = APIServer.address().address;
                let port = APIServer.address().port;
                console.log("Running App Server: http://%s:%s", host, port)
            });

        });

    });
}

startAppServer();