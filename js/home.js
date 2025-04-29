// Access the API objects from the window.API namespace safely
let causeAPI,
	blogAPI,
	teamAPI,
	galleryAPI,
	eventAPI,
	volunteerAPI,
	donationAPI,
	ENDPOINTS,
	fetchFromApi,
	API_BASE_URL;

// Wait for API to be available with timeout and retry
function waitForAPI(maxAttempts = 10, interval = 500) {
	let attempts = 0;

	return new Promise((resolve, reject) => {
		function checkAPI() {
			console.log(
				`Checking for API availability (attempt ${
					attempts + 1
				}/${maxAttempts})...`
			);

			if (window.API) {
				console.log('API found:', Object.keys(window.API));
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
		causeAPI = api.causeAPI;
		blogAPI = api.blogAPI;
		teamAPI = api.teamAPI;
		galleryAPI = api.galleryAPI;
		eventAPI = api.eventAPI;
		volunteerAPI = api.volunteerAPI;
		donationAPI = api.donationAPI;
		ENDPOINTS = api.ENDPOINTS;
		fetchFromApi = api.fetchFromApi;
		API_BASE_URL = api.BASE_URL;

		console.log('API references set up successfully');
		return true;
	} catch (error) {
		console.error('Error setting up API references:', error);
		return false;
	}
}

document.addEventListener('DOMContentLoaded', async function () {
	console.log('DOMContentLoaded event fired in home.js');

	try {
		// Wait for the API to be available
		const api = await waitForAPI();

		// Set up API references
		if (setupAPIReferences(api)) {
			console.log('API references available, initializing home page');
			initializeHomePage();
		} else {
			console.error('Failed to set up API references');
			showErrorMessage(
				'causes-section',
				'API initialization failed. Please refresh the page.'
			);
		}
	} catch (error) {
		console.error('Error waiting for API:', error.message);
		showErrorMessage(
			'causes-section',
			'API connection failed. Please refresh the page.'
		);
	}
});

async function initializeHomePage() {
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
}

// Initialize carousel
function initializeCarousel(selector) {
	console.log(`Initializing carousel for ${selector}`);
	$(selector).owlCarousel({
		autoplay: true,
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
	});
}

// Create carousel container
function createCarouselContainer(sectionId, title) {
	const section = document.getElementById(sectionId);
	if (!section) {
		console.error(`Section with ID ${sectionId} not found`);
		return null;
	}

	// Instead of recreating the entire structure, find the existing carousel container
	const existingCarousel = section.querySelector(
		`.carousel-${sectionId.split('-')[0]}`
	);

	if (existingCarousel) {
		console.log(`Found existing carousel for ${sectionId}:`, existingCarousel);
		// Clear existing items but keep the carousel structure
		existingCarousel.innerHTML = '';
		return existingCarousel;
	} else {
		console.error(`Carousel container not found in section ${sectionId}`);

		// If no existing carousel found (fallback), create one
		console.log(`Creating new carousel container for ${sectionId}`);
		const container = document.createElement('div');
		container.className = 'container';
		container.innerHTML = `
			<div class="row justify-content-center mb-5 pb-3">
				<div class="col-md-7 heading-section text-center">
					<h2 class="mb-4">${title}</h2>
				</div>
			</div>
			<div class="row">
				<div class="col-md-12">
					<div class="carousel-${sectionId.split('-')[0]} owl-carousel"></div>
				</div>
			</div>
		`;

		// Clear existing content and append new container
		section.innerHTML = '';
		section.appendChild(container);

		return section.querySelector(`.carousel-${sectionId.split('-')[0]}`);
	}
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
		console.log('Loading causes...');
		console.log('ENDPOINTS.CAUSES:', ENDPOINTS.CAUSES);

		if (!window.API) {
			console.error('window.API is not defined');
			return;
		}

		console.log('window.API available:', Object.keys(window.API));

		// Try different approaches to fetch causes
		let response;
		let causes = [];

		try {
			console.log('Trying fetchFromApi...');
			response = await fetchFromApi(ENDPOINTS.CAUSES);
			console.log('fetchFromApi response:', response);
			causes = getDataFromResponse(response);
		} catch (fetchError) {
			console.error('Error using fetchFromApi:', fetchError);

			try {
				console.log('Trying direct fetch...');
				const directResponse = await fetch(ENDPOINTS.CAUSES);
				const data = await directResponse.json();
				console.log('Direct fetch response:', data);
				causes = getDataFromResponse(data);
			} catch (directFetchError) {
				console.error('Error with direct fetch:', directFetchError);

				try {
					console.log('Trying causeAPI.getAll()...');
					const apiResponse = await causeAPI.getAll();
					console.log('causeAPI.getAll() response:', apiResponse);
					causes = getDataFromResponse(apiResponse);
				} catch (apiError) {
					console.error('Error with causeAPI.getAll():', apiError);
					throw new Error('All methods to fetch causes failed');
				}
			}
		}

		console.log('Number of causes loaded:', causes.length);

		// Get the existing carousel container element directly
		const causesContainer = document.querySelector(
			'#causes-section .carousel-cause'
		);
		console.log('Direct selector for causes container:', causesContainer);

		if (!causesContainer) {
			console.error('Could not find causes carousel container');
			return;
		}

		// Clear existing content
		causesContainer.innerHTML = '';

		if (causes.length > 0) {
			causes.forEach((cause, index) => {
				console.log(
					`Adding cause ${index + 1}/${causes.length} to DOM:`,
					cause.title
				);
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
				causesContainer.appendChild(causeElement);
				console.log(`Cause ${index + 1} appended to container`);
			});

			console.log('All causes added to container, initializing carousel');
			initializeCarousel('.carousel-cause');
			console.log('Carousel initialized for causes');
		} else {
			console.warn('No causes data available');
			showErrorMessage('causes-section', 'No causes available at this time.');
		}
	} catch (error) {
		console.error('Failed to load causes:', error);
		showErrorMessage('causes-section', 'Unable to load causes at this time.');
	}
}

// Load latest blogs
async function loadLatestBlogs() {
	try {
		console.log('Loading blogs...');
		const response = await fetchFromApi(ENDPOINTS.BLOGS);
		console.log('Blogs response:', response);

		const blogs = getDataFromResponse(response);
		console.log('Number of blogs loaded:', blogs.length);

		// Get the existing carousel container element directly
		const blogContainer = document.querySelector(
			'#blog-section .carousel-blog'
		);
		console.log('Direct selector for blog container:', blogContainer);

		if (!blogContainer) {
			console.error('Could not find blog carousel container');
			return;
		}

		// Clear existing content
		blogContainer.innerHTML = '';

		if (blogs.length > 0) {
			blogs.forEach((blog, index) => {
				console.log(
					`Adding blog ${index + 1}/${blogs.length} to DOM:`,
					blog.title
				);
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
				blogContainer.appendChild(blogElement);
				console.log(`Blog ${index + 1} appended to container`);
			});

			console.log('All blogs added to container, initializing carousel');
			initializeCarousel('.carousel-blog');
			console.log('Carousel initialized for blogs');
		} else {
			console.warn('No blogs data available');
			showErrorMessage('blog-section', 'No blog posts available at this time.');
		}
	} catch (error) {
		console.error('Failed to load blogs:', error);
		showErrorMessage('blog-section', 'Unable to load blog posts at this time.');
	}
}

// Load team members
async function loadTeamMembers() {
	try {
		console.log('Loading team members...');
		const response = await fetchFromApi(ENDPOINTS.TEAM);
		console.log('Team response:', response);

		const teamMembers = getDataFromResponse(response);
		console.log('Number of team members loaded:', teamMembers.length);

		// Get the existing carousel container element directly
		const teamContainer = document.querySelector(
			'#team-section .carousel-team'
		);
		console.log('Direct selector for team container:', teamContainer);

		if (!teamContainer) {
			console.error('Could not find team carousel container');
			return;
		}

		// Clear existing content
		teamContainer.innerHTML = '';

		if (teamMembers.length > 0) {
			teamMembers.forEach((member, index) => {
				console.log(
					`Adding team member ${index + 1}/${teamMembers.length} to DOM:`,
					member.name
				);
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
				`;
				teamContainer.appendChild(memberElement);
				console.log(`Team member ${index + 1} appended to container`);
			});

			console.log('All team members added to container, initializing carousel');
			initializeCarousel('.carousel-team');
			console.log('Carousel initialized for team');
		} else {
			console.warn('No team members data available');
			showErrorMessage(
				'team-section',
				'No team members available at this time.'
			);
		}
	} catch (error) {
		console.error('Failed to load team members:', error);
		showErrorMessage(
			'team-section',
			'Unable to load team members at this time.'
		);
	}
}

// Load gallery images
async function loadGalleryImages() {
	try {
		console.log('Loading gallery images...');
		const response = await fetchFromApi(ENDPOINTS.GALLERY);
		console.log('Gallery response:', response);

		const galleryImages = getDataFromResponse(response);
		console.log('Number of gallery images loaded:', galleryImages.length);

		// Get the existing carousel container element directly
		const galleryContainer = document.querySelector(
			'#gallery-section .carousel-gallery'
		);
		console.log('Direct selector for gallery container:', galleryContainer);

		if (!galleryContainer) {
			console.error('Could not find gallery carousel container');
			return;
		}

		// Clear existing content
		galleryContainer.innerHTML = '';

		if (galleryImages.length > 0) {
			galleryImages.forEach((image, index) => {
				console.log(
					`Adding gallery image ${index + 1}/${galleryImages.length} to DOM`
				);
				const imageElement = document.createElement('div');
				imageElement.className = 'item';
				imageElement.innerHTML = `
					<a href="${getImageUrl(
						image.url,
						'gallery'
					)}" class="gallery image-popup img d-flex align-items-center" style="background-image: url(${getImageUrl(
					image.url,
					'gallery'
				)});">
						<div class="icon mb-4 d-flex align-items-center justify-content-center">
							<span class="icon-instagram"></span>
						</div>
					</a>
				`;
				galleryContainer.appendChild(imageElement);
				console.log(`Gallery image ${index + 1} appended to container`);
			});

			console.log(
				'All gallery images added to container, initializing carousel'
			);
			initializeCarousel('.carousel-gallery');
			console.log('Carousel initialized for gallery');

			// Initialize the lightbox for gallery images
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
		} else {
			console.warn('No gallery images data available');
			showErrorMessage(
				'gallery-section',
				'No gallery images available at this time.'
			);
		}
	} catch (error) {
		console.error('Failed to load gallery images:', error);
		showErrorMessage(
			'gallery-section',
			'Unable to load gallery images at this time.'
		);
	}
}

// Load latest events
async function loadLatestEvents() {
	try {
		console.log('Loading events...');
		const response = await fetchFromApi(ENDPOINTS.EVENTS);
		console.log('Events response:', response);

		const events = getDataFromResponse(response);
		console.log('Number of events loaded:', events.length);

		// Get the existing carousel container element directly
		const eventsContainer = document.querySelector(
			'#events-section .carousel-events'
		);
		console.log('Direct selector for events container:', eventsContainer);

		if (!eventsContainer) {
			console.error('Could not find events carousel container');
			return;
		}

		// Clear existing content
		eventsContainer.innerHTML = '';

		if (events.length > 0) {
			events.forEach((event, index) => {
				console.log(
					`Adding event ${index + 1}/${events.length} to DOM:`,
					event.title
				);
				const eventElement = document.createElement('div');
				eventElement.className = 'item';
				eventElement.innerHTML = `
					<div class="event-entry">
						<a href="event-single.html?id=${
							event._id
						}" class="img" style="background-image: url(${getImageUrl(
					event.image,
					'events'
				)});"></a>
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
				console.log(`Event ${index + 1} appended to container`);
			});

			console.log('All events added to container, initializing carousel');
			initializeCarousel('.carousel-events');
			console.log('Carousel initialized for events');
		} else {
			console.warn('No events data available');
			showErrorMessage('events-section', 'No events available at this time.');
		}
	} catch (error) {
		console.error('Failed to load events:', error);
		showErrorMessage('events-section', 'Unable to load events at this time.');
	}
}

