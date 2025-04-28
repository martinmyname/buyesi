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
		this.currentUser = null;
		this.initialize();
	}

	async initialize() {
		// Check authentication
		if (!window.API.auth.isAuthenticated()) {
			try {
				// Attempt to check if auth endpoint is available
				const response = await fetch('https://buyesi.onrender.com/auth/check', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				});
				if (!response.ok && response.status === 404) {
					console.error('Authentication endpoint not found.');
					alert(
						'Authentication system is currently unavailable. Please contact support.'
					);
				}
			} catch (error) {
				console.error('Error checking auth endpoint:', error);
				alert(
					'Unable to connect to authentication system. Please try again later.'
				);
			}
			window.location.href = 'login.html';
			return;
		}

		// Get current user
		this.currentUser = window.API.auth.getCurrentUser();

		// Set user info in the sidebar
		this.updateUserInfo();

		// Initialize event listeners
		this.initializeEventListeners();

		// Initialize file input preview
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
		// Add event listeners to all file inputs to show image previews
		$('input[type="file"][accept*="image"]').change(function () {
			const preview = $(this).siblings('.preview-image');
			const file = this.files[0];

			if (file) {
				const reader = new FileReader();
				reader.onload = function (e) {
					preview.attr('src', e.target.result);
					preview.show();
				};
				reader.readAsDataURL(file);
			} else {
				preview.hide();
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
			if (!isEdit && (!image || image.name === '')) {
				this.showError('Please select an image file');
				return;
			}

			// Create FormData object for the request
			const actualFormData = new FormData();

			// Add all text fields
			actualFormData.append('name', formData.get('name'));
			actualFormData.append('position', formData.get('position'));
			actualFormData.append('description', formData.get('description') || '');
			actualFormData.append('email', formData.get('email') || '');
			actualFormData.append('phone', formData.get('phone') || '');

			// Add image if present
			if (image && image.name !== '') {
				actualFormData.append('image', image);
			}

			// Log the FormData contents for debugging
			console.log('FormData contents:');
			for (let pair of actualFormData.entries()) {
				console.log(pair[0] + ': ' + pair[1]);
			}

			let response;
			try {
				// Use XMLHttpRequest to send form data
				if (isEdit) {
					response = await new Promise((resolve, reject) => {
						const xhr = new XMLHttpRequest();
						xhr.open('PUT', `https://buyesi.onrender.com/api/admin/team/${id}`);
						const token = localStorage.getItem('token');
						if (token) {
							xhr.setRequestHeader('Authorization', `Bearer ${token}`);
						}
						xhr.onload = () => {
							if (xhr.status >= 200 && xhr.status < 300) {
								try {
									resolve(JSON.parse(xhr.responseText));
								} catch (e) {
									resolve({ success: true });
								}
							} else {
								// Log the error response for debugging
								console.error('Server response:', xhr.responseText);
								reject(new Error(`HTTP error! status: ${xhr.status}`));
							}
						};
						xhr.onerror = () => reject(new Error('Network error'));
						xhr.send(actualFormData);
					});
				} else {
					response = await new Promise((resolve, reject) => {
						const xhr = new XMLHttpRequest();
						xhr.open('POST', 'https://buyesi.onrender.com/api/admin/team');
						const token = localStorage.getItem('token');
						if (token) {
							xhr.setRequestHeader('Authorization', `Bearer ${token}`);
						}
						xhr.onload = () => {
							if (xhr.status >= 200 && xhr.status < 300) {
								try {
									resolve(JSON.parse(xhr.responseText));
								} catch (e) {
									resolve({ success: true });
								}
							} else {
								// Log the error response for debugging
								console.error('Server response:', xhr.responseText);
								reject(new Error(`HTTP error! status: ${xhr.status}`));
							}
						};
						xhr.onerror = () => reject(new Error('Network error'));
						xhr.send(actualFormData);
					});
				}

				console.log('Team submission response:', response);

				if (response.success || response._id) {
					$('#teamModal').modal('hide');
					form.reset();
					$(form).removeData('edit').removeData('id');
					await this.loadTeamData();
					this.showSuccess(
						`Team member ${isEdit ? 'updated' : 'added'} successfully`
					);
				} else {
					this.showError(
						`Failed to ${isEdit ? 'update' : 'add'} team member: ${
							response.error || 'Unknown error'
						}`
					);
				}
			} catch (error) {
				console.error('Error handling team form:', error);
				this.showError(`Failed to save team member: ${error.message}`);
			}
		} catch (error) {
			console.error('Error handling team form:', error);
			this.showError(`Failed to save team member: ${error.message}`);
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
			const image = formData.get('image');

			if (!title || !content) {
				this.showError('Title and Content are required fields');
				return;
			}

			// For new blog posts, image is required
			if (!isEdit && (!image || image.name === '')) {
				this.showError('Please select an image file');
				return;
			}

			// Get current user for author field
			const currentUser = window.API.auth.getCurrentUser();
			if (!currentUser) {
				this.showError('User information not found. Please log in again.');
				return;
			}

			// Create FormData object for the request
			const actualFormData = new FormData();

			// Add all text fields
			actualFormData.append('title', formData.get('title'));
			actualFormData.append('excerpt', formData.get('excerpt'));
			actualFormData.append('content', formData.get('content'));
			actualFormData.append('categories', formData.get('categories'));
			actualFormData.append('tags', formData.get('tags'));
			actualFormData.append('status', formData.get('status'));
			actualFormData.append('featured', form.elements['featured'].checked);
			actualFormData.append('author', currentUser._id); // Add author field

			// Add image if present
			if (image && image.name !== '') {
				actualFormData.append('image', image);
			}

			// Log the FormData contents for debugging
			console.log('FormData contents:');
			for (let pair of actualFormData.entries()) {
				console.log(pair[0] + ': ' + pair[1]);
			}

			let response;
			try {
				// Use XMLHttpRequest to send form data
				if (isEdit) {
					response = await new Promise((resolve, reject) => {
						const xhr = new XMLHttpRequest();
						xhr.open('PUT', `https://buyesi.onrender.com/api/admin/blog/${id}`);
						const token = localStorage.getItem('token');
						if (token) {
							xhr.setRequestHeader('Authorization', `Bearer ${token}`);
						}
						xhr.onload = () => {
							if (xhr.status >= 200 && xhr.status < 300) {
								try {
									resolve(JSON.parse(xhr.responseText));
								} catch (e) {
									resolve({ success: true });
								}
							} else {
								// Log the error response for debugging
								console.error('Server response:', xhr.responseText);
								reject(new Error(`HTTP error! status: ${xhr.status}`));
							}
						};
						xhr.onerror = () => reject(new Error('Network error'));
						xhr.send(actualFormData);
					});
				} else {
					response = await new Promise((resolve, reject) => {
						const xhr = new XMLHttpRequest();
						xhr.open('POST', 'https://buyesi.onrender.com/api/admin/blog');
						const token = localStorage.getItem('token');
						if (token) {
							xhr.setRequestHeader('Authorization', `Bearer ${token}`);
						}
						xhr.onload = () => {
							if (xhr.status >= 200 && xhr.status < 300) {
								try {
									resolve(JSON.parse(xhr.responseText));
								} catch (e) {
									resolve({ success: true });
								}
							} else {
								// Log the error response for debugging
								console.error('Server response:', xhr.responseText);
								reject(new Error(`HTTP error! status: ${xhr.status}`));
							}
						};
						xhr.onerror = () => reject(new Error('Network error'));
						xhr.send(actualFormData);
					});
				}

				console.log('Blog submission response:', response);

				if (response.success || response._id) {
					$('#blogModal').modal('hide');
					form.reset();
					$(form).removeData('edit').removeData('id');
					await this.loadBlogsData();
					this.showSuccess(
						`Blog post ${isEdit ? 'updated' : 'added'} successfully`
					);
				} else {
					this.showError(
						`Failed to ${isEdit ? 'update' : 'add'} blog post: ${
							response.error || 'Unknown error'
						}`
					);
				}
			} catch (error) {
				console.error('Error handling blog form:', error);
				this.showError(`Failed to save blog post: ${error.message}`);
			}
		} catch (error) {
			console.error('Error handling blog form:', error);
			this.showError(`Failed to save blog post: ${error.message}`);
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
				this.showError(
					'Title, Start Date, End Date, Location, and Description are required fields'
				);
				return;
			}

			// For new events, image is required
			if (!isEdit && (!image || image.name === '')) {
				this.showError('Please select an image file');
				return;
			}

			// Create FormData object for the request
			const actualFormData = new FormData();

			// Add all text fields
			actualFormData.append('title', formData.get('title'));
			actualFormData.append('startDate', formData.get('startDate'));
			actualFormData.append('endDate', formData.get('endDate'));
			actualFormData.append('location', formData.get('location'));
			actualFormData.append('address', formData.get('address') || '');
			actualFormData.append('description', formData.get('description'));
			actualFormData.append(
				'organizer',
				formData.get('organizer') || 'Buyesi Youth Initiative'
			);
			actualFormData.append('status', formData.get('status'));
			actualFormData.append(
				'maximumAttendees',
				formData.get('maximumAttendees') || '0'
			);
			actualFormData.append('featured', form.elements['featured'].checked);
			actualFormData.append(
				'registrationRequired',
				form.elements['registrationRequired'].checked
			);

			// Add image if present
			if (image && image.name !== '') {
				actualFormData.append('image', image);
			}

			// Log the FormData contents for debugging
			console.log('FormData contents:');
			for (let pair of actualFormData.entries()) {
				console.log(pair[0] + ': ' + pair[1]);
			}

			let response;
			try {
				// Use XMLHttpRequest to send form data
				if (isEdit) {
					response = await new Promise((resolve, reject) => {
						const xhr = new XMLHttpRequest();
						xhr.open(
							'PUT',
							`https://buyesi.onrender.com/api/admin/events/${id}`
						);
						const token = localStorage.getItem('token');
						if (token) {
							xhr.setRequestHeader('Authorization', `Bearer ${token}`);
						}
						xhr.onload = () => {
							if (xhr.status >= 200 && xhr.status < 300) {
								try {
									resolve(JSON.parse(xhr.responseText));
								} catch (e) {
									resolve({ success: true });
								}
							} else {
								// Log the error response for debugging
								console.error('Server response:', xhr.responseText);
								reject(new Error(`HTTP error! status: ${xhr.status}`));
							}
						};
						xhr.onerror = () => reject(new Error('Network error'));
						xhr.send(actualFormData);
					});
				} else {
					response = await new Promise((resolve, reject) => {
						const xhr = new XMLHttpRequest();
						xhr.open('POST', 'https://buyesi.onrender.com/api/admin/events');
						const token = localStorage.getItem('token');
						if (token) {
							xhr.setRequestHeader('Authorization', `Bearer ${token}`);
						}
						xhr.onload = () => {
							if (xhr.status >= 200 && xhr.status < 300) {
								try {
									resolve(JSON.parse(xhr.responseText));
								} catch (e) {
									resolve({ success: true });
								}
							} else {
								// Log the error response for debugging
								console.error('Server response:', xhr.responseText);
								reject(new Error(`HTTP error! status: ${xhr.status}`));
							}
						};
						xhr.onerror = () => reject(new Error('Network error'));
						xhr.send(actualFormData);
					});
				}

				console.log('Event submission response:', response);

				if (response.success || response._id) {
					$('#eventModal').modal('hide');
					form.reset();
					$(form).removeData('edit').removeData('id');
					await this.loadEventsData();
					this.showSuccess(
						`Event ${isEdit ? 'updated' : 'added'} successfully`
					);
				} else {
					this.showError(
						`Failed to ${isEdit ? 'update' : 'add'} event: ${
							response.error || 'Unknown error'
						}`
					);
				}
			} catch (error) {
				console.error('Error handling event form:', error);
				this.showError(`Failed to save event: ${error.message}`);
			}
		} catch (error) {
			console.error('Error handling event form:', error);
			this.showError(`Failed to save event: ${error.message}`);
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
			if (!image || image.name === '') {
				this.showError('Please select an image file');
				return;
			}

			// Create FormData object for the request
			const actualFormData = new FormData();

			// Add all text fields
			actualFormData.append('title', formData.get('title'));
			actualFormData.append('description', formData.get('description'));

			// Add image
			actualFormData.append('image', image);

			// Log the FormData contents for debugging
			console.log('FormData contents:');
			for (let pair of actualFormData.entries()) {
				console.log(pair[0] + ': ' + pair[1]);
			}

			let response;
			try {
				// Use XMLHttpRequest to send form data
				response = await new Promise((resolve, reject) => {
					const xhr = new XMLHttpRequest();
					xhr.open('POST', 'https://buyesi.onrender.com/api/admin/gallery');
					const token = localStorage.getItem('token');
					if (token) {
						xhr.setRequestHeader('Authorization', `Bearer ${token}`);
					}
					xhr.onload = () => {
						if (xhr.status >= 200 && xhr.status < 300) {
							try {
								resolve(JSON.parse(xhr.responseText));
							} catch (e) {
								resolve({ success: true });
							}
						} else {
							// Log the error response for debugging
							console.error('Server response:', xhr.responseText);
							reject(new Error(`HTTP error! status: ${xhr.status}`));
						}
					};
					xhr.onerror = () => reject(new Error('Network error'));
					xhr.send(actualFormData);
				});

				console.log('Gallery submission response:', response);

				if (response.success || response._id) {
					$('#galleryModal').modal('hide');
					form.reset();
					await this.loadGalleryData();
					this.showSuccess('Gallery item added successfully');
				} else {
					this.showError(
						`Failed to add gallery item: ${response.error || 'Unknown error'}`
					);
				}
			} catch (error) {
				console.error('Error handling gallery form:', error);
				this.showError(`Failed to save gallery item: ${error.message}`);
			}
		} catch (error) {
			console.error('Error handling gallery form:', error);
			this.showError(`Failed to save gallery item: ${error.message}`);
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
			const isEdit = $(form).data('edit');
			const id = $(form).data('id');

			// Validate required fields
			const title = formData.get('title');
			const description = formData.get('description');
			const targetAmount = formData.get('targetAmount');
			const image = formData.get('image');

			if (!title || !description || !targetAmount) {
				this.showError(
					'Title, Description, and Target Amount are required fields'
				);
				return;
			}

			// For new causes, image is required
			if (!isEdit && (!image || image.name === '')) {
				this.showError('Please select an image file');
				return;
			}

			// Create FormData object for the request
			const actualFormData = new FormData();

			// Add all text fields
			actualFormData.append('title', formData.get('title'));
			actualFormData.append('description', formData.get('description'));
			actualFormData.append('targetAmount', formData.get('targetAmount'));
			actualFormData.append(
				'raisedAmount',
				formData.get('raisedAmount') || '0'
			);

			// Add image if present
			if (image && image.name !== '') {
				actualFormData.append('image', image);
			}

			// Log the FormData contents for debugging
			console.log('FormData contents:');
			for (let pair of actualFormData.entries()) {
				console.log(pair[0] + ': ' + pair[1]);
			}

			let response;
			try {
				// Use XMLHttpRequest to send form data
				if (isEdit) {
					response = await new Promise((resolve, reject) => {
						const xhr = new XMLHttpRequest();
						xhr.open(
							'PUT',
							`https://buyesi.onrender.com/api/admin/causes/${id}`
						);
						const token = localStorage.getItem('token');
						if (token) {
							xhr.setRequestHeader('Authorization', `Bearer ${token}`);
						}
						xhr.onload = () => {
							if (xhr.status >= 200 && xhr.status < 300) {
								try {
									resolve(JSON.parse(xhr.responseText));
								} catch (e) {
									resolve({ success: true });
								}
							} else {
								// Log the error response for debugging
								console.error('Server response:', xhr.responseText);
								reject(new Error(`HTTP error! status: ${xhr.status}`));
							}
						};
						xhr.onerror = () => reject(new Error('Network error'));
						xhr.send(actualFormData);
					});
				} else {
					response = await new Promise((resolve, reject) => {
						const xhr = new XMLHttpRequest();
						xhr.open('POST', 'https://buyesi.onrender.com/api/admin/causes');
						const token = localStorage.getItem('token');
						if (token) {
							xhr.setRequestHeader('Authorization', `Bearer ${token}`);
						}
						xhr.onload = () => {
							if (xhr.status >= 200 && xhr.status < 300) {
								try {
									resolve(JSON.parse(xhr.responseText));
								} catch (e) {
									resolve({ success: true });
								}
							} else {
								// Log the error response for debugging
								console.error('Server response:', xhr.responseText);
								reject(new Error(`HTTP error! status: ${xhr.status}`));
							}
						};
						xhr.onerror = () => reject(new Error('Network error'));
						xhr.send(actualFormData);
					});
				}

				console.log('Cause submission response:', response);

				if (response.success || response._id) {
					$('#causeModal').modal('hide');
					form.reset();
					$(form).removeData('edit').removeData('id');
					await this.loadCausesData();
					this.showSuccess(
						`Cause ${isEdit ? 'updated' : 'added'} successfully`
					);
				} else {
					this.showError(
						`Failed to ${isEdit ? 'update' : 'add'} cause: ${
							response.error || 'Unknown error'
						}`
					);
				}
			} catch (error) {
				console.error('Error handling cause form:', error);
				this.showError(`Failed to save cause: ${error.message}`);
			}
		} catch (error) {
			console.error('Error handling cause form:', error);
			this.showError(`Failed to save cause: ${error.message}`);
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

	convertFileToBase64(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
		});
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
