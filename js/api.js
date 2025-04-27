const API_BASE_URL =
	window.location.hostname === 'localhost' ||
	window.location.hostname === '127.0.0.1'
		? 'http://localhost:5000/api'
		: 'https://buyesi.onrender.com/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
	console.log(`API Response from ${response.url}:`, {
		status: response.status,
		statusText: response.statusText,
	});

	// For volunteer registration, handle 500 errors differently if they're email related
	const isVolunteerRegistration =
		response.url.endsWith('/volunteers') && response.request?.method === 'POST';

	if (!response.ok) {
		try {
			const contentType = response.headers.get('content-type');
			if (contentType && contentType.includes('application/json')) {
				const error = await response.json();
				console.error('API Error:', error);

				// For volunteer registration with email errors, signal a special type of error
				if (
					isVolunteerRegistration &&
					error.message &&
					(error.message.includes('email') ||
						error.message.includes('mail') ||
						error.message.includes('login') ||
						error.message.includes('smtp'))
				) {
					// Modify the error message to indicate that the volunteer was registered
					// but we couldn't send the email
					throw new Error(
						'EMAIL_ERROR:' +
							(error.message || 'Failed to send email notification')
					);
				}

				throw new Error(error.message || 'Something went wrong');
			} else {
				// Non-JSON response
				const text = await response.text();
				console.error(
					'Non-JSON response received:',
					text.slice(0, 100) + (text.length > 100 ? '...' : '')
				);
				if (response.status === 404 && response.url.includes('/auth/')) {
					throw new Error(
						'Authentication endpoint not found on the server. Please check backend configuration.'
					);
				} else {
					throw new Error(
						`HTTP error ${response.status}: ${response.statusText}`
					);
				}
			}
		} catch (e) {
			console.error('Error parsing error response:', e);
			throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
		}
	}

	try {
		const contentType = response.headers.get('content-type');
		if (contentType && contentType.includes('application/json')) {
			const data = await response.json();
			console.log('API Response Data Structure:', {
				hasData: data.hasOwnProperty('data'),
				dataType: data.data ? typeof data.data : 'undefined',
				isArray: data.data ? Array.isArray(data.data) : false,
				length:
					data.data && Array.isArray(data.data) ? data.data.length : 'N/A',
				fullResponse: data,
			});
			return data;
		} else {
			// Non-JSON response for successful request
			const text = await response.text();
			console.log(
				'Non-JSON response for successful request:',
				text.slice(0, 100) + (text.length > 100 ? '...' : '')
			);
			throw new Error('Expected JSON response but received non-JSON content');
		}
	} catch (e) {
		console.error('Error parsing JSON response:', e);
		throw new Error('Failed to parse response data');
	}
};

// Auth API
const authAPI = {
	login: async (email, password) => {
		const response = await fetch(`${API_BASE_URL}/auth/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, password }),
		});
		return handleResponse(response);
	},

	register: async (userData) => {
		const response = await fetch(`${API_BASE_URL}/auth/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(userData),
		});
		return handleResponse(response);
	},

	logout: () => {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
	},

	getCurrentUser: () => {
		return JSON.parse(localStorage.getItem('user'));
	},

	isAuthenticated: () => {
		return !!localStorage.getItem('token');
	},
};

// Donation API
const donationAPI = {
	create: async (donationData) => {
		const response = await fetch(`${API_BASE_URL}/donations`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(donationData),
		});
		return handleResponse(response);
	},

	getAll: async () => {
		const token = localStorage.getItem('token');
		const response = await fetch(`${API_BASE_URL}/donations`, {
			method: 'GET',
			headers: {
				Authorization: token ? `Bearer ${token}` : '',
			},
		});
		return handleResponse(response);
	},
};

// Contact API
const contactAPI = {
	sendMessage: async (messageData) => {
		const response = await fetch(`${API_BASE_URL}/contact`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(messageData),
		});
		return handleResponse(response);
	},
};

