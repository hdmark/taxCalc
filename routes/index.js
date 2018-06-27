module.exports = function(app,passport,db){

    //Home page
    app.get("/", function(req, res){
        res.render("index");
    });

    //==========LOGIN==========
    //show login form
    app.get("/login", function(req, res){
        // res.render("login", {page: 'login'});
        res.render("login", {error: req.flash('loginMessage')});
    });

    //handle login form logic
    app.post("/login", passport.authenticate("local-login", 
        {
            successRedirect: "/dashboard",
            successFlash: true,
            failureRedirect: "/login",
            failureFlash: true
        }), 
        function(req, res){
            if (req.body.remember){
                req.session.cookie.maxAge = 1000*60*3;
            } else {
                req.session.cookie.expires = false;
            }
            res.render("/dashboard");
    });


    //==========REGISTER==========
    // show register form
    app.get("/register", function(req, res){
        // res.render("register", {page: 'register'});
        res.render("register", {error: req.flash('signupMessage')})
    });

    //handle sign up logic
    app.post('/register', passport.authenticate('local-signup', {
            successRedirect : '/dashboard', // redirect to the secure profile section
            failureRedirect : '/register', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));


    //==========LOGOUT==========
    //logout
    app.get("/logout", function(req, res){
        req.logout();
        req.flash("success", "Logged out successfully");
        res.redirect("/");
    });


    //==========INTERNALS==========
    //dashboard page for future
    app.get('/dashboard', isLoggedIn, function(req, res) {
        console.log(req.user.username);
        var q = `SELECT * FROM holdings 
                 JOIN users ON holdings.user_id=users.id 
                 JOIN coins ON holdings.coin_id=coins.id
                 WHERE username=?`
        var query = db.query(q,[req.user.username], function(err, results){
            if(err){
                console.log("failed finding users");
            }
            //console.log(results)
            res.render('dashboard.ejs', {results:results});
        })
           
    });

    //detailed view page for future
    app.get('/detail', isLoggedIn, function(req, res) {

        console.log(req.user.username);
        var q = `SELECT * FROM trans 
                 JOIN users ON trans.user_id=users.id 
                 WHERE username=?`
        var query = db.query(q,[req.user.username], function(err, results){
            if(err){
                console.log("failed finding users");
            }
            //console.log(results)
            res.render('detail', {results:results});
        })
           
    });

    app.post('/detail', isLoggedIn, function(req, res){
        var trans = {
            user_id: req.user.id,
            coinIn_id: req.body.coinIn,
            amountIn: req.body.amountIn,
            coinOut_id: req.body.coinOut,
            amountOut: req.body.amountOut,
            transType_id: req.body.transType
        }

        var q = `INSERT INTO trans SET ?`
        var query = db.query(q, trans, function(error, results){
            if(error) {
                console.log("Bad Input Data");
            }
            console.log(results);
            res.redirect('detail')
        })
        
    })






    //midleware    
    function isLoggedIn (req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("message", "You need to be logged in to do that")
        res.redirect("/login");
    };
}
