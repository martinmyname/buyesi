// Import API modules
import { eventAPI } from '../api.js';

// Get API_BASE_URL from window object
const API_BASE_URL = window.API_BASE_URL;

document.addEventListener('DOMContentLoaded', async function () {
	try {
		await loadEvents();
	} catch (error) {
		console.error('Error loading events:', error);
	}
});

async function loadEvents() {
	try {
		const eventsContainer = document.querySelector('.events-container');
		if (!eventsContainer) {
			console.error('Events container not found');
			return;
		}

		// Add loading state
		eventsContainer.innerHTML =
			'<div class="col-12 text-center"><div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div></div>';

		// Fetch events from the API
		console.log('Fetching events...');
		const response = await eventAPI.getAll();
		console.log('API Response:', response);

		// Handle both array response and object with data property
		const events = Array.isArray(response) ? response : response.data || [];
		console.log('Processed events:', events);

		if (!events || !events.length) {
			eventsContainer.innerHTML =
				'<div class="col-12 text-center"><p>No events found.</p></div>';
			return;
		}

		// Sort by date (most recent first)
		events.sort((a, b) => new Date(b.date) - new Date(a.date));

		// Clear any existing content
		eventsContainer.innerHTML = '';

		// Render each event
		events.forEach((event) => {
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
			`;

			eventsContainer.innerHTML += eventHTML;
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
		const eventsContainer = document.querySelector('.events-container');
		if (eventsContainer) {
			eventsContainer.innerHTML =
				'<div class="col-12 text-center"><p>Failed to load events. Please try again later.</p></div>';
		}
	}
}
