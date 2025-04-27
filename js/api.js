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
	console.error('API Error:', error);
	return null;
};

// API Request Function
const fetchFromApi = async (endpoint) => {
	try {
		const response = await fetch(endpoint);
		console.log(`API Response from ${endpoint}:`, {
			status: response.status,
			statusText: response.statusText,
		});
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
				'Content-Type': 'application/json',
				Authorization: token ? `Bearer ${token}` : '',
			},
			body: JSON.stringify(formData),
		});
		return handleResponse(response);
	},

	update: async (id, formData) => {
		const token = localStorage.getItem('token');
		const response = await fetch(`${API_BASE_URL}/teams/${id}`, {
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
		const response = await fetch(`${API_BASE_URL}/teams/${id}`, {
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

	getById: async (id) => {
		const response = await fetch(`${API_BASE_URL}/galleries/${id}`);
		return handleResponse(response);
	},

	create: async (formData) => {
		const token = localStorage.getItem('token');
		const response = await fetch(`${API_BASE_URL}/galleries`, {
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
		const response = await fetch(`${API_BASE_URL}/galleries/${id}`, {
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
		const response = await fetch(`${API_BASE_URL}/galleries/${id}`, {
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
	blogAPI,
	eventAPI,
	galleryAPI,
	teamAPI,
	causeAPI,
	API_BASE_URL,
	ENDPOINTS,
	fetchFromApi,
};
