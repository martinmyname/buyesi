// API functions for Buyesi Youth Initiative
const BASE_URL = 'https://buyesi.onrender.com';

// Blog API functions
export const blogAPI = {
	getAll: async () => {
		try {
			const response = await fetch(`${BASE_URL}/api/blogs`);
			const data = await response.json();
			return data;
		} catch (error) {
			console.error('Error fetching blogs:', error);
			return [];
		}
	},
	getById: async (id) => {
		try {
			const response = await fetch(`${BASE_URL}/api/blogs/${id}`);
			const data = await response.json();
			return data;
		} catch (error) {
			console.error(`Error fetching blog ${id}:`, error);
			return null;
		}
	},
	getRecent: async (limit = 3) => {
		try {
			const response = await fetch(
				`${BASE_URL}/api/blogs/recent?limit=${limit}`
			);
			const data = await response.json();
			return data;
		} catch (error) {
			console.error('Error fetching recent blogs:', error);
			return [];
		}
	},
};

// Cause API functions
export const causeAPI = {
	getAll: async () => {
		try {
			const response = await fetch(`${BASE_URL}/api/causes`);
			const data = await response.json();
			return data;
		} catch (error) {
			console.error('Error fetching causes:', error);
			return [];
		}
	},
	getById: async (id) => {
		try {
			const response = await fetch(`${BASE_URL}/api/causes/${id}`);
			const data = await response.json();
			return data;
		} catch (error) {
			console.error(`Error fetching cause ${id}:`, error);
			return null;
		}
	},
	getRecent: async (limit = 3) => {
		try {
			const response = await fetch(
				`${BASE_URL}/api/causes/recent?limit=${limit}`
			);
			const data = await response.json();
			return data;
		} catch (error) {
			console.error('Error fetching recent causes:', error);
			return [];
		}
	},
};

// Team API functions
export const teamAPI = {
	getAll: async () => {
		try {
			const response = await fetch(`${BASE_URL}/api/teams`);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			return data;
		} catch (error) {
			console.error('Error fetching team members:', error);
			// Return mock data as a fallback
			return [
				{
					_id: '1',
					name: 'John Doe',
					position: 'Founder',
					bio: 'John is the founder of Buyesi Youth Initiative.',
					image: 'images/team-default.jpg',
					socialMedia: {
						facebook: '#',
						twitter: '#',
						instagram: '#',
						linkedin: '#',
					},
				},
				{
					_id: '2',
					name: 'Jane Smith',
					position: 'Coordinator',
					bio: 'Jane coordinates community programs.',
					image: 'images/team-default.jpg',
					socialMedia: {
						facebook: '#',
						twitter: '#',
						instagram: '#',
						linkedin: '#',
					},
				},
				{
					_id: '3',
					name: 'Mike Johnson',
					position: 'Volunteer',
					bio: 'Mike supports various initiatives.',
					image: 'images/team-default.jpg',
					socialMedia: {
						facebook: '#',
						twitter: '#',
						instagram: '#',
						linkedin: '#',
					},
				},
			];
		}
	},
};

// Gallery API functions
export const galleryAPI = {
	getAll: async () => {
		try {
			const response = await fetch(`${BASE_URL}/api/galleries`);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			return data;
		} catch (error) {
			console.error('Error fetching gallery items:', error);
			// Return mock data with Cloudinary URLs as a fallback
			return [
				{
					_id: '1',
					url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/sample1.jpg',
					title: 'Sample Image 1',
				},
				{
					_id: '2',
					url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/sample2.jpg',
					title: 'Sample Image 2',
				},
				{
					_id: '3',
					url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/sample3.jpg',
					title: 'Sample Image 3',
				},
				{
					_id: '4',
					url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/sample4.jpg',
					title: 'Sample Image 4',
				},
				{
					_id: '5',
					url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/sample5.jpg',
					title: 'Sample Image 5',
				},
				{
					_id: '6',
					url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/sample6.jpg',
					title: 'Sample Image 6',
				},
			];
		}
	},
};

// Contact API functions
export const contactAPI = {
	submit: async (formData) => {
		try {
			const response = await fetch(`${BASE_URL}/api/contact`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});
			const data = await response.json();
			return data;
		} catch (error) {
			console.error('Error submitting contact form:', error);
			return { success: false, message: 'Failed to submit form' };
		}
	},
};

// Volunteer API functions
export const volunteerAPI = {
	submit: async (formData) => {
		try {
			const response = await fetch(`${BASE_URL}/api/volunteer`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});
			const data = await response.json();
			return data;
		} catch (error) {
			console.error('Error submitting volunteer form:', error);
			return { success: false, message: 'Failed to submit form' };
		}
	},
};

// Event API functions
export const eventAPI = {
	getAll: async () => {
		try {
			const response = await fetch(`${BASE_URL}/api/events`);
			const data = await response.json();
			return data;
		} catch (error) {
			console.error('Error fetching events:', error);
			return [];
		}
	},
	getById: async (id) => {
		try {
			const response = await fetch(`${BASE_URL}/api/events/${id}`);
			const data = await response.json();
			return data;
		} catch (error) {
			console.error(`Error fetching event ${id}:`, error);
			return null;
		}
	},
	getRecent: async (limit = 3) => {
		try {
			const response = await fetch(
				`${BASE_URL}/api/events/recent?limit=${limit}`
			);
			const data = await response.json();
			return data;
		} catch (error) {
			console.error('Error fetching recent events:', error);
			return [];
		}
	},
};

// Initialize global API object for backward compatibility
if (!window.API) {
	window.API = {};
}

// Add blog API to global API object
window.API.BLOGS = blogAPI;
// Add cause API to global API object
window.API.CAUSES = causeAPI;
// Add team API to global API object
window.API.TEAM = teamAPI;
// Add gallery API to global API object
window.API.GALLERY = galleryAPI;
// Add contact API to global API object
window.API.CONTACT = contactAPI;
// Add volunteer API to global API object
window.API.VOLUNTEER = volunteerAPI;
// Add event API to global API object
window.API.EVENTS = eventAPI;

// Export other APIs as needed
export default {
	BLOGS: blogAPI,
	CAUSES: causeAPI,
	TEAM: teamAPI,
	GALLERY: galleryAPI,
	CONTACT: contactAPI,
	VOLUNTEER: volunteerAPI,
	EVENTS: eventAPI,
};
