const {S3Client} = require('@aws-sdk/client-s3');
const {Upload} = require('@aws-sdk/lib-storage');
const {ENV, validationFails} = require("./helpers")
const {randomBytes} = require('crypto');
const busboy = require('busboy');
const path = require('path');
const fs = require('fs');
const {IncomingForm} = require('formidable');

const s3 = new S3Client({
	region: ENV('AWS_REGION'),
	credentials: {
		accessKeyId: ENV('AWS_ACCESS_KEY'),
		secretAccessKey: ENV('AWS_SECRET_ACCESS_KEY'),
	},
});

const getObjectBase = (bucket = ENV('AWS_BUCKET_NAME'), region = ENV('AWS_REGION')) => `https://${bucket}.s3.${region}.amazonaws.com/`;

const generateFileKey = (folder, filename) => {
	if (folder) {
		return path.join(
			folder,
			`${randomBytes(10).toString('hex')}_${path.basename(filename).replace(/\s/gi, '_')}`,
		)
	} else {
		return `${randomBytes(10).toString('hex')}_${path.basename(filename).replace(/\s/gi, '_')}`;
	}
}

const UploadToS3 = async (req, callback) => {
	const bb = busboy({headers: req.headers});
	let response = {
		status: 1,
		fields: {},
		files: [],
		message: "",
	};

	try {
		bb.on('file', async function (name, file, info) {
			const key = generateFileKey(ENV('DP_PATH'), info.filename);
			const fileResponse = {status: 0, message: "", name, key};
			const s3Params = {
				Body: file,
				Key: key,
				Bucket: ENV('AWS_BUCKET_NAME'),
				Metadata: {'Content-Type': info.mimeType},
			};

			try {
				const uploader = new Upload({client: s3, params: s3Params});

				// uploader.on('httpUploadProgress', (progress) => {
				// can do any thing with progress
				// });

				await uploader.done();
				fileResponse.status = 1;
				fileResponse.message = 'File Uploaded Successfully';
			} catch (error) {
				fileResponse.message = 'Can\'t Upload file.';
			}

			response.files.push(fileResponse)
			console.log(response);
			file.on('error', (error) => {
				fileResponse.message = 'Can\'t read file.';
				console.log(fileResponse);
			});
		});

		bb.on('field', (name, val, info) => {
			response.fields[name] = val;
		});

		bb.on('finish', () => {
			callback(response);
			// callback(response);
		});

		bb.on('close', () => {
			// callback(response);
		});

		bb.on('error', (error) => {
			response.status = 0;
			response.message = 'Can\'t process this request at the moment.';
			// callback(response);
		});
		await req.pipe(bb);
		// callback(response);
	} catch (error) {
		response.status = 0;
		response.message = '500: Can\'t process this request at the moment.';
		callback(response);
	}
};


const formidableSingleUpload = (
	fileKey, schema,
	folder, bucket = ENV('AWS_BUCKET_NAME')
) => {
	return (req, res, next) => {
		const form = new IncomingForm();
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

			const validated = schema?.validate(updateData);
			// const {value: cleanUpdate, error} = schema?.validate(updateData);
			if (validated?.error && schema) {
				return validationFails(res, validated?.error)
			};
			const cleanUpdate = validated?.value ?? {}

			if (files[fileKey] && files[fileKey][0]) {
				const {filepath, originalFilename, mimeType} = files[fileKey][0];
				const _key = generateFileKey(folder, originalFilename);
				try {
					const s3Params = {
						Body: fs.createReadStream(filepath),
						Key: _key,
						Bucket: bucket,
						Metadata: {'Content-Type': mimeType},
					};
					cleanUpdate.fileKey = _key;
					const uploader = new Upload({client: s3, params: s3Params});
					await uploader.done();
				} catch (error) {
					console.log(error);
					return res.status(500).json({
						success: false,
						message: 'Can\'t upload file, please try again.',
					})
				}

				req.file = {
					path: `${getObjectBase()}${cleanUpdate.fileKey}`,
					key: cleanUpdate.fileKey
				};
			}


			req.data = cleanUpdate;

			return next();

		});
	}
}

module.exports = {
	s3, formidableSingleUpload,
	generateFileKey, getObjectBase
};
