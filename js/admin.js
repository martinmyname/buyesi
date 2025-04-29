// Initialize API object if it doesn't exist
if (!window.API) {
	window.API = {
		auth: {
			isAuthenticated: () => !!localStorage.getItem('token'),
			getCurrentUser: () => JSON.parse(localStorage.getItem('user')),
			logout: () => {
				localStorage.removeItem('token');
				localStorage.removeItem('user');
			},
		},
		donationAPI: {
			getAll: async () => {
				const token = localStorage.getItem('token');
				const response = await fetch('https://buyesi.onrender.com/donations', {
					headers: {
						Authorization: token ? `Bearer ${token}` : '',
					},
				});
				return response.json();
			},
		},
		volunteerAPI: {
			getAll: async () => {
				const token = localStorage.getItem('token');
				const response = await fetch('https://buyesi.onrender.com/volunteers', {
					headers: {
						Authorization: token ? `Bearer ${token}` : '',
					},
				});
				return response.json();
			},
			delete: async (id) => {
				const token = localStorage.getItem('token');
				const response = await fetch(
					`https://buyesi.onrender.com/volunteers/${id}`,
					{
						method: 'DELETE',
						headers: {
							Authorization: token ? `Bearer ${token}` : '',
						},
					}
				);
				return response.json();
			},
		},
		causeAPI: {
			getAll: async () => {
				const token = localStorage.getItem('token');
				const response = await fetch(
					'https://buyesi.onrender.com/api/admin/causes',
					{
						headers: {
							Authorization: token ? `Bearer ${token}` : '',
						},
					}
				);
				return response.json();
			},
			getById: async (id) => {
				const token = localStorage.getItem('token');
				const response = await fetch(
					`https://buyesi.onrender.com/api/admin/causes/${id}`,
					{
						headers: {
							Authorization: token ? `Bearer ${token}` : '',
						},
					}
				);
				return response.json();
			},
			create: async (formData) => {
				const token = localStorage.getItem('token');
				const response = await fetch(
					'https://buyesi.onrender.com/api/admin/causes',
					{
						method: 'POST',
						headers: {
							Authorization: token ? `Bearer ${token}` : '',
						},
						body: formData,
					}
				);
				return response.json();
			},
			update: async (id, formData) => {
				const token = localStorage.getItem('token');
				const response = await fetch(
					`https://buyesi.onrender.com/api/admin/causes/${id}`,
					{
						method: 'PUT',
						headers: {
							Authorization: token ? `Bearer ${token}` : '',
						},
						body: formData,
					}
				);
				return response.json();
			},
			delete: async (id) => {
				const token = localStorage.getItem('token');
				const response = await fetch(
					`https://buyesi.onrender.com/api/admin/causes/${id}`,
					{
						method: 'DELETE',
						headers: {
							Authorization: token ? `Bearer ${token}` : '',
						},
					}
				);
				return response.json();
			},
		},
		teamAPI: {
			getAll: async () => {
				const token = localStorage.getItem('token');
				const response = await fetch(
					'https://buyesi.onrender.com/api/admin/team',
					{
						headers: {
							Authorization: token ? `Bearer ${token}` : '',
						},
					}
				);
				return response.json();
			},
			getById: async (id) => {
				const token = localStorage.getItem('token');
				const response = await fetch(
					`https://buyesi.onrender.com/api/admin/team/${id}`,
					{
						headers: {
							Authorization: token ? `Bearer ${token}` : '',
						},
					}
				);
				return response.json();
			},
			create: async (formData) => {
				const token = localStorage.getItem('token');
				const response = await fetch(
					'https://buyesi.onrender.com/api/admin/team',
					{
						method: 'POST',
						headers: {
							Authorization: token ? `Bearer ${token}` : '',
						},
						body: formData,
					}
				);
				return response.json();
			},
			update: async (id, formData) => {
				const token = localStorage.getItem('token');
				const response = await fetch(
					`https://buyesi.onrender.com/api/admin/team/${id}`,
					{
						method: 'PUT',
						headers: {
							Authorization: token ? `Bearer ${token}` : '',
						},
						body: formData,
					}
				);
				return response.json();
			},
			delete: async (id) => {
				const token = localStorage.getItem('token');
				const response = await fetch(
					`https://buyesi.onrender.com/api/admin/team/${id}`,
					{
						method: 'DELETE',
						headers: {
							Authorization: token ? `Bearer ${token}` : '',
						},
					}
				);
				return response.json();
			},
		},
		blogAPI: {
			getAll: async () => {
				const token = localStorage.getItem('token');
				const response = await fetch(
					'https://buyesi.onrender.com/api/admin/blog',
					{
						headers: {
							Authorization: token ? `Bearer ${token}` : '',
						},
					}
				);
				return response.json();
			},
			getById: async (id) => {
				const token = localStorage.getItem('token');
				const response = await fetch(
					`https://buyesi.onrender.com/api/admin/blog/${id}`,
					{
						headers: {
							Authorization: token ? `Bearer ${token}` : '',
						},
					}
				);
				return response.json();
			},
			create: async (formData) => {
				const token = localStorage.getItem('token');
				const response = await fetch(
					'https://buyesi.onrender.com/api/admin/blog',
					{
						method: 'POST',
						headers: {
							Authorization: token ? `Bearer ${token}` : '',
						},
						body: formData,
					}
				);
				return response.json();
			},
			update: async (id, formData) => {
				const token = localStorage.getItem('token');
				const response = await fetch(
					`https://buyesi.onrender.com/api/admin/blog/${id}`,
					{
						method: 'PUT',
						headers: {
							Authorization: token ? `Bearer ${token}` : '',
						},
						body: formData,
					}
				);
				return response.json();
			},
			delete: async (id) => {
				const token = localStorage.getItem('token');
				const response = await fetch(
					`https://buyesi.onrender.com/api/admin/blog/${id}`,
					{
						method: 'DELETE',
						headers: {
							Authorization: token ? `Bearer ${token}` : '',
						},
					}
				);
				return response.json();
			},
		},
		eventAPI: {
			getAll: async () => {
				const token = localStorage.getItem('token');
				const response = await fetch(
					'https://buyesi.onrender.com/api/admin/events',
					{
						headers: {
							Authorization: token ? `Bearer ${token}` : '',
						},
					}
				);
				return response.json();
			},
			getById: async (id) => {
				const token = localStorage.getItem('token');
				const response = await fetch(
					`https://buyesi.onrender.com/api/admin/events/${id}`,
					{
						headers: {
							Authorization: token ? `Bearer ${token}` : '',
						},
					}
				);
				return response.json();
			},
			create: async (formData) => {
				const token = localStorage.getItem('token');
				const response = await fetch(
					'https://buyesi.onrender.com/api/admin/events',
					{
						method: 'POST',
						headers: {
							Authorization: token ? `Bearer ${token}` : '',
						},
						body: formData,
					}
				);
				return response.json();
			},
			update: async (id, formData) => {
				const token = localStorage.getItem('token');
				const response = await fetch(
					`https://buyesi.onrender.com/api/admin/events/${id}`,
					{
						method: 'PUT',
						headers: {
							Authorization: token ? `Bearer ${token}` : '',
						},
						body: formData,
					}
				);
				return response.json();
			},
			delete: async (id) => {
				const token = localStorage.getItem('token');
				const response = await fetch(
					`https://buyesi.onrender.com/api/admin/events/${id}`,
					{
						method: 'DELETE',
						headers: {
							Authorization: token ? `Bearer ${token}` : '',
						},
					}
				);
				return response.json();
			},
		},
		galleryAPI: {
			getAll: async () => {
				const token = localStorage.getItem('token');
				const response = await fetch(
					'https://buyesi.onrender.com/api/admin/gallery',
					{
						headers: {
							Authorization: token ? `Bearer ${token}` : '',
						},
					}
				);
				return response.json();
			},
			getById: async (id) => {
				const token = localStorage.getItem('token');
				const response = await fetch(
					`https://buyesi.onrender.com/api/admin/gallery/${id}`,
					{
						headers: {
							Authorization: token ? `Bearer ${token}` : '',
						},
					}
				);
				return response.json();
			},
			create: async (formData) => {
				const token = localStorage.getItem('token');
				const response = await fetch(
					'https://buyesi.onrender.com/api/admin/gallery',
					{
						method: 'POST',
						headers: {
							Authorization: token ? `Bearer ${token}` : '',
						},
						body: formData,
					}
				);
				return response.json();
			},
			delete: async (id) => {
				const token = localStorage.getItem('token');
				const response = await fetch(
					`https://buyesi.onrender.com/api/admin/gallery/${id}`,
					{
						method: 'DELETE',
						headers: {
							Authorization: token ? `Bearer ${token}` : '',
						},
					}
				);
				return response.json();
			},
		},
	};
}

