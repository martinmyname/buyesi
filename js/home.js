// Remove duplicate declarations to prevent SyntaxError
// Variables are already defined in api.js and accessible via window.API

// Wait for API to be available with timeout and retry
function waitForAPI(maxAttempts = 5, interval = 300) {
	let attempts = 0;

	return new Promise((resolve, reject) => {
		function checkAPI() {
			if (window.API) {
				resolve(window.API);
				return;
			}

			attempts++;
			if (attempts >= maxAttempts) {
				reject(new Error('API not available after maximum attempts'));
				return;
			}

			setTimeout(checkAPI, interval);
		}

		checkAPI();
	});
}

// Setup API references when they become available
function setupAPIReferences(api) {
	if (!api) return false;

	try {
		return true;
	} catch (error) {
		return false;
	}
}

document.addEventListener('DOMContentLoaded', async function () {
	try {
		// Wait for the API to be available
		const api = await waitForAPI();

		// Set up API references
		if (setupAPIReferences(api)) {
			initializeHomePage();
		} else {
			showErrorMessage(
				'causes-section',
				'API initialization failed. Please refresh the page.'
			);
		}
	} catch (error) {
		showErrorMessage(
			'causes-section',
			'API connection failed. Please refresh the page.'
		);
	}
});

async function initializeHomePage() {
	try {
		// Load all sections in parallel for faster loading
		await Promise.all([
			loadLatestCauses(),
			loadTeamMembers(),
			loadGalleryImages(),
			loadLatestBlogs(),
			loadLatestEvents(),
		]);

		// Handle forms
		setupVolunteerForm();
		setupDonationForm();
	} catch (error) {
		// Silent error handling to avoid console logs
	}
}

// Initialize carousel without animations
function initializeCarousel(selector) {
	$(selector).owlCarousel({
		autoplay: false,
		center: true,
		loop: true,
		items: 1,
		margin: 30,
		stagePadding: 0,
		nav: true,
		navText: [
			'<span class="ion-ios-arrow-back">',
			'<span class="ion-ios-arrow-forward">',
		],
		responsive: {
			0: {
				items: 1,
				stagePadding: 0,
			},
			600: {
				items: 2,
				stagePadding: 50,
			},
			1000: {
				items: 3,
				stagePadding: 100,
			},
		},
		animateOut: false,
		animateIn: false,
		smartSpeed: 0,
		mouseDrag: true,
		touchDrag: true,
	});
}

// Get data from response
function getDataFromResponse(response) {
	if (Array.isArray(response)) {
		return response;
	}
	return response?.data || [];
}

// Load latest causes
async function loadLatestCauses() {
	try {
		let response;
		let causes = [];

		try {
			response = await window.API.fetchFromApi(window.API.ENDPOINTS.CAUSES);
			causes = getDataFromResponse(response);
		} catch (fetchError) {
			try {
				const directResponse = await fetch(window.API.ENDPOINTS.CAUSES);
				const data = await directResponse.json();
				causes = getDataFromResponse(data);
			} catch (directFetchError) {
				try {
					const apiResponse = await window.API.causeAPI.getAll();
					causes = getDataFromResponse(apiResponse);
				} catch (apiError) {
					throw new Error('All methods to fetch causes failed');
				}
			}
		}

		// Get the existing carousel container element directly
		const causesContainer = document.querySelector(
			'#home-causes-wrapper .home-causes-carousel'
		);

		if (!causesContainer) {
			return;
		}

		// Clear existing content
		causesContainer.innerHTML = '';

		if (causes.length > 0) {
			const fragment = document.createDocumentFragment();
			causes.forEach((cause) => {
				const causeElement = document.createElement('div');
				causeElement.className = 'item';
				causeElement.innerHTML = `
					<div class="cause-entry">
						<a href="cause-single.html?id=${
							cause._id
						}" class="img" style="background-image: url(${getImageUrl(
					cause.image,
					'causes'
				)});"></a>
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
							<span class="fund-raised d-block">$${
								cause.raisedAmount?.toLocaleString() || 0
							} raised of $${cause.targetAmount?.toLocaleString() || 0}</span>
						</div>
					</div>
				`;
				fragment.appendChild(causeElement);
			});
			causesContainer.appendChild(fragment);
			initializeCarousel('.home-causes-carousel');
		} else {
			showErrorMessage('causes-section', 'No causes available at this time.');
		}
	} catch (error) {
		showErrorMessage('causes-section', 'Unable to load causes at this time.');
	}
}

