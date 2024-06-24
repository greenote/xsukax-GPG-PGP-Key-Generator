const {Op} = require('sequelize');
const db = require('../../models');
const schemas = require('../../utilities/schemas');
const {validationFails, ENV} = require('../../utilities/helpers');
const {DeleteObjectCommand} = require('@aws-sdk/client-s3');
const {s3} = require('../../utilities/aws-upload');

const exp = {
	getAllUsers: async (req, res) => {
		try {
			const requests = await db.User.findAll();
			return res.status(200).json({
				message: 'Successful',
				success: true,
				data: requests,
			});
		} catch (error) {
			return res.status(500).json({
				message: 'An error occured when getting all users',
				success: false,
			});
		}
	},

	getActiveUser: async (req, res) => {
		const {userId} = req.user;
		try {
			const user = await db.User.findByPk(userId);
			return res.status(200).json({
				message: 'Successful',
				success: true,
				data: user,
			});
		} catch (error) {
			return res.status(500).json({
				message: 'An error occured when getting user details',
				success: false,
			});
		}
	},

	deleteUser: async (req, res) => {
		const {userId} = req.user;
		try {
			const user = await db.User.findByPk(userId);
			if (user) {
				user.set({status: 'disabled'});
				await user.save();
				return res.status(200).json({
					message: 'Successful',
					success: true,
					// data: user
				});
			} else {
				return res.status(422).json({
					message: "Can't confirm user",
					success: false,
				});
			}
		} catch (error) {
			return res.status(500).json({
				message: 'An error occured when getting user details',
				success: false,
			});
		}
	},

	getUser: async (req, res) => {
		const {value, error} = schemas.getUser.validate(req.body);
		if (error) return validationFails(res, error);

		try {
			const user = await db.User.findOne({
				where: {
					[Op.or]: [{id: value.id ?? null}, {phone: value.phone ?? null}],
				},
			});

			return res.status(200).json({
				message: 'Successful',
				success: true,
				data: user,
			});
		} catch (error) {
			console.log(error);
			return res.status(500).json({
				message: 'An error occured when fetching user details',
				success: false,
			});
		}
	},

	deletePreviousImage: async (user, file) => {
		if (user.dPicture && file) {
			try {
				const command = new DeleteObjectCommand({
					Bucket: ENV('AWS_BUCKET_NAME'),
					Key: new URL(user.dPicture).pathname.slice(1)
				});
				s3.send(command);
			} catch (error) {
				console.log("Could't delete previous image", error);
			}
		}
	},

	updateUser: async (req, res) => {
		// get the only values you need
		const {userId} = req.user;
		const {name, bio, dName} = req.data;
		let update = {name, bio, dName};
		if (req?.file) {
			update = {
				...update,
				dPicture: req.file.path,
			};
		}

		try {
			const user = await db.User.findByPk(userId);
			if (user) {
				exp.deletePreviousImage(user, req?.file);
				user.set(update);
				await user.save();
				return res.status(200).json({
					message: 'Successful',
					success: true,
					data: user,
				});
			} else {
				return res.status(422).json({
					message: "Can't confirm user",
					success: false,
				});
			}
		} catch (error) {
			console.log(error);
			return res.status(500).json({
				message: 'An error occured when updating user details',
				success: false,
			});
		}
	},

	updateUserDisplayImage: async (req, res) => {
		if (!req?.file) {
			return res.status(422).json({
				success: false,
				message: '`dp` field is required.',
			})
		}

		const {userId} = req.user;
		try {
			const user = await db.User.findByPk(userId);
			if (user) {
				exp.deletePreviousImage(user, req?.file);
				user.set({dPicture: req.file.path});
				await user.save();
				return res.status(200).json({
					message: 'Successful',
					success: true,
					data: user,
				});
			} else {
				return res.status(422).json({
					message: "Can't confirm user",
					success: false,
				});
			}
		} catch (error) {
			console.log(error);
			return res.status(500).json({
				message: 'An error occured when updating user details',
				success: false,
			});
		}

	},
};



module.exports = exp;