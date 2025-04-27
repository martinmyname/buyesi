// Import API modules
import {
	causeAPI,
	blogAPI,
	teamAPI,
	galleryAPI,
	eventAPI,
	volunteerAPI,
	donationAPI,
	ENDPOINTS,
	fetchFromApi,
} from './api.js';
import { API_BASE_URL } from './api.js';

document.addEventListener('DOMContentLoaded', async function () {
	try {
		// Load latest causes for the carousel
		await loadLatestCauses();

		// Load latest blogs for the blog section
		await loadLatestBlogs();

		// Load team members
		await loadTeamMembers();

		// Load gallery images
		await loadGalleryImages();

		// Load latest events
		await loadLatestEvents();

		// Handle volunteer form submissions
		setupVolunteerForm();

		// Handle donation form
		setupDonationForm();
	} catch (error) {
		console.error('Error loading home page data:', error);
	}
});

async function loadLatestCauses() {
	try {
		const response = await fetchFromApi(ENDPOINTS.CAUSES);
		if (response && response.data) {
			const causesContainer = document.querySelector('.carousel-cause');
			if (causesContainer) {
				response.data.forEach((cause) => {
					const causeElement = createCauseElement(cause);
					causesContainer.appendChild(causeElement);
				});
				initializeCausesCarousel();
			}
		}
	} catch (error) {
		console.error('Failed to load causes:', error);
		showErrorMessage('causes-section', 'Unable to load causes at this time.');
	}
}

async function loadLatestBlogs() {
	try {
		const response = await fetchFromApi(ENDPOINTS.BLOGS);
		if (response && response.data) {
			const blogContainer = document.querySelector('.carousel-blog');
			if (blogContainer) {
				response.data.forEach((blog) => {
					const blogElement = createBlogElement(blog);
					blogContainer.appendChild(blogElement);
				});
				initializeBlogCarousel();
			}
		}
	} catch (error) {
		console.error('Failed to load blogs:', error);
		showErrorMessage('blog-section', 'Unable to load blog posts at this time.');
	}
}

async function loadTeamMembers() {
	try {
		const response = await fetchFromApi(ENDPOINTS.TEAM);
		if (response && response.data) {
			const teamContainer = document.querySelector('.carousel-team');
			if (teamContainer) {
				response.data.forEach((member) => {
					const memberElement = createTeamElement(member);
					teamContainer.appendChild(memberElement);
				});
				initializeTeamCarousel();
			}
		}
	} catch (error) {
		console.error('Failed to load team members:', error);
		showErrorMessage(
			'team-section',
			'Unable to load team members at this time.'
		);
	}
}

async function loadGalleryImages() {
	try {
		const response = await fetchFromApi(ENDPOINTS.GALLERY);
		if (response && response.data) {
			const galleryContainer = document.querySelector('.carousel-gallery');
			if (galleryContainer) {
				response.data.forEach((image) => {
					const imageElement = createGalleryElement(image);
					galleryContainer.appendChild(imageElement);
				});
				initializeGalleryCarousel();
			}
		}
	} catch (error) {
		console.error('Failed to load gallery images:', error);
		showErrorMessage(
			'gallery-section',
			'Unable to load gallery images at this time.'
		);
	}
}

async function loadLatestEvents() {
	try {
		const response = await fetchFromApi(ENDPOINTS.EVENTS);
		if (response && response.data) {
			const eventsContainer = document.querySelector('.carousel-events');
			if (eventsContainer) {
				response.data.forEach((event) => {
					const eventElement = createEventElement(event);
					eventsContainer.appendChild(eventElement);
				});
				initializeEventsCarousel();
			}
		}
	} catch (error) {
		console.error('Failed to load events:', error);
		showErrorMessage('events-section', 'Unable to load events at this time.');
	}
}

function setupVolunteerForm() {
	const form = document.getElementById('volunteer-form');
	if (!form) return;

	form.addEventListener('submit', async (e) => {
		e.preventDefault();

		const submitButton = form.querySelector('button[type="submit"]');
		const originalButtonText = submitButton.innerHTML;
		submitButton.disabled = true;
		submitButton.innerHTML =
			'<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...';

		try {
			const formData = new FormData(form);
			const volunteerData = {
				name: formData.get('name'),
				email: formData.get('email'),
				phone: formData.get('phone'),
				message: formData.get('message'),
			};

			await volunteerAPI.register(volunteerData);
			showAlert(
				'Thank you for your interest in volunteering! We will contact you soon.',
				'success',
				form
			);
			form.reset();
		} catch (error) {
			console.error('Error submitting volunteer form:', error);
			showAlert(
				error.message || 'Failed to submit volunteer form. Please try again.',
				'danger',
				form
			);
		} finally {
			submitButton.disabled = false;
			submitButton.innerHTML = originalButtonText;
		}
	});
}

function setupDonationForm() {
	const form = document.getElementById('donation-form');
	if (!form) return;

	form.addEventListener('submit', async (e) => {
		e.preventDefault();

		const submitButton = form.querySelector('button[type="submit"]');
		const originalButtonText = submitButton.innerHTML;
		submitButton.disabled = true;
		submitButton.innerHTML =
			'<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';

		try {
			const formData = new FormData(form);
			const donationData = {
				amount: parseFloat(formData.get('amount')),
				name: formData.get('name'),
				email: formData.get('email'),
				message: formData.get('message'),
			};

			await donationAPI.create(donationData);
			showAlert(
				'Thank you for your donation! We appreciate your support.',
				'success',
				form
			);
			form.reset();
		} catch (error) {
			console.error('Error submitting donation form:', error);
			showAlert(
				error.message || 'Failed to process donation. Please try again.',
				'danger',
				form
			);
		} finally {
			submitButton.disabled = false;
			submitButton.innerHTML = originalButtonText;
		}
	});
}

function showAlert(message, type, targetForm) {
	const alertDiv = document.createElement('div');
	alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
	alertDiv.role = 'alert';
	alertDiv.innerHTML = `
		${message}
		<button type="button" class="close" data-dismiss="alert" aria-label="Close">
			<span aria-hidden="true">&times;</span>
		</button>
	`;

	if (targetForm) {
		targetForm.insertAdjacentElement('beforebegin', alertDiv);
	} else {
		document.body.insertAdjacentElement('afterbegin', alertDiv);
	}

	// Auto-dismiss after 5 seconds
	setTimeout(() => {
		alertDiv.remove();
	}, 5000);
}

function formatTimeAgo(dateString) {
	const date = new Date(dateString);
	const now = new Date();
	const seconds = Math.floor((now - date) / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (days > 0) {
		return `${days} day${days === 1 ? '' : 's'} ago`;
	} else if (hours > 0) {
		return `${hours} hour${hours === 1 ? '' : 's'} ago`;
	} else if (minutes > 0) {
		return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
	} else {
		return 'Just now';
	}
}

// Show error message in section
function showErrorMessage(sectionId, message) {
	const section = document.getElementById(sectionId);
	if (section) {
		const errorDiv = document.createElement('div');
		errorDiv.className = 'alert alert-warning text-center';
		errorDiv.textContent = message;
		section.querySelector('.row').appendChild(errorDiv);
	}
}

// Initialize all sections when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
	try {
		await Promise.all([
			loadLatestCauses(),
			loadLatestBlogs(),
			loadTeamMembers(),
			loadGalleryImages(),
			loadLatestEvents(),
		]);
	} catch (error) {
		console.error('Error initializing page:', error);
	}
});
