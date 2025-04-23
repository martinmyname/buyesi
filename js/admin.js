// Admin Dashboard Functions
class AdminDashboard {
	constructor() {
		this.currentUser = null;
		this.initialize();
	}

	async initialize() {
		// Check authentication
		if (!window.API.auth.isAuthenticated()) {
			window.location.href = 'login.html';
			return;
		}

		// Get current user
		this.currentUser = window.API.auth.getCurrentUser();

		// Initialize event listeners
		this.initializeEventListeners();

		// Load initial data
		await this.loadDashboardData();

		// Show dashboard section by default
		this.showSection('dashboard');
	}

	initializeEventListeners() {
		// Navigation
		$('.admin-nav a').click((e) => {
			e.preventDefault();
			const section = $(e.currentTarget).data('section');
			this.showSection(section);
		});

		// Logout
		$('#logoutButton').click(() => {
			window.API.auth.logout();
			window.location.href = 'login.html';
		});

		// Bind 'this' to the class instance for all form handlers
		const self = this;

		// Team form submission
		$('#teamForm').submit(async (e) => {
			e.preventDefault();
			try {
				const form = e.target;
				const formData = new FormData(form);

				// Debug: log each field being sent
				console.log('Form data being submitted:');
				for (let [key, value] of formData.entries()) {
					console.log(
						`${key}: ${value instanceof File ? `File: ${value.name}` : value}`
					);
				}

				// Validate required fields
				const name = formData.get('name');
				const position = formData.get('position');
				const image = formData.get('image');

				if (!name || !position) {
					this.showError('Name and Position are required fields');
					return;
				}

				// Image is required on the model, so check if it's a File with a name
				if (image instanceof File && image.name === '') {
					this.showError('Please select an image file');
					return;
				}

				await window.API.teamAPI.create(formData);
				$('#teamModal').modal('hide');
				form.reset();
				this.loadTeamData();
				this.showSuccess('Team member added successfully');
			} catch (error) {
				console.error('Error adding team member:', error);
				this.showError('Failed to add team member: ' + error.message);
			}
		});

		// Blog form submission
		$('#blogForm').submit(async function (e) {
			e.preventDefault();
			await self.handleBlogFormSubmit();
		});

		// Event form submission
		$('#eventForm').submit(async function (e) {
			e.preventDefault();
			await self.handleEventFormSubmit();
		});

		// Gallery form submission
		$('#galleryForm').submit(async function (e) {
			e.preventDefault();
			await self.handleGalleryFormSubmit();
		});

		// Cause form submission
		$('#causeForm').submit(async function (e) {
			e.preventDefault();
			await self.handleCauseFormSubmit();
		});

		// Event listeners for edit and delete buttons
		$(document).on('click', '.edit-blog', async (e) => {
			const id = $(e.target).data('id');
			try {
				const blog = await window.API.blogAPI.getById(id);
				const form = document.getElementById('blogForm');
				form.elements['title'].value = blog.title;
				form.elements['content'].value = blog.content;
				$('#blogModalLabel').text('Edit Blog Post');
				$('#blogModal').modal('show');
				form.onsubmit = async (e) => {
					e.preventDefault();
					const formData = new FormData(form);
					await window.API.blogAPI.update(id, formData);
					this.showSuccess('Blog post updated successfully');
					$('#blogModal').modal('hide');
					form.reset();
					await this.loadBlogsData();
				};
			} catch (error) {
				console.error('Error editing blog:', error);
				this.showError('Failed to edit blog: ' + error.message);
			}
		});

		$(document).on('click', '.delete-blog', async (e) => {
			const id = $(e.target).data('id');
			if (confirm('Are you sure you want to delete this blog post?')) {
				try {
					await window.API.blogAPI.delete(id);
					this.showSuccess('Blog post deleted successfully');
					await this.loadBlogsData();
				} catch (error) {
					console.error('Error deleting blog:', error);
					this.showError('Failed to delete blog: ' + error.message);
				}
			}
		});

		$(document).on('click', '.edit-event', async (e) => {
			const id = $(e.target).data('id');
			try {
				const event = await window.API.eventAPI.getById(id);
				const form = document.getElementById('eventForm');
				form.elements['title'].value = event.title;
				form.elements['startDate'].value = event.startDate;
				form.elements['endDate'].value = event.endDate;
				form.elements['location'].value = event.location;
				form.elements['description'].value = event.description;
				$('#eventModalLabel').text('Edit Event');
				$('#eventModal').modal('show');
				form.onsubmit = async (e) => {
					e.preventDefault();
					const formData = new FormData(form);
					await window.API.eventAPI.update(id, formData);
					this.showSuccess('Event updated successfully');
					$('#eventModal').modal('hide');
					form.reset();
					await this.loadEventsData();
				};
			} catch (error) {
				console.error('Error editing event:', error);
				this.showError('Failed to edit event: ' + error.message);
			}
		});

		$(document).on('click', '.delete-event', async (e) => {
			const id = $(e.target).data('id');
			if (confirm('Are you sure you want to delete this event?')) {
				try {
					await window.API.eventAPI.delete(id);
					this.showSuccess('Event deleted successfully');
					await this.loadEventsData();
				} catch (error) {
					console.error('Error deleting event:', error);
					this.showError('Failed to delete event: ' + error.message);
				}
			}
		});

		$(document).on('click', '.delete-gallery', async (e) => {
			const id = $(e.target).data('id');
			if (confirm('Are you sure you want to delete this gallery item?')) {
				try {
					await window.API.galleryAPI.delete(id);
					this.showSuccess('Gallery item deleted successfully');
					await this.loadGalleryData();
				} catch (error) {
					console.error('Error deleting gallery item:', error);
					this.showError('Failed to delete gallery item: ' + error.message);
				}
			}
		});

		$(document).on('click', '.edit-cause', async (e) => {
			const id = $(e.target).data('id');
			try {
				const response = await window.API.causeAPI.getById(id);
				const cause = response.data || response;

				$('#causeModalLabel').text('Edit Cause');
				$('#causeForm')[0].reset();
				$('#causeForm input[name="title"]').val(cause.title);
				$('#causeForm textarea[name="description"]').val(cause.description);
				$('#causeForm input[name="targetAmount"]').val(cause.targetAmount);
				$('#causeForm input[name="raisedAmount"]').val(cause.raisedAmount);
				$('#causeForm input[name="image"]').prop('required', false);
				$('#causeModal .modal-footer button[type="submit"]')
					.data('action', 'edit')
					.data('id', id);
				$('#causeModal').modal('show');
			} catch (error) {
				console.error('Error loading cause for edit:', error);
				this.showError('Failed to load cause data: ' + error.message);
			}
		});

		$(document).on('click', '.delete-cause', async (e) => {
			const id = $(e.target).data('id');
			if (confirm('Are you sure you want to delete this cause?')) {
				try {
					await window.API.causeAPI.delete(id);
					this.showSuccess('Cause deleted successfully');
					await this.loadCausesData();
				} catch (error) {
					console.error('Error deleting cause:', error);
					this.showError('Failed to delete cause: ' + error.message);
				}
			}
		});

		$(document).on('click', '.edit-team', async (e) => {
			const id = $(e.target).data('id');
			try {
				const teamMember = await window.API.teamAPI.getById(id);
				const form = document.getElementById('teamForm');
				form.elements['name'].value = teamMember.name;
				form.elements['position'].value = teamMember.position;
				form.elements['email'].value = teamMember.email || '';
				form.elements['bio'].value = teamMember.bio || '';
				$('#teamModalLabel').text('Edit Team Member');
				$('#teamModal').modal('show');
				form.onsubmit = async (e) => {
					e.preventDefault();
					const formData = new FormData(form);
					await window.API.teamAPI.update(id, formData);
					this.showSuccess('Team member updated successfully');
					$('#teamModal').modal('hide');
					form.reset();
					await this.loadTeamData();
				};
			} catch (error) {
				console.error('Error editing team member:', error);
				this.showError('Failed to edit team member: ' + error.message);
			}
		});

		$(document).on('click', '.delete-team', async (e) => {
			const id = $(e.target).data('id');
			if (confirm('Are you sure you want to delete this team member?')) {
				try {
					await window.API.teamAPI.delete(id);
					this.showSuccess('Team member deleted successfully');
					await this.loadTeamData();
				} catch (error) {
					console.error('Error deleting team member:', error);
					this.showError('Failed to delete team member: ' + error.message);
				}
			}
		});

		$(document).on('click', '.delete-volunteer', async (e) => {
			const id = $(e.target).data('id');
			if (confirm('Are you sure you want to delete this volunteer?')) {
				try {
					await window.API.volunteerAPI.delete(id);
					this.showSuccess('Volunteer deleted successfully');
					await this.loadVolunteersData();
				} catch (error) {
					console.error('Error deleting volunteer:', error);
					this.showError('Failed to delete volunteer: ' + error.message);
				}
			}
		});
	}

