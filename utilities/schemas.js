const Joi = require("joi");

const schemas = {
	userHeaderSchema: Joi.object({
		userid: Joi.number().max(30).required(),
	}).unknown(),
	userRegSchema: Joi.object({
		name: Joi.string().max(30).trim().lowercase().required(),
		phone: Joi.string().max(15).trim().replace('/\s/g', '').required(),
	}),
	connSchema: Joi.object().keys({
		fromId: Joi.number().max(30).required(),
		toId: Joi.number().max(30).required(),
	}).unknown(),
}

module.exports = schemas