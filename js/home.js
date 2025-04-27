// Import API modules
import {
	causeAPI,
	blogAPI,
	teamAPI,
	galleryAPI,
	eventAPI,
	volunteerAPI,
	donationAPI,
} from './api.js';

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
		// Target the specific container for the carousel using the unique ID
		const causesContainer = document.querySelector(
			'#causes-carousel-container'
		);

		if (!causesContainer) {
			console.error('Causes container not found');
			return;
		}

		// Add loading state
		causesContainer.innerHTML =
			'<div class="col-12 text-center"><div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div></div>';

		// Fetch causes from the API
		console.log('Fetching causes...');
		const response = await causeAPI.getAll();
		console.log('API Response:', response);

		// Handle both array response and object with data property
		const causes = Array.isArray(response) ? response : response.data || [];
		console.log('Processed causes:', causes);

		if (!causes || !causes.length) {
			causesContainer.innerHTML =
				'<div class="col-12 text-center"><p>No causes found.</p></div>';
			return;
		}

		// Take only the 3 most recent causes
		const latestCauses = causes.slice(0, 3);

		// Clear any existing content
		causesContainer.innerHTML = '';

		// Create a container for the carousel
		const causesCarouselContainer = document.createElement('div');
		causesCarouselContainer.className = 'col-md-12 ftco-animate';

		// Create carousel element
		const causesCarousel = document.createElement('div');
		causesCarousel.className = 'carousel-cause owl-carousel';
		causesCarouselContainer.appendChild(causesCarousel);

		// Append the carousel container to the section
		causesContainer.appendChild(causesCarouselContainer);

		// Render each cause
		latestCauses.forEach((cause) => {
			// Calculate progress percentage
			const raisedAmount =
				typeof cause.raisedAmount === 'number' ? cause.raisedAmount : 0;
			const targetAmount =
				typeof cause.targetAmount === 'number' ? cause.targetAmount : 1;
			const progressPercentage =
				Math.min(100, Math.round((raisedAmount / targetAmount) * 100)) || 0;

			// Construct the image URL properly
			let imageUrl;
			if (cause.image) {
				if (cause.image.startsWith('http')) {
					imageUrl = cause.image;
				} else if (cause.image.includes('/uploads/')) {
					imageUrl = `${API_BASE_URL}${cause.image}`;
				} else {
					imageUrl = `${API_BASE_URL}/uploads/general/${cause.image}`;
				}
				console.log('Image URL for', cause.title, ':', imageUrl);
			} else {
				imageUrl = 'images/cause-default.jpg';
			}

			const causeHTML = `
				<div class="item">
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
								<div class="progress-bar bg-primary" role="progressbar" style="width: ${progressPercentage}%" 
									 aria-valuenow="${progressPercentage}" aria-valuemin="0" aria-valuemax="100"></div>
							</div>
							<span class="fund-raised d-block">$${raisedAmount.toLocaleString()} raised of $${targetAmount.toLocaleString()}</span>
						</div>
					</div>
				</div>
			`;

			causesCarousel.innerHTML += causeHTML;
		});

		// Reinitialize the owl carousel
		$('.carousel-cause').owlCarousel({
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
	} catch (error) {
		console.error('Failed to load causes for homepage:', error);
	}
}

async function loadLatestBlogs() {
	try {
		// Update selector to match the blog section using the unique ID
		const blogsSection = document.querySelector('#blog-section .row.d-flex');

		if (!blogsSection) {
			console.error('Blog section not found');
			return;
		}

		// Add loading state
		blogsSection.innerHTML =
			'<div class="col-12 text-center"><div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div></div>';

		// Fetch blogs from the API
		console.log('Fetching blogs...');
		const response = await blogAPI.getAll();
		console.log('API Response:', response);

		// Handle both array response and object with data property
		const blogs = Array.isArray(response) ? response : response.data || [];
		console.log('Processed blogs:', blogs);

		if (!blogs || !blogs.length) {
			blogsSection.innerHTML =
				'<div class="col-12 text-center"><p>No blog posts found.</p></div>';
			return;
		}

		// Sort by date (most recent first)
		blogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

		// Take only the 3 most recent blogs
		const latestBlogs = blogs.slice(0, 3);

		// Clear any existing content
		blogsSection.innerHTML = '';

		// Create carousel container
		const blogsCarouselContainer = document.createElement('div');
		blogsCarouselContainer.className = 'carousel-blog owl-carousel';

		// Render each blog
		latestBlogs.forEach((blog) => {
			const blogDate = new Date(blog.createdAt);
			const formattedDate = blogDate.toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			});

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
				console.log('Image URL for', blog.title, ':', imageUrl);
			} else {
				imageUrl = 'images/blog-default.jpg';
			}

			const blogHTML = `
				<div class="item">
					<div class="blog-entry align-self-stretch">
						<a href="blog-single.html?id=${
							blog._id
						}" class="block-20" style="background-image: url('${imageUrl}');">
						</a>
						<div class="text p-4 d-block">
							<div class="meta mb-3">
								<div><a href="#">${formattedDate}</a></div>
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
				</div>
			`;

			blogsCarouselContainer.innerHTML += blogHTML;
		});

		// Append carousel to section
		blogsSection.appendChild(blogsCarouselContainer);

		// Initialize owl carousel
		$('.carousel-blog').owlCarousel({
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

		// Initialize animations
		if (typeof $.fn.waypoint !== 'undefined') {
			$('.ftco-animate').waypoint(
				function () {
					$(this.element).addClass('fadeInUp ftco-animated');
				},
				{ offset: '95%' }
			);
		}
	} catch (error) {
		console.error('Failed to load blogs for homepage:', error);
	}
}

