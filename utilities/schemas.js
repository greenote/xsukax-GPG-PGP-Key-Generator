const Joi = require("joi");
const schemas = {
	userHeaderSchema: Joi.object({
		userid: Joi.string().max(10).required(),
	}).unknown(),

	confirmOTP: Joi.object().keys({
		otp: Joi.number().required(),
		userId: Joi.number().required(),
	}),

	userRegSchema: Joi.object({
		name: Joi.string().max(30).trim().lowercase().required(),
		phone: Joi.string().max(15).trim().replace('/\s/g', '').required(),
	}),

	updateUser: Joi.object({
		name: Joi.string().max(30).trim().lowercase().required(),
	}).unknown(),

	connSchema: Joi.object().keys({
		fromId: Joi.string().max(10).required(),
		toId: Joi.string().max(10).required(),
	}).unknown(),

	toId: Joi.object().keys({
		toId: Joi.string().max(10).required(),
	}),

	id: Joi.object().keys({
		id: Joi.string().max(10).required(),
	}),

	fromId: Joi.object().keys({
		fromId: Joi.string().max(10).required(),
	}),

	phoneSc: Joi.object().keys({
		phone: Joi.string().max(15).required(),
	}),

	nToken: Joi.object().keys({
		token: Joi.string().required(),
	}),

	categoriesVal: Joi.object().keys({
		name: Joi.string().max(30).trim().lowercase().required(),
		userConnectionId: Joi.number().required(),
		description: Joi.string().max(20).required()
	}),

	processContactsSchema: Joi.object({
		contacts: Joi.array().items(
			Joi.object({
				phone: Joi.string().required().lowercase().trim(),
			}).unknown()
		).required(),
	}).unknown(),

	getUser: Joi.object({
		phone: Joi.string().max(15),
		id: Joi.number()
	}).or('phone', 'id')

}

module.exports = schemas