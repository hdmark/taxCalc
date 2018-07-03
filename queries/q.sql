select 
	short_name,
	ifnull(plus, 0) - ifnull(minus,0) as balance
from coins
left join
	(
		select
			coinOut_id,
			sum(amountOut) as minus
		from trans
		where trans.user_id = 8
		group by coinOut_id
	) cOut on cOut.coinOut_id =id
left join 
		(
		select
			coinIn_id,
			sum(amountIn) as plus
		from trans
		where trans.user_id = 8
		group by coinIn_id
	) cIn on cIn.coinIn_id =id
;