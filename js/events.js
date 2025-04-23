document.addEventListener('DOMContentLoaded', async function () {
	try {
		// Get the container where events will be displayed
		const eventsContainer = document.querySelector('.row.events-container');

		if (!eventsContainer) {
			console.error('Events container not found in the DOM');
			return;
		}

		// Clear any existing content
		eventsContainer.innerHTML =
			'<div class="col-12 text-center"><div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div></div>';

		// Fetch events from the API
		const events = await window.API.eventAPI.getAll();

		if (!events || !events.length) {
			eventsContainer.innerHTML =
				'<div class="col-12 text-center"><p>No events found.</p></div>';
			return;
		}

		// Clear the loading indicator
		eventsContainer.innerHTML = '';

		// Sort events by date (most recent first)
		events.sort((a, b) => new Date(b.date) - new Date(a.date));

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
					// If the path already contains /uploads/, don't add it again
					imageUrl = `http://localhost:5000${event.image}`;
				} else {
					imageUrl = `http://localhost:5000/uploads/events/${event.image}`;
				}
				console.log('Image URL for', event.title, ':', imageUrl);
			} else if (event.imageUrl) {
				imageUrl = event.imageUrl;
			} else {
				imageUrl = 'images/event-default.jpg';
			}

			const eventHTML = `
        <div class="col-md-4 d-flex ftco-animate">
          <div class="blog-entry align-self-stretch">
            <a href="event-single.html?id=${
							event._id
						}" class="block-20" style="background-image: url('${imageUrl}');">
            </a>
            <div class="text p-4 d-block">
              <div class="meta mb-3">
                <div><a href="#">${formattedDate}</a></div>
                <div><a href="#">${event.location || 'TBD'}</a></div>
              </div>
              <h3 class="heading mb-4"><a href="event-single.html?id=${
								event._id
							}">${event.title}</a></h3>
              <p class="time-loc"><span class="mr-2"><i class="icon-clock-o"></i> ${
								event.time || 'TBD'
							}</span> <span><i class="icon-map-o"></i> ${
				event.location || 'TBD'
			}</span></p>
              <p>${
								event.description
									? event.description.substring(0, 120) +
									  (event.description.length > 120 ? '...' : '')
									: ''
							}</p>
              <p><a href="event-single.html?id=${
								event._id
							}">Join Event <i class="ion-ios-arrow-forward"></i></a></p>
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
		console.error('Failed to load events:', error.message, error.stack);
		const eventsContainer = document.querySelector('.row.events-container');
		if (eventsContainer) {
			eventsContainer.innerHTML = `<div class="col-12 text-center"><p>Error loading events. Please try again later.</p></div>`;
		}
	}
});
