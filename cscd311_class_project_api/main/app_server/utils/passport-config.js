let LocalStrategy   = require('passport-local').Strategy;

let StudentSchema   = require('../models/student.js').StudentSchema;
let Student         = require('../models/student.js').Student;

module.exports = function(passport) {

    // Maintaining persistent login sessions
    // serialized  authenticated student to the session
    passport.serializeUser(function(student, done) {
        done(null, student._id);
    });

    // deserialized when subsequent requests are made
    passport.deserializeUser(function(id, done) {
        Student.findById(id, function(err, student) {
            done(err, student);
        });
    });

     passport.use('login', new LocalStrategy({
			 usernameField : 'username',
			 passwordField : 'password',
			 passReqToCallback : true
		 },
		 function(req, stu_id, password, done) {
     			process.nextTick(function() {
					Student.findOne({ id :  Number(stu_id) }, function(err, student) {
						if (err){ return done(err);}
						if (!student)
							return done(null, false, req.flash('error', 'Student does not exist.'));

						if (!student.verifyPassword(password))
							return done(null, false, req.flash('error', 'Enter correct password'));
					    else
					        req.student = student;
							return done(null, student);
					});
				});

    }));

    //  passport.use('signup', new LocalStrategy({
	// 		 usernameField : 'email',
	// 		 passReqToCallback : true
	// 	 },
	// 	function(req, email, password, done) {
    //
	// 		process.nextTick(function() {
    //
	// 			if (!req.student) {
	// 				Student.findOne({ 'student.email' :  email }, function(err, student) {
	// 					if (err){ return done(err);}
	// 					if (student) {
	// 						return done(null, false, req.flash('signuperror', 'Student already exists'));
	// 					} else {
	// 						let newStudent             = new Student();
	// 			            newStudent.user.username   = req.body.username;
	// 						newStudent.user.email      = email;
	// 						newStudent.user.password   = newStudent.generateHash(password);
    //                         newStudent.user.name	    = '';
    //                         newStudent.user.address	= '';
	// 						newStudent.save(function(err) {
	// 							if (err)
	// 								throw err;
	// 							return done(null, newStudent);
	// 						});
	// 					}
    //
	// 				});
	// 			} else {
	// 				let student            = req.student;
	// 		        student.user.username  = req.body.username;
    //                 student.user.email     = email;
    //                 student.user.password  = student.generateHash(password);
    //                 student.user.name	    = '';
    //                 student.user.address	= '';
    //
    //                 student.save(function(err) {
	// 					if (err)
	// 						throw err;
	// 					return done(null, user);
	// 				});
    //
	// 			}
    //
	// 		});
    //
    //
    // }));

};
