// API Configuration
const API_BASE_URL = 'https://buyesi.onrender.com/api';

// API Endpoints
const ENDPOINTS = {
	BLOGS: `${API_BASE_URL}/blogs`,
	CAUSES: `${API_BASE_URL}/causes`,
	TEAM: `${API_BASE_URL}/teams`,
	GALLERY: `${API_BASE_URL}/galleries`,
	EVENTS: `${API_BASE_URL}/events`,
	CONTACT: `${API_BASE_URL}/contact`,
	VOLUNTEER: `${API_BASE_URL}/volunteers`,
	DONATIONS: `${API_BASE_URL}/donations`,
};

// API Response Handler
const handleApiResponse = async (response) => {
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	return await response.json();
};

// Add the missing handleResponse function that's used by all API methods
const handleResponse = async (response) => {
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	return await response.json();
};

// API Error Handler
const handleApiError = (error) => {
	// Silently handle error
	return null;
};

// API Request Function
const fetchFromApi = async (endpoint) => {
	try {
		const response = await fetch(endpoint);
		return await handleApiResponse(response);
	} catch (error) {
		return handleApiError(error);
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

// Blog API
const blogAPI = {
	getAll: async () => {
		try {
			const response = await fetch(`${API_BASE_URL}/blogs`);
			const data = await response.json();
			return data;
		} catch (error) {
			console.error('Error fetching blogs:', error);
			throw error;
		}
	},

	getById: async (id) => {
		try {
			const response = await fetch(`${API_BASE_URL}/blogs/${id}`);
			const data = await response.json();
			return data;
		} catch (error) {
			console.error(`Error fetching blog ${id}:`, error);
			throw error;
		}
	},

	create: async (formData) => {
		const token = localStorage.getItem('token');
		const response = await fetch(`${API_BASE_URL}/blogs`, {
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
		const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
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
		const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
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
		const response = await fetch(`${API_BASE_URL}/galleries`);
		return handleResponse(response);
	},

	create: async (formData) => {
		const token = localStorage.getItem('token');
		const response = await fetch(`${API_BASE_URL}/galleries`, {
			method: 'POST',
			headers: {
				Authorization: token ? `Bearer ${token}` : '',
			},
			body: formData,
		});
		return handleResponse(response);
	},

	delete: async (id) => {
		const token = localStorage.getItem('token');
		const response = await fetch(`${API_BASE_URL}/galleries/${id}`, {
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
		const response = await fetch(`${API_BASE_URL}/teams`);
		return handleResponse(response);
	},

	getById: async (id) => {
		const response = await fetch(`${API_BASE_URL}/teams/${id}`);
		return handleResponse(response);
	},

	create: async (formData) => {
		const token = localStorage.getItem('token');
		const response = await fetch(`${API_BASE_URL}/teams`, {
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
		const response = await fetch(`${API_BASE_URL}/teams/${id}`, {
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
		const response = await fetch(`${API_BASE_URL}/teams/${id}`, {
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
				Authorization: token ? `Bearer ${token}` : '',
			},
			body: formData,
		});
		return handleResponse(response);
	},

	update: async (id, formData) => {
		const token = localStorage.getItem('token');
		const response = await fetch(`${API_BASE_URL}/causes/${id}`, {
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
		const response = await fetch(`${API_BASE_URL}/causes/${id}`, {
			method: 'DELETE',
			headers: {
				Authorization: token ? `Bearer ${token}` : '',
			},
		});
		return handleResponse(response);
	},
};

// Assign all APIs to window.API
window.API = {
	authAPI: authAPI,
	causeAPI: causeAPI,
	blogAPI: blogAPI,
	teamAPI: teamAPI,
	galleryAPI: galleryAPI,
	eventAPI: eventAPI,
	volunteerAPI: volunteerAPI,
	donationAPI: donationAPI,
	ENDPOINTS: ENDPOINTS,
	fetchFromApi: fetchFromApi,
	BASE_URL: API_BASE_URL,
	// Also include shorter aliases for convenience
	auth: authAPI,
	cause: causeAPI,
	blog: blogAPI,
	team: teamAPI,
	gallery: galleryAPI,
	event: eventAPI,
	volunteer: volunteerAPI,
	donation: donationAPI,
};

// Log that the API has been initialized
console.log('API initialized successfully with:', Object.keys(window.API));

// Remove the ES module export statements as they're causing syntax errors
// Regular script tags don't support ES module syntax