// Volunteer API
const volunteerAPI = {
	register: async (volunteerData) => {
		const response = await fetch(`${API_BASE_URL}/volunteers`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(volunteerData),
		});
		return handleResponse(response);
	},

	getAll: async () => {
		const token = localStorage.getItem('token');
		const response = await fetch(`${API_BASE_URL}/volunteers`, {
			method: 'GET',
			headers: {
				Authorization: token ? `Bearer ${token}` : '',
			},
		});
		return handleResponse(response);
	},

	getById: async (id) => {
		const token = localStorage.getItem('token');
		const response = await fetch(`${API_BASE_URL}/volunteers/${id}`, {
			method: 'GET',
			headers: {
				Authorization: token ? `Bearer ${token}` : '',
			},
		});
		return handleResponse(response);
	},

	update: async (id, volunteerData) => {
		const token = localStorage.getItem('token');
		const response = await fetch(`${API_BASE_URL}/volunteers/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: token ? `Bearer ${token}` : '',
			},
			body: JSON.stringify(volunteerData),
		});
		return handleResponse(response);
	},

	delete: async (id) => {
		const token = localStorage.getItem('token');
		const response = await fetch(`${API_BASE_URL}/volunteers/${id}`, {
			method: 'DELETE',
			headers: {
				Authorization: token ? `Bearer ${token}` : '',
			},
		});
		return handleResponse(response);
	},
};

// Event API
const eventAPI = {
	getAll: async () => {
		const token = localStorage.getItem('token');
		const response = await fetch(`${API_BASE_URL}/events`, {
			method: 'GET',
			headers: {
				Authorization: token ? `Bearer ${token}` : '',
			},
		});
		return handleResponse(response);
	},

	getById: async (id) => {
		const response = await fetch(`${API_BASE_URL}/events/${id}`);
		return handleResponse(response);
	},

	create: async (formData) => {
		const token = localStorage.getItem('token');
		const response = await fetch(`${API_BASE_URL}/events`, {
			method: 'POST',
			headers: {
				Authorization: token ? `Bearer ${token}` : '',
			},
			body: formData,
		});
		return handleResponse(response);
	},

	update: async (id, formData) => {
		const token = localStorage.getItem('token');
		const response = await fetch(`${API_BASE_URL}/events/${id}`, {
			method: 'PUT',
			headers: {
				Authorization: token ? `Bearer ${token}` : '',
			},
			body: formData,
		});
		return handleResponse(response);
	},

	delete: async (id) => {
		const token = localStorage.getItem('token');
		const response = await fetch(`${API_BASE_URL}/events/${id}`, {
			method: 'DELETE',
			headers: {
				Authorization: token ? `Bearer ${token}` : '',
			},
		});
		return handleResponse(response);
	},
};

// Cause API
const causeAPI = {
	getAll: async () => {
		const response = await fetch(`${API_BASE_URL}/causes`);
		return handleResponse(response);
	},

	getById: async (id) => {
		const response = await fetch(`${API_BASE_URL}/causes/${id}`);
		return handleResponse(response);
	},

	create: async (formData) => {
		const token = localStorage.getItem('token');
		const response = await fetch(`${API_BASE_URL}/causes`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: token ? `Bearer ${token}` : '',
			},
			body: JSON.stringify(formData),
		});
		return handleResponse(response);
	},

	update: async (id, formData) => {
		const token = localStorage.getItem('token');
		const response = await fetch(`${API_BASE_URL}/causes/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: token ? `Bearer ${token}` : '',
			},
			body: JSON.stringify(formData),
		});
		return handleResponse(response);
	},

	delete: async (id) => {
		const token = localStorage.getItem('token');
		const response = await fetch(`${API_BASE_URL}/causes/${id}`, {
			method: 'DELETE',
			headers: {
				Authorization: token ? `Bearer ${token}` : '',
			},
		});
		return handleResponse(response);
	},
};

// Blog API
const blogAPI = {
	getAll: async () => {
		const response = await fetch(`${API_BASE_URL}/blogs`);
		return handleResponse(response);
	},

	getById: async (id) => {
		const response = await fetch(`${API_BASE_URL}/blogs/${id}`);
		return handleResponse(response);
	},

	create: async (formData) => {
		const token = localStorage.getItem('token');
		const response = await fetch(`${API_BASE_URL}/blogs`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: token ? `Bearer ${token}` : '',
			},
			body: JSON.stringify(formData),
		});
		return handleResponse(response);
	},

	update: async (id, formData) => {
		const token = localStorage.getItem('token');
		const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: token ? `Bearer ${token}` : '',
			},
			body: JSON.stringify(formData),
		});
		return handleResponse(response);
	},

	delete: async (id) => {
		const token = localStorage.getItem('token');
		const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
			method: 'DELETE',
			headers: {
				Authorization: token ? `Bearer ${token}` : '',
			},
		});
		return handleResponse(response);
	},
};

// Team API
const teamAPI = {
	getAll: async () => {
		const response = await fetch(`${API_BASE_URL}/team`);
		return handleResponse(response);
	},

	getById: async (id) => {
		const response = await fetch(`${API_BASE_URL}/team/${id}`);
		return handleResponse(response);
	},

	create: async (formData) => {
		const token = localStorage.getItem('token');
		const response = await fetch(`${API_BASE_URL}/team`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: token ? `Bearer ${token}` : '',
			},
			body: JSON.stringify(formData),
		});
		return handleResponse(response);
	},

	update: async (id, formData) => {
		const token = localStorage.getItem('token');
		const response = await fetch(`${API_BASE_URL}/team/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: token ? `Bearer ${token}` : '',
			},
			body: JSON.stringify(formData),
		});
		return handleResponse(response);
	},

	delete: async (id) => {
		const token = localStorage.getItem('token');
		const response = await fetch(`${API_BASE_URL}/team/${id}`, {
			method: 'DELETE',
			headers: {
				Authorization: token ? `Bearer ${token}` : '',
			},
		});
		return handleResponse(response);
	},
};

// Gallery API
const galleryAPI = {
	getAll: async () => {
		const response = await fetch(`${API_BASE_URL}/gallery`);
		return handleResponse(response);
	},

	getById: async (id) => {
		const response = await fetch(`${API_BASE_URL}/gallery/${id}`);
		return handleResponse(response);
	},

	create: async (formData) => {
		const token = localStorage.getItem('token');
		const response = await fetch(`${API_BASE_URL}/gallery`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: token ? `Bearer ${token}` : '',
			},
			body: JSON.stringify(formData),
		});
		return handleResponse(response);
	},

	update: async (id, formData) => {
		const token = localStorage.getItem('token');
		const response = await fetch(`${API_BASE_URL}/gallery/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: token ? `Bearer ${token}` : '',
			},
			body: JSON.stringify(formData),
		});
		return handleResponse(response);
	},

	delete: async (id) => {
		const token = localStorage.getItem('token');
		const response = await fetch(`${API_BASE_URL}/gallery/${id}`, {
			method: 'DELETE',
			headers: {
				Authorization: token ? `Bearer ${token}` : '',
			},
		});
		return handleResponse(response);
	},
};

// Export all APIs
export {
	authAPI,
	donationAPI,
	contactAPI,
	volunteerAPI,
	eventAPI,
	causeAPI,
	blogAPI,
	teamAPI,
	galleryAPI,
};