// Admin Dashboard Functions
class AdminDashboard {
	constructor() {
		// Initialize properties
		this.sections = {};
		this.activeSection = 'dashboard';

		// Get auth token
		this.authToken = localStorage.getItem('token');

		// Initialize the dashboard
		this.initialize();
	}

	async initialize() {
		// Check if user is logged in
		this.authToken = localStorage.getItem('token');

		if (!this.authToken) {
			window.location.href = 'login.html';
			return;
		}

		// Get current user
		this.currentUser = window.API.auth.getCurrentUser();

		// Set user info in the sidebar
		this.updateUserInfo();

		// Initialize event listeners
		this.initializeEventListeners();

		// Initialize file input previews
		this.initializeFileInputPreviews();

		// Load initial data
		await this.loadDashboardData();

		// Show dashboard section by default
		this.showSection('dashboard');
	}

	updateUserInfo() {
		if (this.currentUser) {
			$('#userName').text(
				this.currentUser.name || this.currentUser.email || 'Admin User'
			);
			// If user has avatar, set it
			if (this.currentUser.avatar) {
				$('#userAvatar').attr('src', this.currentUser.avatar);
			}
		}
	}

	initializeFileInputPreviews() {
		// This method is no longer needed for file inputs since we're using Cloudinary
		// Instead, we'll set up the upload buttons to show previews when images are selected

		// Add event listeners to the upload buttons
		const uploadButtons = [
			'uploadTeamImage',
			'uploadBlogImage',
			'uploadEventImage',
			'uploadGalleryImage',
			'uploadCauseImage',
		];

		uploadButtons.forEach((buttonId) => {
			const button = document.getElementById(buttonId);
			if (button) {
				button.addEventListener('click', () => {
					if (window.uploadImage) {
						window.uploadImage((error, url) => {
							if (!error && url) {
								// Get the container and form ID
								const container = button.closest('.image-upload-container');
								const hiddenInput = container.querySelector(
									'input[type="hidden"]'
								);
								const previewDiv = container.querySelector('.image-preview');

								// Update hidden input and show preview
								if (hiddenInput) hiddenInput.value = url;

								if (previewDiv) {
									previewDiv.style.display = 'block';
									previewDiv.innerHTML = `<img src="${url}" class="img-fluid" alt="Preview">`;
								}
							} else if (error) {
								console.error('Upload error:', error);
								this.showError('Image upload failed. Please try again.');
							}
						});
			} else {
						console.error('Cloudinary upload widget not available');
						this.showError(
							'Image upload service is not available. Please try again later.'
						);
					}
				});
			}
		});
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

		// Modal reset on close
		$('.modal').on('hidden.bs.modal', function () {
			const form = $(this).find('form');
			form[0].reset();
			$(this).find('.preview-image').hide();
			$(this)
				.find('.modal-title')
				.text($(this).find('.modal-title').text().replace('Edit', 'Add'));
		});

		// Bind 'this' to the class instance for all form handlers
		const self = this;

		// Team form submission
		$('#teamForm').submit(async function (e) {
			e.preventDefault();
			await self.handleTeamFormSubmit(this);
		});

		// Blog form submission
		$('#blogForm').submit(async function (e) {
			e.preventDefault();
			await self.handleBlogFormSubmit(this);
		});

		// Event form submission
		$('#eventForm').submit(async function (e) {
			e.preventDefault();
			await self.handleEventFormSubmit(this);
		});

		// Gallery form submission
		$('#galleryForm').submit(async function (e) {
			e.preventDefault();
			await self.handleGalleryFormSubmit(this);
		});

		// Cause form submission
		$('#causeForm').submit(async function (e) {
			e.preventDefault();
			await self.handleCauseFormSubmit(this);
		});

		// Event listeners for edit and delete buttons (delegated events)
		$(document).on('click', '.edit-blog', async (e) => {
			const id = $(e.target).data('id');
			await this.editBlogPost(id);
		});

		$(document).on('click', '.delete-blog', async (e) => {
			const id = $(e.target).data('id');
			await this.deleteBlogPost(id);
		});

		$(document).on('click', '.edit-event', async (e) => {
			const id = $(e.target).data('id');
			await this.editEvent(id);
		});

		$(document).on('click', '.delete-event', async (e) => {
			const id = $(e.target).data('id');
			await this.deleteEvent(id);
		});

		$(document).on('click', '.delete-gallery', async (e) => {
			const id = $(e.target).data('id');
			await this.deleteGalleryItem(id);
		});

		$(document).on('click', '.edit-cause', async (e) => {
			const id = $(e.target).data('id');
			await this.editCause(id);
		});

		$(document).on('click', '.delete-cause', async (e) => {
			const id = $(e.target).data('id');
			await this.deleteCause(id);
		});

		$(document).on('click', '.edit-team', async (e) => {
			const id = $(e.target).data('id');
			await this.editTeamMember(id);
		});

		$(document).on('click', '.delete-team', async (e) => {
			const id = $(e.target).data('id');
			await this.deleteTeamMember(id);
		});

		$(document).on('click', '.delete-volunteer', async (e) => {
			const id = $(e.target).data('id');
			await this.deleteVolunteer(id);
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
			let donations = [];
			try {
				const donationsResponse = await window.API.donationAPI.getAll();
				donations = Array.isArray(donationsResponse)
					? donationsResponse
					: donationsResponse.data || [];
			} catch (error) {
				console.error('Error loading donations:', error);
				this.showError('Failed to load donations data: ' + error.message);
			}
			$('#total-donations').text(donations.length);

			// Load volunteers
			let volunteers = [];
			try {
				const volunteersResponse = await window.API.volunteerAPI.getAll();
				volunteers = Array.isArray(volunteersResponse)
					? volunteersResponse
					: volunteersResponse.data || [];
			} catch (error) {
				console.error('Error loading volunteers:', error);
				this.showError('Failed to load volunteers data: ' + error.message);
			}
			$('#total-volunteers').text(volunteers.length);

			// Load causes
			let causes = [];
			try {
				const causesResponse = await window.API.causeAPI.getAll();
				causes = Array.isArray(causesResponse)
					? causesResponse
					: causesResponse.data || [];
			} catch (error) {
				console.error('Error loading causes:', error);
				this.showError('Failed to load causes data: ' + error.message);
			}
			$('#total-causes').text(causes.length);
		} catch (error) {
			console.error('Unexpected error loading dashboard data:', error);
			this.showError(
				'Unexpected error loading dashboard data: ' + error.message
			);
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

	// Team Management
	async handleTeamFormSubmit(form) {
		try {
			const formData = new FormData(form);
			const isEdit = $(form).data('edit');
			const id = $(form).data('id');

			// Validate required fields
			const name = formData.get('name');
			const position = formData.get('position');
			const image = formData.get('image');

			if (!name || !position) {
				this.showError('Name and Position are required fields');
				return;
			}

			// For new team members, image is required
			if (!isEdit && !image) {
				this.showError('Please upload an image');
				return;
			}

			// Create data object for the request
			const teamData = {
				name: formData.get('name'),
				position: formData.get('position'),
				description: formData.get('description') || '',
				email: formData.get('email') || '',
				phone: formData.get('phone') || '',
				image: formData.get('image'),
			};

			const token = this.getAuthToken();
			let response;

				if (isEdit) {
				// Update existing team member
				response = await fetch(
					`https://buyesi.onrender.com/api/admin/team/${id}`,
					{
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify(teamData),
					}
				);
							} else {
				// Create new team member
				response = await fetch('https://buyesi.onrender.com/api/admin/team', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(teamData),
				});
			}

			await this.handleApiResponse(
				response,
						`Team member ${isEdit ? 'updated' : 'added'} successfully`
					);

			// Reset form and close modal
			$(form).trigger('reset');
			$('.modal').modal('hide');

			// Reload team data
			await this.loadTeamData();
			} catch (error) {
			console.error('Error saving team member:', error);
			this.showError(error.message);
		}
	}

	async editTeamMember(id) {
		try {
			const response = await window.API.teamAPI.getById(id);
			const teamMember = response.data || response;

			const form = document.getElementById('teamForm');
			form.reset();

			// Fill in form fields
			form.elements['name'].value = teamMember.name || '';
			form.elements['position'].value = teamMember.position || '';
			form.elements['description'].value = teamMember.description || '';
			form.elements['email'].value = teamMember.email || '';
			form.elements['phone'].value = teamMember.phone || '';

			// Set form data attributes for edit mode
			$(form).data('edit', true).data('id', id);

			// Update modal title
			$('#teamModalLabel').text('Edit Team Member');

			// Show modal
			$('#teamModal').modal('show');
		} catch (error) {
			console.error('Error loading team member for edit:', error);
			this.showError('Failed to load team member data: ' + error.message);
		}
	}

	async deleteTeamMember(id) {
		if (confirm('Are you sure you want to delete this team member?')) {
			try {
				const response = await window.API.teamAPI.delete(id);

				if (response.success) {
					this.showSuccess('Team member deleted successfully');
					await this.loadTeamData();
				} else {
					this.showError(
						'Failed to delete team member: ' +
							(response.error || 'Unknown error')
					);
				}
			} catch (error) {
				console.error('Error deleting team member:', error);
				this.showError('Failed to delete team member: ' + error.message);
			}
		}
	}

	// Blog Management
	async handleBlogFormSubmit(form) {
		try {
			const formData = new FormData(form);
			const isEdit = $(form).data('edit');
			const id = $(form).data('id');

			// Validate required fields
			const title = formData.get('title');
			const content = formData.get('content');
			const imageUrl = formData.get('image');

			if (!title || !content) {
				this.showError('Title and Content are required fields');
				return;
			}

			// For new blog posts, image is required
			if (!isEdit && !imageUrl) {
				this.showError(
					'Featured Image is required. Please upload an image before submitting.'
				);
				// Highlight the image upload section
				$('#blogImageUpload').addClass('border border-danger p-2');
				setTimeout(() => {
					$('#blogImageUpload').removeClass('border border-danger p-2');
				}, 3000);
				return;
			}

			// Get current user for author field
			let authorId = '';
			try {
			const currentUser = window.API.auth.getCurrentUser();
				if (currentUser && currentUser._id) {
					authorId = currentUser._id;
				}
			} catch (e) {
				console.warn('Could not get current user, using empty author ID');
			}

			// Create data object for the request
			const blogData = {
				title: formData.get('title'),
				excerpt: formData.get('excerpt') || '',
				content: formData.get('content'),
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
				status: formData.get('status') || 'published',
				featured: form.elements['featured']
					? form.elements['featured'].checked
					: false,
				author: authorId,
				image: imageUrl, // This will be used directly in the backend
			};

			// Log the data being sent for debugging
			console.log('Sending blog data:', blogData);

			const token = this.getAuthToken();
			let response;

			// Use JSON format instead of FormData since we're sending a URL, not a file
				if (isEdit) {
				// Update existing blog post
				response = await fetch(
					`https://buyesi.onrender.com/api/admin/blog/${id}`,
					{
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify(blogData),
					}
				);
							} else {
				// Create new blog post
				response = await fetch('https://buyesi.onrender.com/api/admin/blog', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(blogData),
				});
			}

			await this.handleApiResponse(
				response,
						`Blog post ${isEdit ? 'updated' : 'added'} successfully`
					);

			// Reset form and close modal
			$(form).trigger('reset');
			$('.modal').modal('hide');

			// Reload blog data
			await this.loadBlogsData();
			} catch (error) {
			console.error('Error saving blog post:', error);
			this.showError(error.message);
		}
	}

	async editBlogPost(id) {
		try {
			const response = await window.API.blogAPI.getById(id);
			const blog = response.data || response;

			const form = document.getElementById('blogForm');
			form.reset();

			// Fill in form fields
			form.elements['title'].value = blog.title || '';
			form.elements['excerpt'].value = blog.excerpt || '';
			form.elements['content'].value = blog.content || '';
			form.elements['categories'].value = blog.categories
				? blog.categories.join(',')
				: '';
			form.elements['tags'].value = blog.tags ? blog.tags.join(',') : '';
			form.elements['status'].value = blog.status || 'draft';
			form.elements['featured'].checked = blog.featured || false;

			// Set form data attributes for edit mode
			$(form).data('edit', true).data('id', id);

			// Update modal title
			$('#blogModalLabel').text('Edit Blog Post');

			// Show modal
			$('#blogModal').modal('show');
		} catch (error) {
			console.error('Error loading blog post for edit:', error);
			this.showError('Failed to load blog post data: ' + error.message);
		}
	}

	async deleteBlogPost(id) {
		if (confirm('Are you sure you want to delete this blog post?')) {
			try {
				const response = await window.API.blogAPI.delete(id);

				if (response.success) {
					this.showSuccess('Blog post deleted successfully');
					await this.loadBlogsData();
				} else {
					this.showError(
						'Failed to delete blog post: ' + (response.error || 'Unknown error')
					);
				}
			} catch (error) {
				console.error('Error deleting blog post:', error);
				this.showError('Failed to delete blog post: ' + error.message);
			}
		}
	}

	// Event Management
	async handleEventFormSubmit(form) {
		try {
			const formData = new FormData(form);
			const isEdit = $(form).data('edit');
			const id = $(form).data('id');

			// Validate required fields
			const title = formData.get('title');
			const startDate = formData.get('startDate');
			const endDate = formData.get('endDate');
			const location = formData.get('location');
			const description = formData.get('description');
			const image = formData.get('image');

			if (!title || !startDate || !endDate || !location || !description) {
				this.showError('Please fill all required fields');
				return;
			}

			// For new events, image is required
			if (!isEdit && !image) {
				this.showError('Please upload an image');
				return;
			}

			// Create data object for the request
			const eventData = {
				title: formData.get('title'),
				startDate: formData.get('startDate'),
				endDate: formData.get('endDate'),
				location: formData.get('location'),
				address: formData.get('address') || '',
				description: formData.get('description'),
				organizer: formData.get('organizer'),
				status: formData.get('status'),
				featured: form.elements['eventFeatured'].checked,
				registrationRequired: form.elements['registrationRequired'].checked,
				maximumAttendees: parseInt(formData.get('maximumAttendees') || '0'),
				image: formData.get('image'),
			};

			const token = this.getAuthToken();
			let response;

				if (isEdit) {
				// Update existing event
				response = await fetch(
					`https://buyesi.onrender.com/api/admin/events/${id}`,
					{
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify(eventData),
					}
				);
							} else {
				// Create new event
				response = await fetch('https://buyesi.onrender.com/api/admin/events', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(eventData),
				});
			}

			await this.handleApiResponse(
				response,
						`Event ${isEdit ? 'updated' : 'added'} successfully`
					);

			// Reset form and close modal
			$(form).trigger('reset');
			$('.modal').modal('hide');

			// Reload events data
			await this.loadEventsData();
			} catch (error) {
			console.error('Error saving event:', error);
			this.showError(error.message);
		}
	}

