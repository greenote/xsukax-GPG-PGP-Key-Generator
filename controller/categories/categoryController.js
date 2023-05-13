const {Category} = require('../../models')
const {validationFails} = require('../../utilities/requestVal');
const {categoriesVal} = require('../../utilities/schemas');
const {Op} = require('sequelize')
const {Chat} = require('../../models')

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
            data:cate
		})
    } catch (error) {
        console.log(error)
        return res.status(500).send({
			success: false,
            error,
			message: "An error occured while creating categories"
		})
    }

}

// getting of categories perUser connection #
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


// chat per categories/thread is going to be base on request 
const chatPerCategory = async (req, res) =>{
    const {connection_id, cart_id} = req.body
    try {
        const data = await Chat.findAll({
            where:{
                [Op.and]:[
                    {userConnectionId:connection_id},
                    {categoryId:cart_id}
                ]
            }
        })
        res.status(200).json({
            message: "Successful",
			success: true,
			data: data
        })
    } catch (err) {
        res.status(500).json({
            message: "An error occur while fetching",
			error: err
        })
    }
}

//delete the category
const deleteCart = async (req,res)=>{
    const {id} = req.params
    console.log(id)

    try {
        const cartDelete = await Category.destroy({
            where:{
                id
            }
        })
        res.status(200).send({
            success:true,
            message:"deleted successfully",
            data:cartDelete
        })
    } catch (err) {
        res.status(500).json({
			error: err
        })
    }
   


}

module.exports = {createCategory, 
    categoriesPerUser, 
    chatPerCategory,
    deleteCart
}