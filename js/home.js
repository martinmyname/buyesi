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
					// Construct the image URL properly
					let imageUrl;
					if (cause.image) {
						if (cause.image.startsWith('http')) {
							imageUrl = cause.image;
						} else if (cause.image.includes('/uploads/')) {
							imageUrl = `${API_BASE_URL}${cause.image}`;
						} else {
							imageUrl = `${API_BASE_URL}/uploads/causes/${cause.image}`;
						}
					} else {
						imageUrl = 'images/cause-default.jpg';
					}

					const causeElement = document.createElement('div');
					causeElement.className = 'item';
					causeElement.innerHTML = `
						<div class="cause-entry">
							<a href="cause-single.html?id=${
								cause._id
							}" class="img" style="background-image: url(${imageUrl});"></a>
							<div class="text p-3 p-md-4">
								<h3><a href="cause-single.html?id=${cause._id}">${cause.title}</a></h3>
								<p>${cause.description.substring(0, 100)}${
						cause.description.length > 100 ? '...' : ''
					}</p>
								<span class="donation-time mb-3 d-block">Last donation ${formatTimeAgo(
									cause.updatedAt
								)}</span>
								<div class="progress custom-progress-success">
									<div class="progress-bar bg-primary" role="progressbar" style="width: ${calculateProgress(
										cause
									)}%" 
										 aria-valuenow="${calculateProgress(
												cause
											)}" aria-valuemin="0" aria-valuemax="100"></div>
								</div>
								<span class="fund-raised d-block">$${cause.raisedAmount.toLocaleString()} raised of $${cause.targetAmount.toLocaleString()}</span>
							</div>
						</div>
					`;
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
					// Construct the image URL properly
					let imageUrl;
					if (blog.image) {
						if (blog.image.startsWith('http')) {
							imageUrl = blog.image;
						} else if (blog.image.includes('/uploads/')) {
							imageUrl = `${API_BASE_URL}${blog.image}`;
						} else {
							imageUrl = `${API_BASE_URL}/uploads/blog/${blog.image}`;
						}
					} else {
						imageUrl = 'images/blog-default.jpg';
					}

					const blogElement = document.createElement('div');
					blogElement.className = 'item';
					blogElement.innerHTML = `
						<div class="blog-entry align-self-stretch">
							<a href="blog-single.html?id=${
								blog._id
							}" class="block-20" style="background-image: url('${imageUrl}');"></a>
							<div class="text p-4 d-block">
								<div class="meta mb-3">
									<div><a href="#">${new Date(blog.createdAt).toLocaleDateString()}</a></div>
									<div><a href="#">${blog.author || 'Admin'}</a></div>
									<div><a href="#" class="meta-chat"><span class="icon-chat"></span> ${
										blog.comments?.length || 0
									}</a></div>
								</div>
								<h3 class="heading mt-3"><a href="blog-single.html?id=${blog._id}">${
						blog.title
					}</a></h3>
								<p>${
									blog.content
										? blog.content.substring(0, 150) +
										  (blog.content.length > 150 ? '...' : '')
										: ''
								}</p>
							</div>
						</div>
					`;
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
					// Construct the image URL properly
					let imageUrl;
					if (member.image) {
						if (member.image.startsWith('http')) {
							imageUrl = member.image;
						} else if (member.image.includes('/uploads/')) {
							imageUrl = `${API_BASE_URL}${member.image}`;
						} else {
							imageUrl = `${API_BASE_URL}/uploads/team/${member.image}`;
						}
					} else {
						imageUrl = 'images/team-default.jpg';
					}

					const memberElement = document.createElement('div');
					memberElement.className = 'item';
					memberElement.innerHTML = `
						<div class="staff">
							<div class="img-wrap d-flex align-items-stretch">
								<div class="img align-self-stretch" style="background-image: url(${imageUrl});"></div>
							</div>
							<div class="text pt-3 text-center">
								<h3>${member.name}</h3>
								<span class="position mb-2">${member.position}</span>
								<div class="faded">
									<p>${member.bio || ''}</p>
									<ul class="ftco-social text-center">
										${
											member.socialLinks
												? `
											${
												member.socialLinks.facebook
													? `<li class="ftco-animate"><a href="${member.socialLinks.facebook}"><span class="icon-facebook"></span></a></li>`
													: ''
											}
											${
												member.socialLinks.twitter
													? `<li class="ftco-animate"><a href="${member.socialLinks.twitter}"><span class="icon-twitter"></span></a></li>`
													: ''
											}
											${
												member.socialLinks.instagram
													? `<li class="ftco-animate"><a href="${member.socialLinks.instagram}"><span class="icon-instagram"></span></a></li>`
													: ''
											}
											${
												member.socialLinks.linkedin
													? `<li class="ftco-animate"><a href="${member.socialLinks.linkedin}"><span class="icon-linkedin"></span></a></li>`
													: ''
											}
										`
												: ''
										}
									</ul>
								</div>
							</div>
						</div>
					`;
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
					} else {
						imageUrl = 'images/gallery-default.jpg';
					}

					const imageElement = document.createElement('div');
					imageElement.className = 'item';
					imageElement.innerHTML = `
						<a href="${imageUrl}" class="gallery image-popup img d-flex align-items-center" style="background-image: url(${imageUrl});">
							<div class="icon mb-4 d-flex align-items-center justify-content-center">
								<span class="icon-instagram"></span>
							</div>
						</a>
					`;
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
					// Construct the image URL properly
					let imageUrl;
					if (event.image) {
						if (event.image.startsWith('http')) {
							imageUrl = event.image;
						} else if (event.image.includes('/uploads/')) {
							imageUrl = `${API_BASE_URL}${event.image}`;
						} else {
							imageUrl = `${API_BASE_URL}/uploads/events/${event.image}`;
						}
					} else {
						imageUrl = 'images/event-default.jpg';
					}

					const eventElement = document.createElement('div');
					eventElement.className = 'item';
					eventElement.innerHTML = `
						<div class="event-entry">
							<a href="event-single.html?id=${
								event._id
							}" class="img" style="background-image: url(${imageUrl});"></a>
							<div class="text p-4 p-md-5">
								<div class="meta">
									<div><a href="#">${new Date(event.date).toLocaleDateString()}</a></div>
									<div><a href="#">${event.time || 'TBA'}</a></div>
									<div><a href="#">${event.location || 'TBA'}</a></div>
								</div>
								<h3 class="mb-3"><a href="event-single.html?id=${event._id}">${
						event.title
					}</a></h3>
								<p>${
									event.description
										? event.description.substring(0, 100) +
										  (event.description.length > 100 ? '...' : '')
										: ''
								}</p>
								<p><a href="event-single.html?id=${
									event._id
								}" class="btn btn-primary">Read More</a></p>
							</div>
						</div>
					`;
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

// Helper function to calculate progress percentage
function calculateProgress(cause) {
	const raised = cause.raisedAmount || 0;
	const target = cause.targetAmount || 1;
	return Math.min(100, Math.round((raised / target) * 100));
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