	showSection(section) {
		// Hide all sections
		$('.section').hide();

		// Show selected section
		$(`#${section}-section`).show();

		// Update active nav item
		$('.admin-nav a').removeClass('active');
		$(`.admin-nav a[data-section="${section}"]`).addClass('active');

		// Load section data
		this.loadSectionData(section);
	}

	async loadDashboardData() {
		try {
			// Load donations
			const donationsResponse = await window.API.donationAPI.getAll();
			const donations = Array.isArray(donationsResponse)
				? donationsResponse
				: donationsResponse.data || [];
			$('#total-donations').text(donations.length);

			// Load volunteers
			const volunteersResponse = await window.API.volunteerAPI.getAll();
			const volunteers = Array.isArray(volunteersResponse)
				? volunteersResponse
				: volunteersResponse.data || [];
			$('#total-volunteers').text(volunteers.length);

			// Load causes
			const causesResponse = await window.API.causeAPI.getAll();
			const causes = Array.isArray(causesResponse)
				? causesResponse
				: causesResponse.data || [];
			$('#total-causes').text(causes.length);
		} catch (error) {
			console.error('Error loading dashboard data:', error);
			this.showError('Failed to load dashboard data: ' + error.message);
		}
	}

	async loadSectionData(section) {
		try {
			switch (section) {
				case 'team':
					await this.loadTeamData();
					break;
				case 'blog':
					await this.loadBlogsData();
					break;
				case 'events':
					await this.loadEventsData();
					break;
				case 'gallery':
					await this.loadGalleryData();
					break;
				case 'causes':
					await this.loadCausesData();
					break;
				case 'donations':
					await this.loadDonationsData();
					break;
				case 'volunteers':
					await this.loadVolunteersData();
					break;
			}
		} catch (error) {
			console.error(`Error loading ${section} data:`, error);
			this.showError(`Failed to load ${section} data`);
		}
	}

