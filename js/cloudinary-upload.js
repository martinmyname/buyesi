// Cloudinary Upload Utility

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = 'dbgy1uc0i'; // Your Cloudinary cloud name
const CLOUDINARY_UPLOAD_PRESET = 'buyesi'; // Replace with your Cloudinary upload preset

// Function to open Cloudinary upload widget
function uploadImageToCloudinary(callback) {
	cloudinary.openUploadWidget(
		{
			cloud_name: CLOUDINARY_CLOUD_NAME,
			upload_preset: CLOUDINARY_UPLOAD_PRESET,
			sources: ['local', 'url', 'camera'],
			multiple: false,
			cropping: true,
			cropping_aspect_ratio: 1.6,
			theme: 'minimal',
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
				callback(null, result.info.secure_url);
			} else if (error) {
				console.error('Upload error:', error);
				callback(error, null);
			}
		}
	);
}

// Function to be called when adding new content
function handleImageUploadForContent(contentType, formData, callback) {
	uploadImageToCloudinary((error, imageUrl) => {
		if (error) {
			callback(error, null);
		} else {
			formData.image = imageUrl; // Store Cloudinary URL in form data
			console.log(`Image uploaded for ${contentType}:`, imageUrl);
			callback(null, formData);
		}
	});
}

// Function to setup upload button for forms
function setupUploadButton(buttonId, contentType, formId) {
	const button = document.getElementById(buttonId);
	const form = document.getElementById(formId);
	if (button && form) {
		button.addEventListener('click', (e) => {
			e.preventDefault();
			uploadImageToCloudinary((error, imageUrl) => {
				if (error) {
					console.error(`Error uploading image for ${contentType}:`, error);
					alert('Failed to upload image. Please try again.');
				} else {
					console.log(`Image uploaded for ${contentType}:`, imageUrl);
					// Store the URL in a hidden input field in the form
					let hiddenInput = form.querySelector('input[name="image"]');
					if (!hiddenInput) {
						hiddenInput = document.createElement('input');
						hiddenInput.type = 'hidden';
						hiddenInput.name = 'image';
						form.appendChild(hiddenInput);
					}
					hiddenInput.value = imageUrl;
					alert('Image uploaded successfully!');
				}
			});
		});
	} else {
		console.error('Button or form not found for ID:', buttonId, formId);
	}
}

// Initialize upload buttons for different content types (call this after DOM is loaded)
function initializeUploadButtons() {
	// Setup upload buttons for different content types
	setupUploadButton('uploadBlogImage', 'blog', 'blogForm');
	setupUploadButton('uploadEventImage', 'event', 'eventForm');
	setupUploadButton('uploadTeamImage', 'team', 'teamForm');
	setupUploadButton('uploadGalleryImage', 'gallery', 'galleryForm');
	setupUploadButton('uploadCauseImage', 'cause', 'causeForm');
	console.log('Upload buttons initialized for content forms');
}

// Call initializeUploadButtons when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeUploadButtons);

// Example usage in forms (to be integrated into existing form submission logic)
/*
function setupContentForm(contentType, formId, apiEndpoint) {
	const form = document.getElementById(formId);
	if (form) {
		form.addEventListener('submit', async (e) => {
			e.preventDefault();
			const formData = new FormData(form);
			// The image URL should already be in a hidden input field
			// Submit form data with Cloudinary URL to API
			try {
				await apiEndpoint.create(formData);
				alert('Content added successfully!');
				form.reset();
			} catch (error) {
				console.error(`Error submitting form for ${contentType}:`, error);
				alert('Failed to add content. Please try again.');
			}
		});
	}
}
*/
