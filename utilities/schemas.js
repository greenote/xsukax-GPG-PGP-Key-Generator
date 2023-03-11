const Joi = require("joi");

const schemas = {
	userHeaderSchema: Joi.object({
		userid: Joi.number().max(10).required(),
	}).unknown(),

	userRegSchema: Joi.object({
		name: Joi.string().max(30).trim().lowercase().required(),
		phone: Joi.string().max(15).trim().replace('/\s/g', '').required(),
	}),

	connSchema: Joi.object().keys({
		fromId: Joi.number().max(10).required(),
		toId: Joi.number().max(10).required(),
	}).unknown(),

	toId: Joi.object().keys({
		toId: Joi.number().max(10).required(),
	}),

	fromId: Joi.object().keys({
		fromId: Joi.number().max(10).required(),
	})
}

module.exports = schemas