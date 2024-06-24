const {Op} = require('sequelize');
const db = require('../../models');
const schemas = require('../../utilities/schemas');
const {validationFails, ENV} = require('../../utilities/helpers');
const {s3, generateFileKey, DP_PATH} = require('../../utilities/aws-upload');
const {GetObjectCommand} = require('@aws-sdk/client-s3');
const fs = require('fs');
const {Upload} = require('@aws-sdk/lib-storage');
const {formidable} = require('formidable');

module.exports = {
	getAllUsers: async (req, res) => {
		// const {userId} = req.user;
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

	updateUser: async (req, res) => {
		const form = formidable();
		return form.parse(req, async (err, fields, files) => {
			if (err) {
				return res.status(500).json({
					success: false,
					message: 'Can\'t process this form data at the moment'
				})
			}

			const updateData = {};
			Object.entries(fields).forEach(([key, [value]]) => {
				updateData[key] = value;
			})
			const {value: cleanUpdate, error} = schemas.updateUser.validate(updateData);
			if (error) return validationFails(res, error);

			if (files.dp && files.dp[0]) {
				const {filepath, originalFilename, mimeType} = files.dp[0];
				const dPictureKey = generateFileKey(DP_PATH, originalFilename);
				try {
					const s3Params = {
						Body: fs.createReadStream(filepath),
						Key: dPictureKey,
						Bucket: ENV('AWS_BUCKET_NAME'),
						Metadata: {'Content-Type': mimeType},
					};
					cleanUpdate.dPictureKey = dPictureKey;
					const uploader = new Upload({client: s3, params: s3Params});
					await uploader.done();

					const command = new GetObjectCommand({
						Key: dPictureKey,
						Bucket: ENV('AWS_BUCKET_NAME'),
						"Range": "bytes=0-9"
					});
					const response = await s3.send(command);
					console.log(response);
				} catch (error) {
					console.log(error);
					return res.status(500).json({
						success: false,
						message: 'Can\'t upload file, please try again.',
					})
				}
			}


			// get the only values you need
			const {userId} = req.user;
			const {name, bio, dName} = cleanUpdate;
			let update = {name, bio, dName};
			if (cleanUpdate.dPictureKey) {
				update = {
					...update,
					// dPicture: path,
					dPictureKey: cleanUpdate.dPictureKey,
				};
			}

			try {
				const user = await db.User.findByPk(userId);
				if (user) {
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
		});

		const {userId} = req.user;
		const {name, bio, dName} = req.data;
		let update = {name, bio, dName};

		if (req.file) {
			const {path, filename} = req.file;
			update = {
				...update,
				dPicture: path,
				dPictureKey: filename,
			};
		}

		try {
			const user = await db.User.findByPk(userId);
			if (user) {
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
};
