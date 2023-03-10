const {Op} = require("sequelize");
const db = require("../../models");
const {connSchema} = require("../../utilities/schemas")

const newConnection = async (req, res) => {
	const {value: {fromId, toId}, error} = connSchema.validate(req.body);
	if (error) return validationFails(res, error);

	try {
		// check if connection request exist
		const conn = await db.UserConnection.findOne({
			where: {
				[Op.or]: {
					[Op.and]: {fromId, toId},
					[Op.and]: {fromId: toId, toId: fromId},
				}
			}
		})

		if (conn) {
			return res.status(400).json({
				message: "Connection request exist before",
				success: false,
				data: conn
			})
		}

		// db.UserConnection.create()
	} catch (error) {
		return res.status(500).json({
			message: "An error occured when confirming initial connection",
			success: false
		})
	}

}

module.exports = {newConnection}