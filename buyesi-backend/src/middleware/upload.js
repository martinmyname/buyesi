const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory and subdirectories if they don't exist
const uploadsDir = path.join(__dirname, '../../uploads');
const subDirs = ['blog', 'events', 'gallery', 'team'];

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
	try {
		fs.mkdirSync(uploadsDir, { recursive: true });
		console.log('Created uploads directory:', uploadsDir);
	} catch (error) {
		console.error('Error creating uploads directory:', error);
		throw error;
	}
}

// Create subdirectories
subDirs.forEach((dir) => {
	const dirPath = path.join(uploadsDir, dir);
	if (!fs.existsSync(dirPath)) {
		try {
			fs.mkdirSync(dirPath, { recursive: true });
			console.log('Created subdirectory:', dirPath);
		} catch (error) {
			console.error(`Error creating subdirectory ${dir}:`, error);
			throw error;
		}
	}
});

// Set storage engine
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		// Determine the subdirectory based on the route
		let subDir = 'general'; // Default directory
		console.log(`Determining upload destination for URL: ${req.originalUrl}`);

		if (req.originalUrl.includes('/blogs')) {
			subDir = 'blog';
		} else if (req.originalUrl.includes('/events')) {
			subDir = 'events';
		} else if (req.originalUrl.includes('/galleries')) {
			subDir = 'gallery';
		} else if (req.originalUrl.includes('/teams')) {
			subDir = 'team';
		}

		const uploadPath = path.join(uploadsDir, subDir);
		console.log(`Calculated upload path: ${uploadPath}`);

		// Ensure the specific subdir exists
		if (!fs.existsSync(uploadPath)) {
			try {
				fs.mkdirSync(uploadPath, { recursive: true });
				console.log('Created upload directory:', uploadPath);
			} catch (error) {
				console.error(`Error creating upload directory ${uploadPath}:`, error);
				return cb(
					new Error(`Failed to create upload directory: ${error.message}`)
				);
			}
		}

		cb(null, uploadPath);
	},
	filename: function (req, file, cb) {
		// Generate a unique filename
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
		cb(
			null,
			file.fieldname + '-' + uniqueSuffix + path.extname(sanitizedFilename)
		);
	},
});

// Check file type
const fileFilter = (req, file, cb) => {
	// Allowed file extensions
	const filetypes = /jpeg|jpg|png|gif|webp/;
	// Check extension
	const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
	// Check mime type
	const mimetype = filetypes.test(file.mimetype);

	if (mimetype && extname) {
		return cb(null, true);
	} else {
		cb(
			new Error(
				'Images only! Please upload a valid image file (jpeg, jpg, png, gif, webp)'
			)
		);
	}
};

// Initialize upload variable
const upload = multer({
	storage: storage,
	limits: { fileSize: 10000000 }, // 10MB max file size
	fileFilter: fileFilter,
});

module.exports = upload;
