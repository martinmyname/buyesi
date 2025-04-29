// Blog Upload Form Handler
document.addEventListener('DOMContentLoaded', function () {
	console.log('Blog upload form handler initialized');

	// Get the form and relevant elements
	const blogForm = document.getElementById('blogUploadForm');
	const formFeedback = document.getElementById('formFeedback');
	const submitButton = blogForm.querySelector('input[type="submit"]');
	const submitSpinner = document.getElementById('submitSpinner');
	const imagePreviewContainer = document.getElementById(
		'imagePreviewContainer'
	);
	const imagePreview = document.getElementById('imagePreview');

	// Check if window.API is available
	if (typeof window.API === 'undefined') {
		console.error('API not available for blog uploads');
		formFeedback.innerHTML = `
            <div class="alert alert-danger">
                API connection not available. Please reload the page and try again.
            </div>
        `;
		if (submitButton) submitButton.disabled = true;
		return;
	}

	// Setup image preview when a Cloudinary image is uploaded
	const setupImagePreview = function () {
		// Check for hidden image input
		const checkForImageInput = setInterval(function () {
			const imageInput = document.querySelector('input[name="image"]');
			if (imageInput) {
				clearInterval(checkForImageInput);

				// Watch for changes to the image input
				const observer = new MutationObserver(function (mutations) {
					mutations.forEach(function (mutation) {
						if (
							mutation.type === 'attributes' &&
							mutation.attributeName === 'value'
						) {
							const imageUrl = imageInput.value;
							if (imageUrl) {
								// Show image preview
								imagePreview.src = imageUrl;
								imagePreviewContainer.style.display = 'block';
								console.log('Image preview updated:', imageUrl);
							}
						}
					});
				});

				observer.observe(imageInput, { attributes: true });
			}
		}, 500);
	};

	// Call setup image preview
	setupImagePreview();

	// Handle form submission
	if (blogForm) {
		blogForm.addEventListener('submit', async function (e) {
			e.preventDefault();

			// Show loading state
			if (submitButton) submitButton.disabled = true;
			if (submitSpinner) submitSpinner.style.display = 'inline-block';

			try {
				// Prepare form data
				const formData = new FormData(blogForm);
				const blogData = {
					title: formData.get('title'),
					excerpt: formData.get('excerpt'),
					content: formData.get('content'),
					image: formData.get('image'), // This should be the Cloudinary URL
					author: formData.get('author'),
					categories: formData.get('categories')
						? formData
								.get('categories')
								.split(',')
								.map((item) => item.trim())
						: [],
					tags: formData.get('tags')
						? formData
								.get('tags')
								.split(',')
								.map((item) => item.trim())
						: [],
				};

				console.log('Submitting blog post with data:', blogData);

				// Ensure we have an image URL (should be from Cloudinary)
				if (!blogData.image) {
					throw new Error('Please upload an image for the blog post');
				}

				// Submit to API
				const response = await window.API.blog.create(blogData);

				console.log('Blog post created successfully:', response);

				// Show success message
				formFeedback.innerHTML = `
                    <div class="alert alert-success">
                        Blog post created successfully! Redirecting to blog page...
                    </div>
                `;

				// Reset form
				blogForm.reset();
				imagePreviewContainer.style.display = 'none';

				// Redirect to blogs page after 2 seconds
				setTimeout(function () {
					window.location.href = 'blog.html';
				}, 2000);
			} catch (error) {
				console.error('Error creating blog post:', error);

				// Show error message
				formFeedback.innerHTML = `
                    <div class="alert alert-danger">
                        ${
													error.message ||
													'Failed to create blog post. Please try again.'
												}
                    </div>
                `;
			} finally {
				// Restore form state
				if (submitButton) submitButton.disabled = false;
				if (submitSpinner) submitSpinner.style.display = 'none';
			}
		});
	}
});
