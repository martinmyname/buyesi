// Import API modules
import { galleryAPI } from './api.js';

// Get API_BASE_URL from window object
const API_BASE_URL = window.API_BASE_URL;

document.addEventListener('DOMContentLoaded', async function () {
	try {
		await loadGalleryImages();
	} catch (error) {
		console.error('Error loading gallery images:', error);
	}
});

async function loadGalleryImages() {
	try {
		const galleryContainer = document.querySelector('.gallery-container');
		if (!galleryContainer) {
			console.error('Gallery container not found');
			return;
		}

		// Add loading state
		galleryContainer.innerHTML =
			'<div class="col-12 text-center"><div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div></div>';

		// Fetch gallery images from the API
		console.log('Fetching gallery images...');
		const response = await galleryAPI.getAll();
		console.log('API Response:', response);

		// Handle both array response and object with data property
		const galleryImages = Array.isArray(response)
			? response
			: response.data || [];
		console.log('Processed gallery images:', galleryImages);

		if (!galleryImages || !galleryImages.length) {
			galleryContainer.innerHTML =
				'<div class="col-12 text-center"><p>No gallery images found.</p></div>';
			return;
		}

		// Clear any existing content
		galleryContainer.innerHTML = '';

		// Render each gallery image
		galleryImages.forEach((image) => {
			// Construct the image URL properly
			let imageUrl;
			if (image.url) {
				if (image.url.startsWith('http')) {
					imageUrl = image.url;
				} else if (image.url.includes('/uploads/')) {
					imageUrl = `${API_BASE_URL}${image.url}`;
				} else {
					imageUrl = `${API_BASE_URL}/uploads/gallery/${image.url}`;
				}
				console.log('Image URL for gallery:', imageUrl);
			} else {
				imageUrl = 'images/gallery-default.jpg';
			}

			const imageHTML = `
				<div class="col-md-4 ftco-animate">
					<a href="${imageUrl}" class="gallery image-popup img d-flex align-items-center" style="background-image: url(${imageUrl});">
						<div class="icon mb-4 d-flex align-items-center justify-content-center">
							<span class="icon-instagram"></span>
						</div>
					</a>
				</div>
			`;

			galleryContainer.innerHTML += imageHTML;
		});

		// Initialize the lightbox
		$('.image-popup').magnificPopup({
			type: 'image',
			closeOnContentClick: true,
			closeBtnInside: false,
			fixedContentPos: true,
			mainClass: 'mfp-no-margins mfp-with-zoom',
			image: {
				verticalFit: true,
			},
			zoom: {
				enabled: true,
				duration: 300,
			},
		});
	} catch (error) {
		console.error('Failed to load gallery images:', error);
		const galleryContainer = document.querySelector('.gallery-container');
		if (galleryContainer) {
			galleryContainer.innerHTML =
				'<div class="col-12 text-center"><p>Failed to load gallery images. Please try again later.</p></div>';
		}
	}
}
