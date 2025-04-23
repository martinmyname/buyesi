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
		const response = await window.API.causeAPI.getAll();
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
					imageUrl = `http://localhost:5000${cause.image}`;
				} else {
					imageUrl = `http://localhost:5000/uploads/general/${cause.image}`;
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
		const response = await window.API.blogAPI.getAll();
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
					imageUrl = `http://localhost:5000${blog.image}`;
				} else {
					imageUrl = `http://localhost:5000/uploads/blog/${blog.image}`;
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
		const response = await window.API.teamAPI.getAll();
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
					imageUrl = `http://localhost:5000${member.image}`;
				} else {
					imageUrl = `http://localhost:5000/uploads/team/${member.image}`;
				}
				console.log('Image URL for', member.name, ':', imageUrl);
			} else {
				imageUrl = 'images/person-default.jpg';
			}

			const memberHTML = `
				<div class="item">
					<div class="staff" style="padding: calc(1rem * 1); width: 100%;">
						<div class="d-flex mb-4">
							<div class="img" style="background-image: url(${imageUrl});"></div>
							<div class="info ml-4">
								<h3><a href="teacher-single.html?id=${member._id}">${member.name}</a></h3>
								<span class="position">${member.position}</span>
								${
									member.bio
										? `<p class="mt-2">${member.bio.substring(0, 50)}${
												member.bio.length > 50 ? '...' : ''
										  }</p>`
										: ''
								}
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
		const response = await window.API.galleryAPI.getAll();
		console.log('API Response:', response);

		// Handle both array response and object with data property
		const galleryItems = Array.isArray(response)
			? response
			: response.data || [];
		console.log('Processed gallery items:', galleryItems);

		if (!galleryItems || !galleryItems.length) {
			gallerySection.innerHTML =
				'<div class="col-12 text-center"><p>No gallery images found.</p></div>';
			return;
		}

		// Clear any existing content
		gallerySection.innerHTML = '';

		// Create a container for the carousel
		const galleryCarouselContainer = document.createElement('div');
		galleryCarouselContainer.className = 'col-md-12 ftco-animate';

		// Create carousel element
		const galleryCarousel = document.createElement('div');
		galleryCarousel.className = 'carousel-gallery owl-carousel';
		galleryCarouselContainer.appendChild(galleryCarousel);

		// Append the carousel container to the section
		gallerySection.appendChild(galleryCarouselContainer);

		// Render each gallery item
		galleryItems.forEach((item) => {
			let imageUrl;
			if (item.image) {
				if (item.image.startsWith('http')) {
					imageUrl = item.image;
				} else if (item.image.includes('/uploads/')) {
					imageUrl = `http://localhost:5000${item.image}`;
				} else {
					imageUrl = `http://localhost:5000/uploads/gallery/${item.image}`;
				}
				console.log('Image URL for gallery item:', imageUrl);
			} else {
				imageUrl = 'images/gallery-default.jpg';
			}

			const galleryItemHTML = `
				<div class="item">
					<a href="${imageUrl}" class="gallery image-popup d-flex justify-content-center align-items-center img ftco-animate" style="background-image: url(${imageUrl});">
						<div class="icon d-flex justify-content-center align-items-center">
							<span class="icon-search"></span>
						</div>
					</a>
				</div>
			`;

			galleryCarousel.innerHTML += galleryItemHTML;
		});

		// Initialize owl carousel
		$('.carousel-gallery').owlCarousel({
			autoplay: true,
			center: false,
			loop: true,
			items: 1,
			margin: 0,
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
					stagePadding: 0,
				},
				1000: {
					items: 3,
					stagePadding: 0,
				},
				1200: {
					items: 4,
					stagePadding: 0,
				},
			},
		});

		// Initialize magnific popup for gallery
		$('.gallery').magnificPopup({
			type: 'image',
			gallery: {
				enabled: true,
			},
			zoom: {
				enabled: true,
				duration: 300,
				easing: 'ease-in-out',
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
		const response = await window.API.eventAPI.getAll();
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
					imageUrl = `http://localhost:5000${event.image}`;
				} else {
					imageUrl = `http://localhost:5000/uploads/events/${event.image}`;
				}
				console.log('Image URL for', event.title, ':', imageUrl);
			} else {
				imageUrl = 'images/event-default.jpg';
			}

			const eventHTML = `
				<div class="item">
					<div class="blog-entry align-self-stretch">
						<a href="event-single.html?id=${
							event._id
						}" class="block-20" style="background-image: url('${imageUrl}');">
						</a>
						<div class="text p-4 d-block">
							<div class="meta mb-3">
								<div><a href="#">${formattedDate}</a></div>
								<div><a href="#">${event.organizer || 'Admin'}</a></div>
								<div><a href="#" class="meta-chat"><span class="icon-chat"></span> ${
									event.attendees?.length || 0
								}</a></div>
							</div>
							<h3 class="heading mb-4"><a href="event-single.html?id=${event._id}">${
				event.title
			}</a></h3>
							<p class="time-loc">
								<span class="mr-2"><i class="icon-clock-o"></i> ${event.startTime} - ${
				event.endTime
			}</span>
								<span><i class="icon-map-o"></i> ${event.location}</span>
							</p>
							<p>${
								event.description
									? event.description.substring(0, 100) +
									  (event.description.length > 100 ? '...' : '')
									: ''
							}</p>
							<p><a href="event-single.html?id=${
								event._id
							}">Join Event <i class="ion-ios-arrow-forward"></i></a></p>
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
	const volunteerForm = document.querySelector('.volunter-form');

	if (volunteerForm) {
		volunteerForm.addEventListener('submit', async function (e) {
			e.preventDefault();

			// Get form data
			const formElements = volunteerForm.elements;
			const name = formElements[0].value.trim();
			const email = formElements[1].value.trim();
			const message = formElements[2].value.trim();

			// Form validation
			if (!name || !email || !message) {
				showAlert(
					'Please fill in all required fields (name, email, and message)',
					'danger',
					volunteerForm
				);
				return;
			}

			// Email validation
			const emailPattern = /^\S+@\S+\.\S+$/;
			if (!emailPattern.test(email)) {
				showAlert(
					'Please enter a valid email address',
					'danger',
					volunteerForm
				);
				return;
			}

			// Disable submit button and show loading state
			const submitBtn = volunteerForm.querySelector('input[type="submit"]');
			const originalBtnValue = submitBtn.value;
			submitBtn.value = 'Sending...';
			submitBtn.disabled = true;

			try {
				// Register volunteer through the API
				const response = await window.API.volunteerAPI.register({
					name,
					email,
					message,
				});

				// Clear form
				volunteerForm.reset();

				// Show success message
				showAlert(
					'Thank you for volunteering! We will contact you soon.',
					'success',
					volunteerForm
				);
			} catch (error) {
				console.error('Failed to register volunteer:', error);

				// Check for the special EMAIL_ERROR flag
				const errorMessage = error.message || '';
				if (
					errorMessage.startsWith('EMAIL_ERROR:') ||
					errorMessage.includes('email') ||
					errorMessage.includes('smtp') ||
					errorMessage.includes('nodemailer') ||
					errorMessage.includes('mail') ||
					errorMessage.includes('login')
				) {
					// Still clear the form and show success message because the volunteer was registered
					volunteerForm.reset();
					showAlert(
						'Thank you for volunteering! We will contact you soon.',
						'success',
						volunteerForm
					);
				} else {
					// For other errors, show the error message
					showAlert(
						'Failed to register. Please try again later.',
						'danger',
						volunteerForm
					);
				}
			} finally {
				// Restore submit button
				submitBtn.value = originalBtnValue;
				submitBtn.disabled = false;
			}
		});
	}
}

function setupDonationForm() {
	const donationForm = document.querySelector('.donation-form');

	if (donationForm) {
		donationForm.addEventListener('submit', async function (e) {
			e.preventDefault();

			// Get form data
			const amount = document.getElementById('amount').value;
			const name = document.getElementById('fullName').value;
			const email = document.getElementById('donorEmail').value;

			// Form validation
			if (!amount || !name || !email) {
				showAlert('Please fill in all required fields', 'danger', donationForm);
				return;
			}

			// Validate amount is a positive number
			if (isNaN(amount) || parseFloat(amount) <= 0) {
				showAlert(
					'Please enter a valid donation amount',
					'danger',
					donationForm
				);
				return;
			}

			// Disable submit button and show loading state
			const submitBtn = donationForm.querySelector('input[type="submit"]');
			const originalBtnValue = submitBtn.value;
			submitBtn.value = 'Processing...';
			submitBtn.disabled = true;

			try {
				// Create donation through the API
				const response = await window.API.donationAPI.create({
					amount: parseFloat(amount),
					name,
					email,
					// Add any other fields you capture in your form
				});

				// Clear form
				donationForm.reset();

				// Show success message
				showAlert('Thank you for your donation!', 'success', donationForm);

				// Optionally redirect to a payment gateway if your backend returns a payment URL
				if (response.paymentUrl) {
					window.location.href = response.paymentUrl;
				}
			} catch (error) {
				console.error('Failed to process donation:', error);
				showAlert(
					'Failed to process donation. Please try again later.',
					'danger',
					donationForm
				);
			} finally {
				// Restore submit button
				submitBtn.value = originalBtnValue;
				submitBtn.disabled = false;
			}
		});
	}
}

// Helper function to show alerts
function showAlert(message, type, targetForm) {
	const alertDiv = document.createElement('div');
	alertDiv.className = `alert alert-${type} mt-3`;
	alertDiv.textContent = message;

	// Insert alert before the form or after it
	if (targetForm) {
		targetForm.parentNode.insertBefore(alertDiv, targetForm.nextSibling);
	}

	// Auto remove after 5 seconds
	setTimeout(() => {
		alertDiv.remove();
	}, 5000);
}

// Helper function to format time ago
function formatTimeAgo(dateString) {
	const date = new Date(dateString);
	const now = new Date();
	const diffInSeconds = Math.floor((now - date) / 1000);

	if (diffInSeconds < 60) {
		return 'just now';
	}

	const diffInMinutes = Math.floor(diffInSeconds / 60);
	if (diffInMinutes < 60) {
		return `${diffInMinutes}m ago`;
	}

	const diffInHours = Math.floor(diffInMinutes / 60);
	if (diffInHours < 24) {
		return `${diffInHours}h ago`;
	}

	const diffInDays = Math.floor(diffInHours / 24);
	if (diffInDays < 7) {
		return `${diffInDays}d ago`;
	}

	const diffInWeeks = Math.floor(diffInDays / 7);
	if (diffInWeeks < 4) {
		return `${diffInWeeks}w ago`;
	}

	const diffInMonths = Math.floor(diffInDays / 30);
	if (diffInMonths < 12) {
		return `${diffInMonths}mo ago`;
	}

	const diffInYears = Math.floor(diffInDays / 365);
	return `${diffInYears}y ago`;
}