	async loadTeamData() {
		try {
			const response = await window.API.teamAPI.getAll();
			console.log('Team API response:', response);
			// Check if response is an array directly or has data property
			const teamMembers = Array.isArray(response)
				? response
				: response.data || [];
			console.log('Team members to render:', teamMembers);
			console.log('Team members count:', teamMembers.length);
			const tbody = $('#team-table tbody');
			console.log('Team table tbody element exists:', tbody.length > 0);
			tbody.empty();

			if (teamMembers.length === 0) {
				tbody.append(
					'<tr><td colspan="5" class="text-center">No team members found</td></tr>'
				);
				return;
			}

			teamMembers.forEach((member, index) => {
				console.log(`Rendering team member ${index}:`, member);
				tbody.append(`
					<tr>
						<td><img src="${
							member.image
								? `http://localhost:5000${member.image}`
								: 'images/person-default.jpg'
						}" alt="${
					member.name
				}" width="50" height="50" class="rounded-circle"></td>
						<td>${member.name}</td>
						<td>${member.position}</td>
						<td>${member.email || 'N/A'}</td>
						<td>
							<button class="btn btn-sm btn-primary edit-team" data-id="${
								member._id
							}">Edit</button>
							<button class="btn btn-sm btn-danger delete-team" data-id="${
								member._id
							}">Delete</button>
						</td>
					</tr>
				`);
			});
			console.log(
				'Team table rows after rendering:',
				$('#team-table tbody tr').length
			);
		} catch (error) {
			console.error('Error loading team data:', error);
			$('#team-table tbody').html(
				'<tr><td colspan="5" class="text-center text-danger">Error loading team members</td></tr>'
			);
		}
	}

	async loadBlogsData() {
		try {
			const response = await window.API.blogAPI.getAll();
			const blogs = Array.isArray(response) ? response : response.data || [];
			const tbody = $('#blog-table tbody');
			tbody.empty();

			blogs.forEach((blog) => {
				tbody.append(`
					<tr>
						<td>${blog.title}</td>
						<td>${new Date(blog.date).toLocaleDateString()}</td>
						<td>
							<button class="btn btn-sm btn-primary edit-blog" data-id="${
								blog._id
							}">Edit</button>
							<button class="btn btn-sm btn-danger delete-blog" data-id="${
								blog._id
							}">Delete</button>
						</td>
					</tr>
				`);
			});
		} catch (error) {
			console.error('Error loading blogs data:', error);
			this.showError('Failed to load blogs data: ' + error.message);
		}
	}

	async loadEventsData() {
		try {
			const response = await window.API.eventAPI.getAll();
			console.log('Events API response:', response);
			// Check if response is an array directly or has data property
			const events = Array.isArray(response) ? response : response.data || [];
			console.log('Events to render:', events);
			console.log('Events count:', events.length);
			const tbody = $('#events-table tbody');
			console.log('Events table tbody element exists:', tbody.length > 0);
			tbody.empty();

			events.forEach((event, index) => {
				console.log(`Rendering event ${index}:`, event);
				tbody.append(`
					<tr>
						<td>${event.title}</td>
						<td>${new Date(event.date).toLocaleDateString()}</td>
						<td>${event.location}</td>
						<td>
							<button class="btn btn-sm btn-primary edit-event" data-id="${
								event._id
							}">Edit</button>
							<button class="btn btn-sm btn-danger delete-event" data-id="${
								event._id
							}">Delete</button>
						</td>
					</tr>
				`);
			});
			console.log(
				'Events table rows after rendering:',
				$('#events-table tbody tr').length
			);
		} catch (error) {
			console.error('Error loading events data:', error);
			this.showError('Failed to load events data: ' + error.message);
		}
	}

	async loadGalleryData() {
		try {
			const response = await window.API.galleryAPI.getAll();
			console.log('Gallery API response:', response);
			// Check if response is an array directly or has data property
			const gallery = Array.isArray(response) ? response : response.data || [];
			console.log('Gallery items to render:', gallery);
			console.log('Gallery count:', gallery.length);
			const grid = $('#gallery-grid');
			grid.empty();

			gallery.forEach((image, index) => {
				console.log(`Rendering gallery item ${index}:`, image);
				grid.append(`
					<div class="col-md-4 mb-4">
						<div class="card">
							<img src="${
								image.url || `http://localhost:5000${image.image}`
							}" class="card-img-top" alt="${image.title}">
							<div class="card-body">
								<h5 class="card-title">${image.title}</h5>
								<button class="btn btn-sm btn-danger delete-gallery" data-id="${
									image._id
								}">Delete</button>
							</div>
						</div>
					</div>
				`);
			});
			console.log(
				'Gallery items after rendering:',
				$('#gallery-grid .card').length
			);
		} catch (error) {
			console.error('Error loading gallery data:', error);
			this.showError('Failed to load gallery data: ' + error.message);
		}
	}

	async loadCausesData() {
		try {
			const response = await window.API.causeAPI.getAll();
			const causes = Array.isArray(response) ? response : response.data || [];
			const tbody = $('#causes-table tbody');
			tbody.empty();

			causes.forEach((cause) => {
				tbody.append(`
					<tr>
						<td>${cause.title}</td>
						<td>$${cause.targetAmount}</td>
						<td>$${cause.raisedAmount}</td>
						<td>
							<button class="btn btn-sm btn-primary edit-cause" data-id="${cause._id}">Edit</button>
							<button class="btn btn-sm btn-danger delete-cause" data-id="${cause._id}">Delete</button>
						</td>
					</tr>
				`);
			});
		} catch (error) {
			console.error('Error loading causes data:', error);
			this.showError('Failed to load causes data: ' + error.message);
		}
	}

	async loadDonationsData() {
		try {
			const response = await window.API.donationAPI.getAll();
			const donations = Array.isArray(response)
				? response
				: response.data || [];
			const tbody = $('#donations-table tbody');
			tbody.empty();

			donations.forEach((donation) => {
				tbody.append(`
					<tr>
						<td>${donation.donorName}</td>
						<td>$${donation.amount}</td>
						<td>${new Date(donation.date).toLocaleDateString()}</td>
						<td>${donation.causeTitle}</td>
					</tr>
				`);
			});
		} catch (error) {
			console.error('Error loading donations data:', error);
			this.showError('Failed to load donations data: ' + error.message);
		}
	}

	async loadVolunteersData() {
		try {
			const response = await window.API.volunteerAPI.getAll();
			const volunteers = Array.isArray(response)
				? response
				: response.data || [];
			const tbody = $('#volunteers-table tbody');
			tbody.empty();

			volunteers.forEach((volunteer) => {
				tbody.append(`
					<tr>
						<td>${volunteer.name}</td>
						<td>${volunteer.email}</td>
						<td>${volunteer.phone}</td>
						<td>${new Date(volunteer.dateJoined).toLocaleDateString()}</td>
						<td>
							<button class="btn btn-sm btn-danger delete-volunteer" data-id="${
								volunteer._id
							}">Delete</button>
						</td>
					</tr>
				`);
			});
		} catch (error) {
			console.error('Error loading volunteers data:', error);
			this.showError('Failed to load volunteers data: ' + error.message);
		}
	}

	async handleBlogFormSubmit() {
		try {
			const form = document.getElementById('blogForm');
			const formData = new FormData(form);

			// Check for file size if a file is included
			const fileInput = form.querySelector('input[type="file"]');
			if (fileInput && fileInput.files.length > 0) {
				const file = fileInput.files[0];
				const maxSizeInBytes = 8 * 1024 * 1024; // 8MB limit as a safe default
				if (file.size > maxSizeInBytes) {
					this.showError(
						`File size too large. Maximum allowed size is 8MB. Your file is ${(
							file.size /
							(1024 * 1024)
						).toFixed(2)}MB.`
					);
					return;
				}
			}

			if (!formData.get('title') || !formData.get('content')) {
				this.showError('Title and content are required');
				return;
			}

			const response = await window.API.blogAPI.create(formData);

			if (response) {
				this.showSuccess('Blog post added successfully');
				$('#blogModal').modal('hide');
				form.reset();
				await this.loadBlogsData();
			}
		} catch (error) {
			console.error('Error adding blog:', error);
			this.showError('Failed to add blog: ' + error.message);
		}
	}

	async handleEventFormSubmit() {
		try {
			const form = document.getElementById('eventForm');
			const formData = new FormData(form);

			// Debug: log each field being sent
			console.log('Event form data being submitted:');
			for (let [key, value] of formData.entries()) {
				console.log(
					`${key}: ${value instanceof File ? `File: ${value.name}` : value}`
				);
			}

			// Validate required fields
			const title = formData.get('title');
			const startDate = formData.get('startDate');
			const endDate = formData.get('endDate');
			const location = formData.get('location');
			const description = formData.get('description');
			const image = formData.get('image');

			// Basic validation
			if (!title || !startDate || !endDate || !location || !description) {
				this.showError('Please fill in all required fields');
				return;
			}

			// Image is required on the model, so check if it's a File with a name
			if (image instanceof File && image.name === '') {
				this.showError('Please select an image file');
				return;
			}

			// Handle checkbox and boolean fields
			const featured = form.querySelector('input[name="featured"]').checked;
			const registrationRequired = form.querySelector(
				'input[name="registrationRequired"]'
			).checked;

			// Create a new FormData to ensure all fields are included correctly
			const newFormData = new FormData();
			newFormData.append('title', title);

			// Generate a slug from the title
			const slug =
				title
					.toLowerCase()
					.replace(/[^\w\s-]/g, '')
					.replace(/[\s_-]+/g, '-')
					.replace(/^-+|-+$/g, '') +
				'-' +
				Date.now().toString().slice(-4);
			newFormData.append('slug', slug);

			newFormData.append('startDate', startDate);
			newFormData.append('endDate', endDate);
			newFormData.append('location', location);
			newFormData.append('description', description);
			newFormData.append(
				'organizer',
				formData.get('organizer') || 'Buyesi Youth Initiative'
			);
			newFormData.append('status', formData.get('status') || 'upcoming');
			newFormData.append('address', formData.get('address') || '');
			newFormData.append('featured', featured ? 'true' : 'false');
			newFormData.append(
				'registrationRequired',
				registrationRequired ? 'true' : 'false'
			);
			newFormData.append(
				'maximumAttendees',
				formData.get('maximumAttendees') || '0'
			);

			// Add the image file - ensure it's appended correctly
			if (image instanceof File && image.name !== '') {
				newFormData.append('image', image);
			}

			console.log('Sending event data to API...');
			// Debug the final FormData before sending
			for (let [key, value] of newFormData.entries()) {
				console.log(
					`Final ${key}: ${
						value instanceof File ? `File: ${value.name}` : value
					}`
				);
			}

			const response = await window.API.eventAPI.create(newFormData);

			if (response) {
				this.showSuccess('Event added successfully');
				$('#eventModal').modal('hide');
				form.reset();
				await this.loadEventsData();
			}
		} catch (error) {
			console.error('Error adding event:', error);
			this.showError('Failed to add event: ' + error.message);
		}
	}

	async handleGalleryFormSubmit() {
		try {
			const form = document.getElementById('galleryForm');
			const formData = new FormData(form);

			if (!formData.get('title') || !formData.get('image').size === 0) {
				this.showError('Title and image are required');
				return;
			}

			const response = await window.API.galleryAPI.create(formData);

			if (response) {
				this.showSuccess('Gallery item added successfully');
				$('#galleryModal').modal('hide');
				form.reset();
				await this.loadGalleryData();
			}
		} catch (error) {
			console.error('Error adding gallery item:', error);
			this.showError('Failed to add gallery item: ' + error.message);
		}
	}

	async handleCauseFormSubmit() {
		try {
			const form = document.getElementById('causeForm');
			const formData = new FormData(form);

			// Validate required fields
			const title = formData.get('title');
			const description = formData.get('description');
			const targetAmount = formData.get('targetAmount');
			const raisedAmount = formData.get('raisedAmount');

			if (!title || !description || !targetAmount) {
				this.showError('Title, description, and target amount are required');
				return;
			}

			// Ensure raisedAmount is a number
			if (raisedAmount && isNaN(parseFloat(raisedAmount))) {
				this.showError('Raised amount must be a valid number');
				return;
			}

			// Set raisedAmount explicitly
			formData.set('raisedAmount', parseFloat(raisedAmount) || 0);

			const response = await window.API.causeAPI.create(formData);

			if (response) {
				this.showSuccess('Cause added successfully');
				$('#causeModal').modal('hide');
				form.reset();
				await this.loadCausesData();
			}
		} catch (error) {
			console.error('Error adding cause:', error);
			this.showError('Failed to add cause: ' + error.message);
		}
	}

	showError(message) {
		// Create or update error alert
		let errorAlert = $('#errorAlert');
		if (errorAlert.length === 0) {
			errorAlert = $(
				'<div class="alert alert-danger" id="errorAlert" role="alert"></div>'
			);
			$('.admin-content').prepend(errorAlert);
		}
		errorAlert.text(message).show();
		setTimeout(() => errorAlert.hide(), 5000);
	}

	showSuccess(message) {
		// Create or update success alert
		let successAlert = $('#successAlert');
		if (successAlert.length === 0) {
			successAlert = $(
				'<div class="alert alert-success" id="successAlert" role="alert"></div>'
			);
			$('.admin-content').prepend(successAlert);
		}
		successAlert.text(message).show();
		setTimeout(() => successAlert.hide(), 5000);
	}
}

// Initialize admin dashboard when document is ready
$(document).ready(() => {
	window.adminDashboard = new AdminDashboard();
});

function loadDashboardStats() {
	try {
		// Fetch donation statistics
		fetch('/api/donations/stats')
			.then((response) => response.json())
			.then((data) => {
				document.getElementById(
					'total-donations'
				).textContent = `$${data.totalAmount.toLocaleString()}`;
				document.getElementById('donation-count').textContent = data.count;
			});

		// Fetch other data for the dashboard
		Promise.all([
			window.API.donationAPI.getAll(),
			window.API.volunteerAPI.getAll(),
			window.API.causeAPI.getAll(),
		]).then(([donationsResponse, volunteersResponse, causesResponse]) => {
			// Display total volunteers
			document.getElementById('volunteer-count').textContent =
				volunteersResponse.length;

			// Display total causes
			document.getElementById('cause-count').textContent =
				causesResponse.length;
		});
	} catch (error) {
		console.error('Error loading dashboard stats:', error);
	}
}
