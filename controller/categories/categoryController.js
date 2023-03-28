const {Category} = require('../../models')
const {validationFails} = require('../../utilities/requestVal');
const {categoriesVal} = require('../../utilities/schemas');
const {Op} = require('sequelize')

//creating of new category
const createCategory = async (req, res) =>{
    const {value: {name, description, userConnectionId }, error} = categoriesVal.validate(req.body);
	if (error) return validationFails(res, error);
    try {

        const cateValue =  {name, description, userConnectionId}
        const cate = await Category.create({ ...cateValue })
        return res.status(200).json({
			message: "Categories created succesfully",
			success: true,
		})
    } catch (error) {
        console.log(error)
        return res.status(500).send({
			success: false,
            error,
			message: "An error occured when creating categories"
		})
    }

}

// getting of categories per  users connection #
const categoriesPerUser = async (req,res) =>{
    const {id} = req.params
    try {
        const data = await Category.findAll({
            where:{
                userConnectionId:{
                [Op.eq]:id
                }
            }
        })
        return res.status(200).json({
			message: "Successful",
			success: true,
			data: data
		})
    } catch (error) {
        console.log(error)
        return res.status(500).send({
			success: false,
            error,
			message: "An error occur while fetching"
		})
    }
}



module.exports = {createCategory, categoriesPerUser}