async function loadTeamMembers() {
	try {
		// Target the parent container using the unique ID
		const teamSection = document.querySelector(
			'#team-section .row:not(.justify-content-center)'
		);

		if (!teamSection) {
			console.error('Team section not found');
			return;
		}

		// Add loading state
		teamSection.innerHTML =
			'<div class="col-12 text-center"><div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div></div>';

		// Fetch team members from the API
		console.log('Fetching team members...');
		const response = await teamAPI.getAll();
		console.log('API Response:', response);

		// Handle both array response and object with data property
		const teamMembers = Array.isArray(response)
			? response
			: response.data || [];
		console.log('Processed team members:', teamMembers);

		if (!teamMembers || !teamMembers.length) {
			teamSection.innerHTML =
				'<div class="col-12 text-center"><p>No team members found.</p></div>';
			return;
		}

		// Clear any existing content
		teamSection.innerHTML = '';

		// Create a container for the carousel
		const teamCarouselContainer = document.createElement('div');
		teamCarouselContainer.className = 'col-md-12 ftco-animate';

		// Create carousel element
		const teamCarousel = document.createElement('div');
		teamCarousel.className = 'carousel-team owl-carousel';
		teamCarouselContainer.appendChild(teamCarousel);

		// Append the carousel container to the section
		teamSection.appendChild(teamCarouselContainer);

		// Render each team member
		teamMembers.forEach((member) => {
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
				console.log('Image URL for', member.name, ':', imageUrl);
			} else {
				imageUrl = 'images/team-default.jpg';
			}

			const memberHTML = `
				<div class="col-md-6 col-lg-3 ftco-animate">
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
				</div>
			`;

			teamCarousel.innerHTML += memberHTML;
		});

		// Initialize owl carousel
		$('.carousel-team').owlCarousel({
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

		// Initialize animations
		if (typeof $.fn.waypoint !== 'undefined') {
			$('.ftco-animate').waypoint(
				function () {
					$(this.element).addClass('fadeInUp ftco-animated');
				},
				{ offset: '95%' }
			);
		}
	} catch (error) {
		console.error('Failed to load team members:', error);
	}
}

async function loadGalleryImages() {
	try {
		// Target the parent container using the unique ID
		const gallerySection = document.querySelector(
			'#gallery-section .row:not(.justify-content-center)'
		);

		if (!gallerySection) {
			console.error('Gallery section not found');
			return;
		}

		// Add loading state
		gallerySection.innerHTML =
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
			gallerySection.innerHTML =
				'<div class="col-12 text-center"><p>No gallery images found.</p></div>';
			return;
		}

		// Clear any existing content
		gallerySection.innerHTML = '';

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

			gallerySection.innerHTML += imageHTML;
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
	}
}

async function loadLatestEvents() {
	try {
		// Target the parent container using the unique ID
		const eventsSection = document.querySelector(
			'#events-section .row:not(.justify-content-center)'
		);

		if (!eventsSection) {
			console.error('Events section not found');
			return;
		}

		// Add loading state
		eventsSection.innerHTML =
			'<div class="col-12 text-center"><div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div></div>';

		// Fetch events from the API
		console.log('Fetching events...');
		const response = await eventAPI.getAll();
		console.log('API Response:', response);

		// Handle both array response and object with data property
		const events = Array.isArray(response) ? response : response.data || [];
		console.log('Processed events:', events);

		if (!events || !events.length) {
			eventsSection.innerHTML =
				'<div class="col-12 text-center"><p>No events found.</p></div>';
			return;
		}

		// Sort by date (most recent first)
		events.sort((a, b) => new Date(b.date) - new Date(a.date));

		// Take only the 3 most recent events
		const latestEvents = events.slice(0, 3);

		// Clear any existing content
		eventsSection.innerHTML = '';

		// Create a container for the carousel
		const eventsCarouselContainer = document.createElement('div');
		eventsCarouselContainer.className = 'col-md-12 ftco-animate';

		// Create carousel element
		const eventsCarousel = document.createElement('div');
		eventsCarousel.className = 'carousel-events owl-carousel';
		eventsCarouselContainer.appendChild(eventsCarousel);

		// Append the carousel container to the section
		eventsSection.appendChild(eventsCarouselContainer);

		// Render each event
		latestEvents.forEach((event) => {
			const eventDate = new Date(event.date);
			const formattedDate = eventDate.toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			});

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
				console.log('Image URL for', event.title, ':', imageUrl);
			} else {
				imageUrl = 'images/event-default.jpg';
			}

			const eventHTML = `
				<div class="item">
					<div class="col-md-4 ftco-animate">
						<div class="event-entry">
							<a href="event-single.html?id=${
								event._id
							}" class="img" style="background-image: url(${imageUrl});"></a>
							<div class="text p-4 p-md-5">
								<div class="meta">
									<div><a href="#">${formattedDate}</a></div>
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
					</div>
				</div>
			`;

			eventsCarousel.innerHTML += eventHTML;
		});

		// Initialize owl carousel
		$('.carousel-events').owlCarousel({
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

		// Initialize animations
		if (typeof $.fn.waypoint !== 'undefined') {
			$('.ftco-animate').waypoint(
				function () {
					$(this.element).addClass('fadeInUp ftco-animated');
				},
				{ offset: '95%' }
			);
		}
	} catch (error) {
		console.error('Failed to load events:', error);
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
