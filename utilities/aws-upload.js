const {S3Client} = require('@aws-sdk/client-s3');
const {Upload} = require('@aws-sdk/lib-storage');
const {ENV} = require("./helpers")
const {randomBytes} = require('crypto');
const busboy = require('busboy');
const path = require('path');

const s3 = new S3Client({
	region: ENV('AWS_REGION'),
	credentials: {
		accessKeyId: ENV('AWS_ACCESS_KEY'),
		secretAccessKey: ENV('AWS_SECRET_ACCESS_KEY'),
	},
});

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
			const key = path.join(
				'display-pictures',
				`${randomBytes(10).toString('hex')}_${path.basename(info.filename).replace(/\s/gi, '_')}`,
			);
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
				console.log(fileResponse);
			} catch (error) {
				fileResponse.message = 'Can\'t Upload file.';
				console.log(fileResponse);
			}
			response.files.push(fileResponse)
			callback(response);

			file.on('error', (error) => {
				fileResponse.message = 'Can\'t read file.';
				console.log(fileResponse);
			});
		});

		bb.on('field', (name, val, info) => {
			response.fields[name] = val;
		});

		bb.on('finish', () => {
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

module.exports = {UploadToS3};
