const {Category} = require('../../models')
const {validationFails} = require('../../utilities/requestVal');
const {categoriesVal} = require('../../utilities/schemas');

const createCategory = async (req, res) =>{
    const {value: {name, description, userConnectionId }, error} = categoriesVal.validate(req.body);
	if (error) return validationFails(res, error);
    try {

        const cateValue =  {name, description, userConnectionId}
        const cate = await Category.create({
                name, 
                description, 
                userConnectionId
            })
            console.log(cate)

    } catch (error) {
        console.log(error)
        return res.status(500).send({
			success: false,
            error,
			message: "An error occured when creating categories"
		})
    }

}

module.exports = {createCategory}