// Load latest blogs
async function loadLatestBlogs() {
	try {
		const response = await window.API.fetchFromApi(window.API.ENDPOINTS.BLOGS);
		const blogs = getDataFromResponse(response);

		// Get the existing carousel container element directly
		const blogContainer = document.querySelector(
			'#blog-section .carousel-blog'
		);

		if (!blogContainer) {
			return;
		}

		// Clear existing content
		blogContainer.innerHTML = '';

		if (blogs.length > 0) {
			const fragment = document.createDocumentFragment();
			blogs.forEach((blog) => {
				const blogElement = document.createElement('div');
				blogElement.className = 'item';
				blogElement.innerHTML = `
					<div class="blog-entry align-self-stretch">
						<a href="blog-single.html?id=${
							blog._id
						}" class="block-20" style="background-image: url('${getImageUrl(
					blog.image,
					'blog'
				)}');"></a>
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
				fragment.appendChild(blogElement);
			});
			blogContainer.appendChild(fragment);
			initializeCarousel('.carousel-blog');
		} else {
			showErrorMessage('blog-section', 'No blog posts available at this time.');
		}
	} catch (error) {
		showErrorMessage('blog-section', 'Unable to load blog posts at this time.');
	}
}

// Load team members
async function loadTeamMembers() {
	try {
		const response = await window.API.fetchFromApi(window.API.ENDPOINTS.TEAM);
		const teamMembers = getDataFromResponse(response);

		// Get the existing carousel container element directly
		const teamContainer = document.querySelector(
			'#team-section .carousel-team'
		);

		if (!teamContainer) {
			return;
		}

		// Clear existing content
		teamContainer.innerHTML = '';

		if (teamMembers.length > 0) {
			const fragment = document.createDocumentFragment();
			teamMembers.forEach((member) => {
				const memberElement = document.createElement('div');
				memberElement.className = 'item';
				memberElement.innerHTML = `
					<div class="staff">
						<div class="img-wrap d-flex align-items-stretch">
							<div class="img align-self-stretch" style="background-image: url(${getImageUrl(
								member.image,
								'team'
							)});"></div>
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
												? `<li><a href="${member.socialLinks.facebook}"><span class="icon-facebook"></span></a></li>`
												: ''
										}
										${
											member.socialLinks.twitter
												? `<li><a href="${member.socialLinks.twitter}"><span class="icon-twitter"></span></a></li>`
												: ''
										}
										${
											member.socialLinks.instagram
												? `<li><a href="${member.socialLinks.instagram}"><span class="icon-instagram"></span></a></li>`
												: ''
										}
										${
											member.socialLinks.linkedin
												? `<li><a href="${member.socialLinks.linkedin}"><span class="icon-linkedin"></span></a></li>`
												: ''
										}
									`
											: ''
									}
								</ul>
						</div>
					</div>
				`;
				fragment.appendChild(memberElement);
			});
			teamContainer.appendChild(fragment);
			initializeCarousel('.carousel-team');
		} else {
			showErrorMessage(
				'team-section',
				'No team members available at this time.'
			);
		}
	} catch (error) {
		showErrorMessage(
			'team-section',
			'Unable to load team members at this time.'
		);
	}
}

