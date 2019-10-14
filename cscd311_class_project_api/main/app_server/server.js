const express = require("express");
const Functions = require('./functions.js');
const MiddleWares = require('./middlewares.js');
const Controllers = require('../controllers.js');
const DBConnector = require('./utils/database.js');

let passport 	= require('passport'),
    flash    	= require('connect-flash'),
    async       = require("async");

const app  = express();

//configurating passport
require('./utils/passport-config.js')(passport);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.engine('html', require('ejs').renderFile);
app.use(passport.initialize({}));
app.use(passport.session({}));
app.use(flash());
// app.set('view engine', 'ejs');
// app.use(express.cookieParser());
// app.use(express.bodyParser());

app.get("/", (req, res)=>{
    res.status(200).render('index.html');
});

app.get("/login", (req, res)=>{
    res.render('login.html');
});

app.post("/login", passport.authenticate('login', {
    successRedirect : '/profile',
    failureRedirect : '/login',
    failureFlash : true
}));

app.get("/profile", (req, res)=>{
    let student = req.student;
    console.log(student);
    //TODO : list student names : dob : level : course : residence status and registered hall
    res.status(200).render('profile.html');
    // res.render('profile.html', {student: student});
});

app.get("/setup-residence", (req, res)=>{
    //TODO: assign student hall
    res.status(200).render('setup-residence.html');
    // res.status(200).render('setup-residence.html', {halls: halls, blocks: blocks});
});

app.get("/hall-databases/:hall", (req, res)=>{
    if (req.params.hasOwnProperty('hall')) {
        let hall = req.params.hall;
        if (hall != null) {
            //TODO: return json student in hall; if hall == all, list hall and registered students
            // let data = Functions.getHallData(hall);

            require('./models/hall.js').Hall.findOne({_id: hall}).exec((err, hall)=>{
               let rooms = hall.getBlockRoomByID(
                   {block_name: "Block 0", room_type: "4-in-room",},
                   {room_gender: "male"});

               require('./models/student.js').Student.findOne({stu_id: 10660000}).exec((e, s)=>{
                   
               });
               hall.addStudentToRoom()

               res.status(200).json(rooms);
            });

        }
    }
});

module.exports.AppServer = app;

module.exports.Database = DBConnector;