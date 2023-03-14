const {Category} = require('../../models')
const {validationFails} = require('../../utilities/requestVal');
const {userRegSchema} = require('../../utilities/schemas');

const createCategory = async (res, req) =>{
    const {value: {name, phone}, error} = userRegSchema.validate(req.body);
	if (error) return validationFails(res, error);
}