// Load gallery images
async function loadGalleryImages() {
	try {
		const response = await window.API.fetchFromApi(
			window.API.ENDPOINTS.GALLERY
		);
		const galleryImages = getDataFromResponse(response);

		// Get the existing carousel container element directly
		const galleryContainer = document.querySelector(
			'#gallery-section .carousel-gallery'
		);

		if (!galleryContainer) {
			return;
		}

		// Clear existing content
		galleryContainer.innerHTML = '';

		if (galleryImages.length > 0) {
			const fragment = document.createDocumentFragment();
			galleryImages.forEach((image) => {
				const imageUrl = image.image || getImageUrl(image.url, 'gallery');
				const imageElement = document.createElement('div');
				imageElement.className = 'item';
				imageElement.innerHTML = `
					<a href="${imageUrl}" class="gallery image-popup img d-flex align-items-center" style="background-image: url(${imageUrl}); height: 300px; background-size: cover; background-position: center;">
						<div class="icon mb-4 d-flex align-items-center justify-content-center">
							<span class="icon-instagram"></span>
						</div>
					</a>
				`;
				fragment.appendChild(imageElement);
			});
			galleryContainer.appendChild(fragment);

			// Updated carousel settings for better responsiveness
			initializeGalleryCarousel('.carousel-gallery');

			// Initialize the lightbox for gallery images - with reduced animation
			$('.image-popup').magnificPopup({
				type: 'image',
				closeOnContentClick: true,
				closeBtnInside: false,
				fixedContentPos: true,
				mainClass: 'mfp-no-margins',
				image: {
					verticalFit: true,
				},
				zoom: {
					enabled: false,
				},
			});
		} else {
			showErrorMessage(
				'gallery-section',
				'No gallery images available at this time.'
			);
		}
	} catch (error) {
		showErrorMessage(
			'gallery-section',
			'Unable to load gallery images at this time.'
		);
	}
}

// Custom carousel settings for gallery to improve mobile and web display
function initializeGalleryCarousel(selector) {
	$(selector).owlCarousel({
		autoplay: false,
		center: false,
		loop: true,
		items: 1,
		margin: 10,
		stagePadding: 10,
		nav: true,
		navText: [
			'<span class="ion-ios-arrow-back">',
			'<span class="ion-ios-arrow-forward">',
		],
		responsive: {
			0: {
				items: 1,
				stagePadding: 0,
				margin: 5,
			},
			600: {
				items: 2,
				stagePadding: 20,
				margin: 10,
			},
			1000: {
				items: 3,
				stagePadding: 30,
				margin: 15,
			},
			1400: {
				items: 4,
				stagePadding: 40,
				margin: 20,
			},
		},
		animateOut: false,
		animateIn: false,
		smartSpeed: 0,
		mouseDrag: true,
		touchDrag: true,
	});
}

