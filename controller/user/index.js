const db = require("../../models");

module.exports = {
	getAllUsers: async (req, res) => {
		// const {userId} = req.user;
		try {
			const requests = await db.User.findAll();
			return res.status(200).json({
				message: "Successful",
				success: true,
				data: requests
			})
		} catch (error) {
			return res.status(500).json({
				message: "An error occured when getting all users",
				success: false
			});
		}
	}

}