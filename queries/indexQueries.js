module.exports = function(connection){
	var module = {};

	//Dashboard code pulls out user holdings as of now
	module.dashboard = function(userId, next){

		var q = `select 
					short_name,
					ifnull(plus, 0) - ifnull(minus,0) as balance
				from coins
				left join
					(
						select
							coinOut_id,
							sum(amountOut) as minus
						from trans
						where trans.user_id = ?
						group by coinOut_id
					) cOut on cOut.coinOut_id =id
				left join 
						(
						select
							coinIn_id,
							sum(amountIn) as plus
						from trans
						where trans.user_id = ?
						group by coinIn_id
					) cIn on cIn.coinIn_id =id`

		var res = connection.query(q,[userId, userId], function(err,results){
			if(err){
                console.log("failed finding users");
            }

	        next(err,results)
        });
	};

	//pulls out transactions for that user
	module.detail = function(username, next){

		var q = `SELECT 
					trans.id as transId,
        			cIn.short_name as CoinIn,
        			trans.amountIn as AmountIn,
        			cOut.short_name as CoinOut,
        			trans.amountOut as AmountOut,
        			tt.type as TransType


        		 FROM trans
                 JOIN users ON trans.user_id=users.id 
                 INNER JOIN coins cIn on cIn.id = trans.coinIn_id
                 INNER JOIN coins cOut on cOut.id = trans.coinOut_id
                 INNER JOIN trans_types tt on tt.id = trans.transType_id
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
		var q = `INSERT INTO trans
				(user_id, coinIn_id, coinOut_id, amountIn, amountOut, transType_id)
				VALUES
				(	
					?,
					(SELECT id FROM coins WHERE short_name = ?),
					(SELECT id FROM coins WHERE short_name = ?),
					?,
					?,
					(SELECT id FROM trans_types WHERE type = ?)
				)
				`
		//var q = `INSERT INTO trans SET ?`
		var transData = [trans.user_id, trans.coinIn, trans.coinOut, trans.amountIn, trans.amountOut, trans.transType]
		console.log(transData)
		var res = connection.query(q,transData, function(err,results){
			if(err){
                console.log("failed finding users");
            }
            next(err,results)
        });
	};

	//delete transaction
	module.transDelete = function(transId,  next){

		var q = `DELETE FROM trans WHERE Id = ?`

		var res = connection.query(q,[transId], function(err,results){
			if(err){
                console.log("failed finding users");
            }
            next(err,results)
        });
	};

	//pull list of coins
	module.getCoinsList = function(next){
		var q = 'SELECT short_name FROM coins'

		var res = connection.query(q, function(err, results){
			if(err){
				console.log('Failed getting coins');
			}
			next (err, results)
		})
	}
	//pull list of coins
	module.getTransTypeList = function(next){
		var q = 'SELECT type FROM trans_types'

		var res = connection.query(q, function(err, results){
			if(err){
				console.log('Failed getting transTypes');
			}
			next (err, results)
		})
	}
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