// Load latest events
async function loadLatestEvents() {
	try {
		const response = await window.API.fetchFromApi(window.API.ENDPOINTS.EVENTS);
		const events = getDataFromResponse(response);

		// Get the existing carousel container element directly
		const eventsContainer = document.querySelector(
			'#events-section .carousel-events'
		);

		if (!eventsContainer) {
			return;
		}

		// Clear existing content
		eventsContainer.innerHTML = '';

		if (events.length > 0) {
			const fragment = document.createDocumentFragment();
			events.forEach((event) => {
				// Construct the image URL properly
				let eventImageUrl;

				// Handle various image formats
				if (event.image) {
					// If it's a full URL (including Cloudinary)
					if (event.image.startsWith('http')) {
						eventImageUrl = event.image;
					}
					// If it includes a path from the API
					else if (event.image.includes('/uploads/')) {
						eventImageUrl = `${window.API_BASE_URL}${event.image}`;
					}
					// If it's just a filename
					else {
						eventImageUrl = `${window.API_BASE_URL}/uploads/events/${event.image}`;
					}
				}
				// For Cloudinary or other image hosting service
				else if (event.imageUrl) {
					eventImageUrl = event.imageUrl;
				}
				// Default image as fallback
				else {
					eventImageUrl = 'images/event-default.jpg';
				}

				// Create the event element
				const eventElement = document.createElement('div');
				eventElement.className = 'item';
				eventElement.innerHTML = `
					<div class="event-entry">
						<a href="event-single.html?id=${
							event._id
						}" class="img" style="background-image: url(${eventImageUrl});"></a>
						<div class="text p-4 p-md-5">
							<div class="meta">
								<div><a href="#">${formatDate(event.startDate)}</a></div>
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
				fragment.appendChild(eventElement);
			});

			eventsContainer.appendChild(fragment);

			// Initialize carousel with specific settings for events section
			initializeCarousel('.carousel-events');
		} else {
			showErrorMessage('events-section', 'No events available at this time.');
		}
	} catch (error) {
		console.error('Error loading latest events:', error);
	}
}

function setupVolunteerForm() {
	const form = document.getElementById('volunteer-form');
	if (!form) {
		// Try to find the form with ID 'volunteer' instead
		const altForm = document.getElementById('volunteer');
		if (altForm) {
			setupFormSubmission(altForm);
		}
	} else {
		setupFormSubmission(form);
	}

	function setupFormSubmission(formElement) {
		formElement.addEventListener('submit', async (e) => {
			e.preventDefault();

			const submitButton = formElement.querySelector('button[type="submit"]');
			if (!submitButton) {
				const inputSubmit = formElement.querySelector('input[type="submit"]');
				if (inputSubmit) {
					const originalButtonText = inputSubmit.value;
					inputSubmit.disabled = true;
					inputSubmit.value = 'Submitting...';

					try {
						const formData = new FormData(formElement);
						const volunteerData = {
							name:
								formData.get('name') ||
								formElement.querySelector('input[placeholder="Your Name"]')
									.value,
							email:
								formData.get('email') ||
								formElement.querySelector('input[placeholder="Your Email"]')
									.value,
							phone: formData.get('phone') || '',
							message:
								formData.get('message') ||
								formElement.querySelector('textarea').value,
						};

						await window.API.volunteerAPI.register(volunteerData);
						showAlert(
							'Thank you for your interest in volunteering! We will contact you soon.',
							'success',
							formElement
						);
						formElement.reset();
					} catch (error) {
						showAlert(
							error.message ||
								'Failed to submit volunteer form. Please try again.',
							'danger',
							formElement
						);
					} finally {
						inputSubmit.disabled = false;
						inputSubmit.value = originalButtonText;
					}
				}
			} else {
				const originalButtonText = submitButton.innerHTML;
				submitButton.disabled = true;
				submitButton.innerHTML =
					'<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...';

				try {
					const formData = new FormData(formElement);
					const volunteerData = {
						name: formData.get('name'),
						email: formData.get('email'),
						phone: formData.get('phone') || '',
						message: formData.get('message'),
					};

					await window.API.volunteerAPI.register(volunteerData);
					showAlert(
						'Thank you for your interest in volunteering! We will contact you soon.',
						'success',
						formElement
					);
					formElement.reset();
				} catch (error) {
					showAlert(
						error.message ||
							'Failed to submit volunteer form. Please try again.',
						'danger',
						formElement
					);
				} finally {
					submitButton.disabled = false;
					submitButton.innerHTML = originalButtonText;
				}
			}
		});
	}
}

function setupDonationForm() {
	const form = document.getElementById('donation-form');
	if (!form) {
		return;
	}

	form.addEventListener('submit', async (e) => {
		e.preventDefault();

		const submitButton = form.querySelector('button[type="submit"]');
		if (!submitButton) {
			return;
		}

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
				message: formData.get('message') || '',
			};

			await window.API.donationAPI.create(donationData);
			showAlert(
				'Thank you for your donation! We appreciate your support.',
				'success',
				form
			);
			form.reset();
		} catch (error) {
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

// Format time ago utility
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

// Helper function to calculate progress percentage
function calculateProgress(cause) {
	const raised = cause.raisedAmount || 0;
	const target = cause.targetAmount || 1;
	return Math.min(100, Math.round((raised / target) * 100));
}

// Helper function to format dates
function formatDate(dateString) {
	if (!dateString) return 'TBA';

	const date = new Date(dateString);
	if (isNaN(date.getTime())) return 'TBA';

	const options = {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	};
	return date.toLocaleDateString('en-US', options);
}

// Helper function to get image URL
function getImageUrl(image, type) {
	if (!image) return `images/${type}-default.jpg`;

	// Direct URL (including Cloudinary URLs)
	if (image.startsWith('http')) {
		return image;
	}
	// Path from backend API
	else if (image.includes('/uploads/')) {
		return `${window.API_BASE_URL}${image}`;
	}
	// Just a filename
	else {
		return `${window.API_BASE_URL}/uploads/${type}/${image}`;
	}
}
