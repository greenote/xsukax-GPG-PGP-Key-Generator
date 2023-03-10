const Joi = require("joi");
const {validationFails} = require("./requestVal");

const schemas = {
	userSchema: Joi.object({
		name: Joi.string().max(30).trim().lowercase().required(),
		phone: Joi.string().max(15).trim().replace('/\s/g', '').required(),
	}),
	connSchema: Joi.object().keys({
		fromId: Joi.string().max(30).trim().required(),
		toId: Joi.string().max(30).trim().required(),
	})
}

module.exports = schemas