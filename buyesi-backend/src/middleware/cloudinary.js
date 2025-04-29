const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer to use memory storage instead of disk or cloudinary storage
const storage = multer.memoryStorage();

// Configure upload middleware
const upload = multer({
	storage: storage,
	limits: {
		fileSize: 10 * 1024 * 1024, // 10MB limit
	},
	fileFilter: (req, file, cb) => {
		// Accept only image files
		if (file.mimetype.startsWith('image/')) {
			cb(null, true);
		} else {
			cb(new Error('Not an image! Please upload only images.'), false);
		}
	},
});

// Middleware to handle Cloudinary upload
const uploadToCloudinary = async (req, res, next) => {
	// Skip if no file was uploaded
	if (!req.file) {
		return next();
	}

	try {
		// Create a buffer from the file data
		const b64 = Buffer.from(req.file.buffer).toString('base64');
		const dataURI = `data:${req.file.mimetype};base64,${b64}`;

		// Upload to Cloudinary
		const result = await cloudinary.uploader.upload(dataURI, {
			folder: 'buyesi',
			resource_type: 'auto',
			transformation: [{ width: 1000, crop: 'limit' }],
		});

		// Add cloudinary result to the request
		req.file.cloudinary = {
			url: result.secure_url,
			public_id: result.public_id,
			signature: result.signature,
			version: result.version,
			format: result.format,
			resource_type: result.resource_type,
		};

		next();
	} catch (error) {
		console.error('Cloudinary upload error:', error);
		return res.status(500).json({
			success: false,
			error: 'Image upload failed',
		});
	}
};

// Create middleware that combines multer and cloudinary upload
const cloudinaryUpload = {
	single: (fieldName) => {
		return [upload.single(fieldName), uploadToCloudinary];
	},
};

module.exports = {
	cloudinary,
	cloudinaryUpload,
};