	async editEvent(id) {
		try {
			const response = await window.API.eventAPI.getById(id);
			const event = response.data || response;

			const form = document.getElementById('eventForm');
			form.reset();

			// Format dates for datetime-local input
			const startDate = new Date(event.startDate || event.date);
			const endDate = new Date(event.endDate || event.date);

			const formatDateForInput = (date) => {
				return date.toISOString().slice(0, 16);
			};

			// Fill in form fields
			form.elements['title'].value = event.title || '';
			form.elements['startDate'].value = formatDateForInput(startDate);
			form.elements['endDate'].value = formatDateForInput(endDate);
			form.elements['location'].value = event.location || '';
			form.elements['address'].value = event.address || '';
			form.elements['description'].value = event.description || '';
			form.elements['organizer'].value =
				event.organizer || 'Buyesi Youth Initiative';
			form.elements['status'].value = event.status || 'upcoming';
			form.elements['maximumAttendees'].value = event.maximumAttendees || 0;
			form.elements['featured'].checked = event.featured || false;
			form.elements['registrationRequired'].checked =
				event.registrationRequired || false;

			// Set form data attributes for edit mode
			$(form).data('edit', true).data('id', id);

			// Update modal title
			$('#eventModalLabel').text('Edit Event');

			// Show modal
			$('#eventModal').modal('show');
		} catch (error) {
			console.error('Error loading event for edit:', error);
			this.showError('Failed to load event data: ' + error.message);
		}
	}

