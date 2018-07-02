module.exports = function(app,passport,connection){
    //Add in queries
    var queries = require('../queries/indexQueries')(connection);

    //Home page
    app.get("/", function(req, res){
        res.render("index");
    });

    // =========================================================================
    // AUTH SETUP ==============================================================
    // =========================================================================

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
                req.session.cookie.maxAge = 1000*60*10; //10 minute timeout
            } else {
                req.session.cookie.expires = false;
            }
            //req.flash('error', "hi")
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
        res.redirect("/");
    });


    // =========================================================================
    // INTERNAL PAGES===========================================================
    // =========================================================================

    //dashboard page for future
    app.get('/dashboard', isLoggedIn, function(req, res) {

        queries.dashboard(req.user.id, function(err,results){
            if(err){
                console.log(err);
            }
            console.log(results)
            res.render('dashboard.ejs', {results:results})
        })
    });

    //detailed view page for future
    app.get('/detail', isLoggedIn, function(req, res) {

        queries.detail(req.user.username, function(err,results){
            if(err){console.log(err)};
            res.render('detail', {results:results})
        })
           
    });

    //dtailed view post - add transaction
    app.post('/detail', isLoggedIn, function(req, res){
        var trans = {
            user_id: req.user.id,
            coinIn_id: req.body.coinIn,
            amountIn: req.body.amountIn,
            coinOut_id: req.body.coinOut,
            amountOut: req.body.amountOut,
            transType_id: req.body.transType
        }

        queries.detailInsert(trans, function(err,results){
            if(err){
                //console.log(err)
                req.flash('error', 'Invalid Data')
                res.render('detail')
            };
            
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
