const {validationFails} = require("../utilities/requestVal");

module.exports = (schema, data = null) => {
	return (req, res, next) => {
		const {value, error} = schema.validate(data ? data : req.body);
		if (error) return validationFails(res, error);
		req.data = value;
		next();
	}
}