	async deleteEvent(id) {
		if (confirm('Are you sure you want to delete this event?')) {
			try {
				const response = await window.API.eventAPI.delete(id);

				if (response.success) {
					this.showSuccess('Event deleted successfully');
					await this.loadEventsData();
				} else {
					this.showError(
						'Failed to delete event: ' + (response.error || 'Unknown error')
					);
				}
			} catch (error) {
				console.error('Error deleting event:', error);
				this.showError('Failed to delete event: ' + error.message);
			}
		}
	}

	// Gallery Management
	async handleGalleryFormSubmit(form) {
		try {
			const formData = new FormData(form);

			// Validate required fields
			const title = formData.get('title');
			const description = formData.get('description');
			const image = formData.get('image');

			if (!title || !description) {
				this.showError('Title and Description are required fields');
				return;
			}

			// Image is required
			if (!image) {
				this.showError('Please upload an image');
				return;
			}

			// Create data object for the request
			const galleryData = {
				title: formData.get('title'),
				description: formData.get('description'),
				image: formData.get('image'),
			};

			const token = this.getAuthToken();
			let response = await fetch(
				'https://buyesi.onrender.com/api/admin/gallery',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(galleryData),
				}
			);

			await this.handleApiResponse(
				response,
				'Gallery image added successfully'
			);

			// Reset form and close modal
			$(form).trigger('reset');
			$('.modal').modal('hide');

			// Reload gallery data
					await this.loadGalleryData();
			} catch (error) {
			console.error('Error saving gallery image:', error);
			this.showError(error.message);
		}
	}

	async deleteGalleryItem(id) {
		if (confirm('Are you sure you want to delete this gallery item?')) {
			try {
				const response = await window.API.galleryAPI.delete(id);

				if (response.success) {
					this.showSuccess('Gallery item deleted successfully');
					await this.loadGalleryData();
				} else {
					this.showError(
						'Failed to delete gallery item: ' +
							(response.error || 'Unknown error')
					);
				}
			} catch (error) {
				console.error('Error deleting gallery item:', error);
				this.showError('Failed to delete gallery item: ' + error.message);
			}
		}
	}

	// Cause Management
	async handleCauseFormSubmit(form) {
		try {
			const formData = new FormData(form);

			// Validate required fields
			const title = formData.get('title');
			const description = formData.get('description');
			const targetAmount = parseFloat(formData.get('targetAmount'));
			const image = formData.get('image');

			if (!title || !description || isNaN(targetAmount)) {
				this.showError(
					'Title, Description, and Target Amount are required fields'
				);
				return;
			}

			// Image is required
			if (!image) {
				this.showError('Please upload an image');
				return;
			}

			// Create data object for the request
			const causeData = {
				title: formData.get('title'),
				description: formData.get('description'),
				targetAmount: parseFloat(formData.get('targetAmount')),
				raisedAmount: parseFloat(formData.get('raisedAmount') || '0'),
				image: formData.get('image'),
			};

			const token = this.getAuthToken();
			let response = await fetch(
				'https://buyesi.onrender.com/api/admin/causes',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(causeData),
				}
			);

			await this.handleApiResponse(response, 'Cause added successfully');

			// Reset form and close modal
			$(form).trigger('reset');
			$('.modal').modal('hide');

			// Reload causes data
					await this.loadCausesData();
			} catch (error) {
			console.error('Error saving cause:', error);
			this.showError(error.message);
		}
	}

	async editCause(id) {
		try {
			const response = await window.API.causeAPI.getById(id);
			const cause = response.data || response;

			const form = document.getElementById('causeForm');
			form.reset();

			// Fill in form fields
			form.elements['title'].value = cause.title || '';
			form.elements['description'].value = cause.description || '';
			form.elements['targetAmount'].value = cause.targetAmount || 0;
			form.elements['raisedAmount'].value = cause.raisedAmount || 0;

			// Set form data attributes for edit mode
			$(form).data('edit', true).data('id', id);

			// Update modal title
			$('#causeModalLabel').text('Edit Cause');

			// Show modal
			$('#causeModal').modal('show');
		} catch (error) {
			console.error('Error loading cause for edit:', error);
			this.showError('Failed to load cause data: ' + error.message);
		}
	}

	async deleteCause(id) {
		if (confirm('Are you sure you want to delete this cause?')) {
			try {
				const response = await window.API.causeAPI.delete(id);

				if (response.success) {
					this.showSuccess('Cause deleted successfully');
					await this.loadCausesData();
				} else {
					this.showError(
						'Failed to delete cause: ' + (response.error || 'Unknown error')
					);
				}
			} catch (error) {
				console.error('Error deleting cause:', error);
				this.showError('Failed to delete cause: ' + error.message);
			}
		}
	}

	// Volunteer Management
	async deleteVolunteer(id) {
		if (confirm('Are you sure you want to delete this volunteer?')) {
			try {
				const response = await window.API.volunteerAPI.delete(id);

				if (response.success) {
					this.showSuccess('Volunteer deleted successfully');
					await this.loadVolunteersData();
				} else {
					this.showError(
						'Failed to delete volunteer: ' + (response.error || 'Unknown error')
					);
				}
			} catch (error) {
				console.error('Error deleting volunteer:', error);
				this.showError('Failed to delete volunteer: ' + error.message);
			}
		}
	}

	// Utility functions
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

	// Data loading methods
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
								? `https://buyesi.onrender.com${member.image}`
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

			if (blogs.length === 0) {
				tbody.append(
					'<tr><td colspan="3" class="text-center">No blog posts found</td></tr>'
				);
				return;
			}

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

			if (events.length === 0) {
				tbody.append(
					'<tr><td colspan="4" class="text-center">No events found</td></tr>'
				);
				return;
			}

			events.forEach((event, index) => {
				console.log(`Rendering event ${index}:`, event);
				tbody.append(`
					<tr>
						<td>${event.title}</td>
						<td>${new Date(event.startDate || event.date).toLocaleDateString()}</td>
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

			if (gallery.length === 0) {
				grid.append(
					'<div class="col-12 text-center">No gallery items found</div>'
				);
				return;
			}

			gallery.forEach((image, index) => {
				console.log(`Rendering gallery item ${index}:`, image);
				grid.append(`
					<div class="col-md-4 mb-4">
						<div class="card">
							<img src="${
								image.url || `https://buyesi.onrender.com${image.image}`
							}" class="card-img-top" alt="${image.title || 'Gallery image'}">
							<div class="card-body">
								<h5 class="card-title">${image.title || 'Untitled'}</h5>
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

			if (causes.length === 0) {
				tbody.append(
					'<tr><td colspan="4" class="text-center">No causes found</td></tr>'
				);
				return;
			}

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

			if (donations.length === 0) {
				tbody.append(
					'<tr><td colspan="4" class="text-center">No donations found</td></tr>'
				);
				return;
			}

			donations.forEach((donation) => {
				tbody.append(`
					<tr>
						<td>${donation.donorName}</td>
						<td>$${donation.amount}</td>
						<td>${new Date(donation.date).toLocaleDateString()}</td>
						<td>${donation.causeTitle || 'General Donation'}</td>
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

			if (volunteers.length === 0) {
				tbody.append(
					'<tr><td colspan="5" class="text-center">No volunteers found</td></tr>'
				);
				return;
			}

			volunteers.forEach((volunteer) => {
				tbody.append(`
					<tr>
						<td>${volunteer.name}</td>
						<td>${volunteer.email}</td>
						<td>${volunteer.phone || 'N/A'}</td>
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

	// Add a helper method to get the current auth token
	getAuthToken() {
		// Always get the latest token from localStorage
		return localStorage.getItem('token');
	}

	// Add a helper method to handle API responses
	async handleApiResponse(response, successMessage) {
		if (!response.ok) {
			let errorMessage = 'An error occurred';
			try {
				const errorData = await response.json();
				errorMessage = errorData.message || errorData.error || errorMessage;
				console.error('API error response:', errorData);
			} catch (e) {
				console.error('Error parsing error response:', e);
				errorMessage = `Server returned status ${response.status}: ${response.statusText}`;
			}
			throw new Error(errorMessage);
		}

		if (successMessage) {
			this.showSuccess(successMessage);
		}

		try {
			return await response.json();
		} catch (e) {
			console.warn('Empty or invalid JSON response, returning empty object');
			return {};
		}
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