function setupVolunteerForm() {
	const form = document.getElementById('volunteer-form');
	if (!form) {
		// Try to find the form with ID 'volunteer' instead
		const altForm = document.getElementById('volunteer');
		if (altForm) {
			console.log('Found volunteer form with ID "volunteer"');
			setupFormSubmission(altForm);
		} else {
			console.error(
				'Volunteer form not found with ID "volunteer-form" or "volunteer"'
			);
		}
	} else {
		console.log('Found volunteer form with ID "volunteer-form"');
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

						console.log('Submitting volunteer data:', volunteerData);
						await volunteerAPI.register(volunteerData);
						showAlert(
							'Thank you for your interest in volunteering! We will contact you soon.',
							'success',
							formElement
						);
						formElement.reset();
					} catch (error) {
						console.error('Error submitting volunteer form:', error);
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

					console.log('Submitting volunteer data:', volunteerData);
					await volunteerAPI.register(volunteerData);
					showAlert(
						'Thank you for your interest in volunteering! We will contact you soon.',
						'success',
						formElement
					);
					formElement.reset();
				} catch (error) {
					console.error('Error submitting volunteer form:', error);
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
		console.error('Donation form not found with ID "donation-form"');
		return;
	}

	console.log('Found donation form with ID "donation-form"');
	form.addEventListener('submit', async (e) => {
		e.preventDefault();

		const submitButton = form.querySelector('button[type="submit"]');
		if (!submitButton) {
			console.error('Submit button not found in donation form');
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

			console.log('Submitting donation data:', donationData);
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

// Helper function to get image URL
function getImageUrl(image, type) {
	if (!image) return `images/${type}-default.jpg`;

	if (image.startsWith('http')) {
		return image;
	} else if (image.includes('/uploads/')) {
		return `${API_BASE_URL}${image}`;
	} else {
		return `${API_BASE_URL}/uploads/${type}/${image}`;
	}
}
