// Cloudinary Upload Utility

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = 'dbgy1uc0i'; // Your Cloudinary cloud name
const CLOUDINARY_UPLOAD_PRESET = 'buyesi'; // Use your custom upload preset

// Flag to indicate Cloudinary is available
window.CLOUDINARY_ENABLED = true;

// Function to open Cloudinary upload widget
function uploadImageToCloudinary(callback) {
	// Check if cloudinary is loaded
	if (typeof cloudinary === 'undefined') {
		console.error(
			'Cloudinary widget not loaded. Check Content Security Policy.'
		);
		alert('Image upload service not available. Please try again later.');
		if (callback) callback(new Error('Cloudinary not loaded'), null);
		return;
	}

	cloudinary.openUploadWidget(
		{
			cloud_name: CLOUDINARY_CLOUD_NAME,
			upload_preset: CLOUDINARY_UPLOAD_PRESET,
			sources: ['local', 'url', 'camera'],
			multiple: false,
			cropping: true,
			cropping_aspect_ratio: 1.6,
			theme: 'minimal',
			max_file_size: 10000000, // 10MB
			resource_type: 'image',
			timeout: 120000, // 120 seconds (longer timeout)
			show_powered_by: false,
			max_image_width: 1800,
			max_image_height: 1800,
			quality: 'auto:good',
			eager: [
				{ width: 1200, height: 675, crop: 'fill', quality: 'auto:good' },
				{ width: 800, height: 450, crop: 'fill', quality: 'auto:good' },
			],
			client_allowed_formats: ['png', 'jpg', 'jpeg', 'gif', 'webp'],
			styles: {
				palette: {
					window: '#FFFFFF',
					sourceBg: '#f4f4f5',
					windowBorder: '#90a0b3',
					tabIcon: '#0078FF',
					inactiveTabIcon: '#69778A',
					menuIcons: '#0078FF',
					link: '#0078FF',
					action: '#FF620C',
					inProgress: '#0078FF',
					complete: '#20B832',
					error: '#E61E1E',
					textDark: '#000000',
					textLight: '#FFFFFF',
				},
				fonts: {
					default: null,
					"'Poppins', sans-serif": {
						url: 'https://fonts.googleapis.com/css?family=Poppins',
						active: true,
					},
				},
			},
		},
		function (error, result) {
			if (!error && result && result.event === 'success') {
				console.log('Upload successful:', result.info.secure_url);
				if (callback) callback(null, result.info.secure_url);
				// Close the widget after successful upload
				cloudinary.closeUploadWidget();
			} else if (error) {
				console.error('Upload error:', error);
				alert('Upload error: ' + (error.message || 'Unknown error'));
				if (callback) callback(error, null);
			} else if (result && result.event === 'abort') {
				console.log('Upload cancelled by user');
				if (callback) callback(new Error('Upload cancelled'), null);
			} else if (result && result.event === 'error') {
				console.error('Upload error:', result.info);
				const errorMessage =
					result.info.message || result.info.status || 'Unknown error';
				alert(`Upload failed: ${errorMessage}`);
				if (callback) callback(new Error(errorMessage), null);
			}
		}
	);
}

