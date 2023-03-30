const {Chat} = require('../../models')
const {Op} = require('sequelize')
//chatting method
const newChat = async (req,res) =>{
    try {
        const {message, senderId, receiverId, categoryId, userConnectionId} = req.body
        const crateChat = {message, senderId, receiverId, categoryId, userConnectionId}
        const data = await Chat.create({ ...crateChat })
        return res.status(200).json({
			message: "Message send succesfully",
			success: true,
            data
		})
    } catch (error) {
        return res.status(500).send({
			success: false,
            error,
			message: "An error occured while sending the message"
		})
    }
}

//fetch chat per userconnection
const fetchChat = async (req, res) =>{
    const {connId} = req.params
    console.log(connId)
    try {
        const data = await Chat.findAll({
            where:{
                userConnectionId:{
                    [Op.eq]:connId
                }
            },
            include:['sender', 'receiver']
        })

        return res.status(200).json({
			message: "chats fetched succesfully",
			success: true,
            data
		})

    } catch (error) {
        return res.status(500).send({
			success: false,
            error,
			message: "An error occured while fetching the message"
		})
    }
}
module.exports = {newChat, fetchChat}