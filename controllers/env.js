var l2js = require('l2js').l2js;

module.exports = {
	derive : function(req, res) {
		try {
			var code = req.body.code;
			var result = l2js.derive(code);
			res.json({result: result});
		} catch (err) {
			console.log(err);
			res.json({
				error : "Error during derivation process."
			});
		}
	}
};