// Alternative upload function using fetch directly to Cloudinary
async function uploadImageDirectly(file, callback) {
	try {
		if (!file) {
			throw new Error('No file selected');
		}

		// Show loading indicator
		console.log('Uploading image directly...');

		// Check if file is too large (>10MB)
		if (file.size > 10000000) {
			console.warn('File is large, compressing before upload...');
			try {
				file = await compressImage(file);
			} catch (compressionError) {
				console.warn(
					'Compression failed, trying to upload original:',
					compressionError
				);
			}
		}

		// Create FormData
		const formData = new FormData();
		formData.append('file', file);
		formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
		formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);
		formData.append('quality', 'auto:good');

		// Send to Cloudinary
		const response = await fetch(
			`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
			{
				method: 'POST',
				body: formData,
			}
		);

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error?.message || 'Upload failed');
		}

		const data = await response.json();
		console.log('Upload successful:', data.secure_url);
		callback(null, data.secure_url);
	} catch (error) {
		console.error('Direct upload error:', error);
		alert('Upload failed: ' + error.message);
		callback(error, null);
	}
}

// Helper function to compress images before upload
async function compressImage(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function (event) {
			const img = new Image();
			img.src = event.target.result;
			img.onload = function () {
				const canvas = document.createElement('canvas');
				let width = img.width;
				let height = img.height;

				// Scale down large images
				if (width > 1800 || height > 1800) {
					const ratio = Math.min(1800 / width, 1800 / height);
					width *= ratio;
					height *= ratio;
				}

				canvas.width = width;
				canvas.height = height;
				const ctx = canvas.getContext('2d');
				ctx.drawImage(img, 0, 0, width, height);

				// Convert to blob with reduced quality
				canvas.toBlob(
					(blob) => {
						if (!blob) {
							reject(new Error('Canvas to Blob conversion failed'));
							return;
						}

						// Create a new file from the blob
						const newFile = new File([blob], file.name, {
							type: 'image/jpeg',
							lastModified: new Date().getTime(),
						});
						resolve(newFile);
					},
					'image/jpeg',
					0.8 // 80% quality
				);
			};
			img.onerror = function () {
				reject(new Error('Image load error'));
			};
		};
		reader.onerror = function () {
			reject(new Error('File read error'));
		};
	});
}

// Simple file input upload function
function setupFileInputUpload(inputElement, callback) {
	inputElement.addEventListener('change', function (e) {
		const file = e.target.files[0];
		if (!file) {
			callback(new Error('No file selected'), null);
			return;
		}

		// Use the direct upload function
		uploadImageDirectly(file, callback);
	});
}

// Global function to upload images from anywhere in the application
window.uploadImage = function (callback) {
	// Use only the Cloudinary widget for uploads
	try {
		uploadImageToCloudinary(callback);
	} catch (error) {
		console.error('Cloudinary widget upload failed:', error);
		alert(
			'Failed to initialize Cloudinary upload. Please ensure the widget is loaded correctly.'
		);
		if (callback) callback(error, null);
	}
};

// Create a fallback getImageUrl function if the original is not available
function defaultGetImageUrl(url) {
	return url; // Simply return the URL as-is
}

// Extend the getImageUrl function from home.min.js to support Cloudinary URLs
// This will run after the page is fully loaded
document.addEventListener('DOMContentLoaded', function () {
	console.log('Cloudinary upload utility initialized');

	// Setup our own getImageUrl if it doesn't exist
	if (!window.getImageUrl) {
		window.getImageUrl = defaultGetImageUrl;
		console.log('Created fallback getImageUrl function');
	} else {
		// Store the original function
		const originalGetImageUrl = window.getImageUrl;

		// Override with our enhanced version that checks for Cloudinary URLs
		window.getImageUrl = function (url, type) {
			// If it's already a Cloudinary URL or another full URL, return it as is
			if (url && (url.includes('cloudinary.com') || url.startsWith('http'))) {
				console.log(`Using Cloudinary/external URL for ${type}: ${url}`);
				return url;
			}

			// Otherwise, use the original logic
			return originalGetImageUrl(url, type);
		};

		console.log(
			'Enhanced existing getImageUrl function to support Cloudinary URLs'
		);
	}

	// Initialize the upload buttons on all modals
	initializeUploadButtons();
});

// Function to setup upload buttons for the admin dashboard
function initializeUploadButtons() {
	const uploadButtons = {
		uploadTeamImage: 'teamImageUrl',
		uploadBlogImage: 'blogImageUrl',
		uploadEventImage: 'eventImageUrl',
		uploadGalleryImage: 'galleryImageUrl',
		uploadCauseImage: 'causeImageUrl',
	};

	Object.entries(uploadButtons).forEach(([buttonId, inputId]) => {
		const button = document.getElementById(buttonId);
		const input = document.getElementById(inputId);
		const previewDiv = button
			? button
					.closest('.image-upload-container')
					.querySelector('.image-preview')
			: null;

		if (button && input) {
			button.addEventListener(
				'click',
				function (e) {
					// Use stopPropagation instead of preventDefault to avoid passive event warnings
					e.stopPropagation();

					// Disable the button during upload to prevent double-clicks
					button.disabled = true;
					button.textContent = 'Uploading...';

					// Add a loading indicator to the preview
					if (previewDiv) {
						previewDiv.style.display = 'block';
						previewDiv.innerHTML = `
						<div class="text-center p-3">
							<div class="spinner-border text-primary" role="status">
								<span class="sr-only">Loading...</span>
							</div>
							<p class="mt-2">Uploading image...</p>
						</div>
					`;
					}

					window.uploadImage((error, url) => {
						// Re-enable the button
						button.disabled = false;
						button.textContent = 'Upload Image';

						if (error) {
							console.error('Upload error:', error);
							alert(
								'Failed to upload image: ' + (error.message || 'Unknown error')
							);
							// Clear the preview on error
							if (previewDiv) {
								previewDiv.innerHTML = `
								<div class="alert alert-danger">
									Upload failed: ${error.message || 'Unknown error'}
								</div>`;
								setTimeout(() => {
									previewDiv.innerHTML = '';
									previewDiv.style.display = 'none';
								}, 5000);
							}
						} else if (url) {
							console.log('Image uploaded successfully:', url);
							input.value = url;

							if (previewDiv) {
								previewDiv.style.display = 'block';
								previewDiv.innerHTML = `
								<div class="card">
									<img src="${url}" class="img-fluid" alt="Preview" 
										onerror="this.onerror=null; this.src='images/placeholder.jpg'; console.error('Could not load image preview');">
									<div class="card-body">
										<p class="text-success">Image uploaded successfully!</p>
									</div>
								</div>
							`;
							}
						}
					});

					// Prevent default here, but not critical if it fails due to passive listener
					try {
						e.preventDefault();
					} catch (err) {
						// Ignore preventDefault errors in passive listeners
					}
				},
				{ passive: false }
			); // Try to make the listener non-passive
		} else {
			console.warn(`Button or input not found: ${buttonId}, ${inputId}`);
		}
	});

	console.log('Upload buttons initialized for all forms');
}

// Export functions for testing
if (typeof module !== 'undefined') {
	module.exports = {
		uploadImageToCloudinary,
		initializeUploadButtons,
		uploadImageDirectly,
		setupFileInputUpload,
		compressImage,
	};
}
