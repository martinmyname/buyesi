document.addEventListener('DOMContentLoaded', async function () {
	try {
		// Get the event ID from the URL
		const urlParams = new URLSearchParams(window.location.search);
		const eventId = urlParams.get('id');

		if (!eventId) {
			showError('No event ID specified');
			return;
		}

		// Get elements
		const eventContainer = document.querySelector('.event-container');
		const eventTitle = document.querySelector('.event-title');
		const eventImage = document.querySelector('.event-image');
		const eventDate = document.querySelector('.event-date');
		const eventLocation = document.querySelector('.event-location');
		const eventTime = document.querySelector('.event-time');
		const eventDescription = document.querySelector('.event-description');

		if (
			!eventContainer ||
			!eventTitle ||
			!eventImage ||
			!eventDate ||
			!eventLocation ||
			!eventTime ||
			!eventDescription
		) {
			showError('Page elements not found');
			return;
		}

		// Show loading state
		eventContainer.innerHTML =
			'<div class="text-center my-5"><div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div></div>';

		// Fetch event details from the API
		const response = await window.API.eventAPI.getById(eventId);

		// Handle both direct response and object with data property
		const event = response && response.data ? response.data : response;

		if (!event) {
			showError('Event not found');
			return;
		}

		// Update page elements
		document.title = `${event.title} - Buyesi Youth Initiative`;
		eventTitle.textContent = event.title;

		// Format date
		const eventDateObj = new Date(event.startDate);
		const formattedDate = eventDateObj.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});

		// Reset the container
		eventContainer.innerHTML = '';

		// Rebuild the content structure
		const eventEntry = document.createElement('div');
		eventEntry.className = 'event-entry';

		// Image
		const eventImageDiv = document.createElement('a');
		eventImageDiv.href = '#';
		eventImageDiv.className = 'img event-image mb-4';
		let imageUrl;
		if (event.image) {
			// Direct URL (including Cloudinary URLs)
			if (event.image.startsWith('http')) {
				imageUrl = event.image;
			}
			// Path from backend API
			else if (event.image.includes('/uploads/')) {
				imageUrl = `${window.API_BASE_URL}${event.image}`;
			}
			// Just a filename
			else {
				imageUrl = `${window.API_BASE_URL}/uploads/events/${event.image}`;
			}
		}
		// For Cloudinary or other image hosting service
		else if (event.imageUrl) {
			imageUrl = event.imageUrl;
		}
		// Default fallback image
		else {
			imageUrl = 'images/event-default.jpg';
		}
		eventImageDiv.style.backgroundImage = `url('${imageUrl}')`;
		eventEntry.appendChild(eventImageDiv);

		// Event Details
		const eventDetails = document.createElement('div');
		eventDetails.className = 'event-details p-4 mb-4 rounded';

		// Title (moved inside event details box)
		const titleEl = document.createElement('h3');
		titleEl.className = 'event-title mb-4';
		titleEl.textContent = event.title;
		eventDetails.appendChild(titleEl);

		// Details with icons
		const detailsGrid = document.createElement('div');
		detailsGrid.className = 'row mb-3';

		// Date
		const dateCol = document.createElement('div');
		dateCol.className = 'col-md-6 mb-3';
		dateCol.innerHTML = `<p><span class="icon-calendar mr-2"></span><strong>Date:</strong> <span class="event-date">${formattedDate}</span></p>`;

		// Location
		const locationCol = document.createElement('div');
		locationCol.className = 'col-md-6 mb-3';
		locationCol.innerHTML = `<p><span class="icon-map-o mr-2"></span><strong>Location:</strong> <span class="event-location">${
			event.location || 'TBA'
		}</span></p>`;

		// Time
		const timeCol = document.createElement('div');
		timeCol.className = 'col-md-6 mb-3';
		timeCol.innerHTML = `<p><span class="icon-clock-o mr-2"></span><strong>Time:</strong> <span class="event-time">${
			event.time || 'TBA'
		}</span></p>`;

		// Organizer
		const organizerCol = document.createElement('div');
		organizerCol.className = 'col-md-6 mb-3';
		organizerCol.innerHTML = `<p><span class="icon-user mr-2"></span><strong>Organizer:</strong> Buyesi Youth Initiative</p>`;

		detailsGrid.appendChild(dateCol);
		detailsGrid.appendChild(locationCol);
		detailsGrid.appendChild(timeCol);
		detailsGrid.appendChild(organizerCol);

		eventDetails.appendChild(detailsGrid);
		eventEntry.appendChild(eventDetails);

		// Description with heading
		const descriptionSection = document.createElement('div');
		descriptionSection.className = 'mb-5';
		const descHeading = document.createElement('h4');
		descHeading.className = 'mb-3 border-bottom pb-2';
		descHeading.textContent = 'About This Event';
		descriptionSection.appendChild(descHeading);

		const eventDesc = document.createElement('div');
		eventDesc.className = 'event-description';
		eventDesc.innerHTML =
			event.description || 'No description available for this event.';
		descriptionSection.appendChild(eventDesc);
		eventEntry.appendChild(descriptionSection);

		eventContainer.appendChild(eventEntry);

		// If there's a register form, set up event handling
		const registerForm = document.querySelector('.register-form');
		if (registerForm) {
			setupRegisterForm(registerForm, event);
		}
	} catch (error) {
		console.error('Failed to load event details:', error);
		showError('Error loading event details. Please try again later.');
	}
});

function setupRegisterForm(form, event) {
	form.addEventListener('submit', async function (e) {
		e.preventDefault();

		// Get form data
		const name = document.getElementById('name').value;
		const email = document.getElementById('email').value;
		const phone = document.getElementById('phone')?.value || '';
		const message = document.getElementById('message')?.value || '';

		// Form validation
		if (!name || !email) {
			showAlert('Please fill in your name and email', 'danger', form);
			return;
		}

		// Disable submit button and show loading state
		const submitBtn = form.querySelector('input[type="submit"]');
		const originalBtnValue = submitBtn.value;
		submitBtn.value = 'Processing...';
		submitBtn.disabled = true;

		try {
			const response = await fetch(
				`${window.API_BASE_URL}/events/${event._id}/register`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						name,
						email,
						phone,
						message,
						eventId: event._id,
					}),
				}
			);

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || 'Failed to register for event');
			}

			// Clear form
			form.reset();

			// Show success message
			showAlert(
				'You have successfully registered for this event!',
				'success',
				form
			);
		} catch (error) {
			console.error('Failed to register for event:', error);
			showAlert('Failed to register. Please try again later.', 'danger', form);
		} finally {
			// Restore submit button
			submitBtn.value = originalBtnValue;
			submitBtn.disabled = false;
		}
	});
}

function showError(message) {
	const mainContent = document.querySelector('.ftco-section');
	if (mainContent) {
		mainContent.innerHTML = `
      <div class="container">
        <div class="row">
          <div class="col-md-12 text-center">
            <div class="alert alert-danger">
              ${message}
            </div>
            <a href="event.html" class="btn btn-primary">Back to Events</a>
          </div>
        </div>
      </div>
    `;
	}
}

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
