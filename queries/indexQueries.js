module.exports = function(connection){
	var module = {};

	//Dashboard code pulls out user holdings as of now
	module.dashboard = function(username, next){
		var q = `SELECT * FROM holdings 
                 JOIN users ON holdings.user_id=users.id 
                 JOIN coins ON holdings.coin_id=coins.id
                 WHERE username=?`

		var res = connection.query(q,[username], function(err,results){
			if(err){
                console.log("failed finding users");
            }
	        next(err,results)
        });
	};

	//pulls out transactions for that user
	module.detail = function(username, next){

		var q = `SELECT 
        			cIn.short_name as CoinIn,
        			trans.amountIn as AmountIn,
        			cOut.short_name as CoinOut,
        			trans.amountOut as AmountOut,
        			trans.transType_id


        		 FROM trans
                 JOIN users ON trans.user_id=users.id 
                 INNER JOIN coins cIn on cIn.id = trans.coinIn_id
                 INNER JOIN coins cOut on cOut.id = trans.coinOut_id
                 WHERE username=?
                 ORDER BY trans.created_at`

		var res = connection.query(q,[username], function(err,results){
			if(err){
                console.log("failed finding users");
            }
	        next(err,results)
        });
	};

	//pulls out transactions for that user
	module.detailInsert = function(trans,  next){

		var q = `INSERT INTO trans SET ?`

		var res = connection.query(q,trans, function(err,results){
			if(err){
                console.log("failed finding users");
            }
	        next(err,results)
        });
	};

	return module;
}

