var express 		= require("express"),
	app 			= express(),
	port 			= process.env.PORT || 3000,
	cookieParser	= require("cookie-parser"),
	bodyParser 		= require("body-parser"),
    passport    	= require("passport"),
    methodOverride 	= require("method-override"),
	connection		= require("./config/database"),
    morgan 			= require("morgan"),
    session 		= require("express-session"),

    flash 			= require("connect-flash");


//====================App Config====================//
app.use(morgan('dev')); //log every request to the consoel
app.use(cookieParser()); //read cookies (needed for auth)
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//session and passport setup
app.use(session({
	secret: "whyisthismysecrettoday",
	resave: true,
	saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session()); //persistent login sessions


//====================Route config====================//
app.use(function(req, res, next){
	res.locals.user = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("sucess");
	next();
});


//====================Final setup====================//

//Add in the Routes code
require("./routes/index.js")(app, passport, connection);

//Add in the passport code
require('./config/passport')(passport,  connection)



//====================Server====================//
app.listen(port, function(){
	console.log("Here we go on port 3000");
});

