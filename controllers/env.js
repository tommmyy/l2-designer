var l2js = require('l2js').l2js;

module.exports = {
	derive : function(req, res) {
		try {
			var code = req.body.code;
			var t1 = new Date().getTime();
			l2js.options.maxDerivedSymbols = 500000;	
			var result = l2js.derive(code);
			console.log("done");
			res.send({result: JSON.stringify(result)});
		} catch (err) {
			console.log("error:", err.message);
			res.json({
				error : err.message,
			});
		}
	}
};
