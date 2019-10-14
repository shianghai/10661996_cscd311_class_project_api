let models = require('./models/dummy-data.js');
let Student = models.Student;


function authenticationRequired(req, res, next){
    if (req.headers.hasOwnProperty('auth-token')){
        let token = req.headers['auth-token'];
        let details = token.split(":");
        Student.findOne({ id: Number(details[0])}).exec(function(err, student){
            if (student !== null && (student.password === details[1])){
                req.student = student;
                next();
            }
            else{
                res.status(500).json({
                    status: "failed",
                    result: "invalid auth-token!"
                });
            }
        });
    }
    else{
        res.status(500).json({
            status: "failed",
            result: "login required!"
        });
    }
}


function authRequired(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login')
}

module.exports = {
    authenticationRequired : authenticationRequired,
    authRequired: authRequired
};