module.exports = function(connection){
	var module = {};

	//Dashboard code pulls out user holdings as of now
	module.dashboard = function(userId, next){
		var q = `SELECT 
					cIn.short_name as Coin,
					sum(t.amountIn) - sum(t.amountOut) as Balance 
					FROM trans t
                 JOIN coins cIn ON cIn.id = t.coinIn_id
                 JOIN coins cOut ON cOut.id = t.coinOut_id
                 WHERE user_id=?
                 GROUP BY cIn.short_name`

		var res = connection.query(q,[userId], function(err,results){
			if(err){
                console.log("failed finding users");
            }
            console.log(results)
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

	//update holdings
	// module.holdingsUpdate = function(username, next){
	// 	var q = `UPDATE holdings 
	// 				SET amount = 
	// 					(SELECT 
	// 						sum(amountIn) - sum(amountOut) 
	// 						FROM trans
	// 						WHERE 
	// 							coinIn_id = ? && 
	// 							coinOut_id= ? &&
	// 							user_id = ?
	// 					)
	// 				WHERE
	// 					user_id= ? &&
	// 					coin_id= ?`
		// var updateInfo = [
		// 		trans.coinIn_id, 
		// 		trans.coinOut_id, 
		// 		trans.user_id, 
		// 		trans.user_id, 
		// 		trans.coin_id
		// 		]
	// 	var res = connection.query(q, updateInfo, function(err,results){
	// 		if(err){
	// 			console.log("failed finding users");
	// 		}
	// 		next(err, results)
	// 	})
	// }

	return module;


}

