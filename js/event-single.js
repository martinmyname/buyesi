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
		console.log('Fetching event with ID:', eventId);
		const response = await window.API.eventAPI.getById(eventId);
		console.log('API Response:', response);

		// Handle both direct response and object with data property
		const event = response && response.data ? response.data : response;
		console.log('Processed event:', event);

		if (!event) {
			showError('Event not found');
			return;
		}

		// Update page elements
		document.title = `${event.title} - Buyesi Youth Initiative`;
		eventTitle.textContent = event.title;

		// Format date
		const eventDateObj = new Date(event.date);
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
			if (event.image.startsWith('http')) {
				imageUrl = event.image;
			} else if (event.image.includes('/uploads/')) {
				imageUrl = `http://localhost:5000${event.image}`;
			} else {
				imageUrl = `http://localhost:5000/uploads/events/${event.image}`;
			}
			console.log('Image URL for event:', imageUrl);
		} else if (event.imageUrl) {
			imageUrl = event.imageUrl;
		} else {
			imageUrl = 'images/event-default.jpg';
		}
		eventImageDiv.style.backgroundImage = `url('${imageUrl}')`;
		eventEntry.appendChild(eventImageDiv);

		// Event Details
		const eventDetails = document.createElement('div');
		eventDetails.className = 'event-details mb-4';
		const detailsRow1 = document.createElement('div');
		detailsRow1.className = 'row';
		const dateCol = document.createElement('div');
		dateCol.className = 'col-md-6';
		dateCol.innerHTML = `<p><strong>Date:</strong> <span class="event-date">${formattedDate}</span></p>`;
		const locationCol = document.createElement('div');
		locationCol.className = 'col-md-6';
		locationCol.innerHTML = `<p><strong>Location:</strong> <span class="event-location">${
			event.location || 'TBD'
		}</span></p>`;
		detailsRow1.appendChild(dateCol);
		detailsRow1.appendChild(locationCol);

		const detailsRow2 = document.createElement('div');
		detailsRow2.className = 'row';
		const timeCol = document.createElement('div');
		timeCol.className = 'col-md-6';
		timeCol.innerHTML = `<p><strong>Time:</strong> <span class="event-time">${
			event.time || 'TBD'
		}</span></p>`;
		const organizerCol = document.createElement('div');
		organizerCol.className = 'col-md-6';
		organizerCol.innerHTML = `<p><strong>Organizer:</strong> Buyesi Youth Initiative</p>`;
		detailsRow2.appendChild(timeCol);
		detailsRow2.appendChild(organizerCol);

		eventDetails.appendChild(detailsRow1);
		eventDetails.appendChild(detailsRow2);
		eventEntry.appendChild(eventDetails);

		// Description
		const eventDesc = document.createElement('div');
		eventDesc.className = 'event-description';
		eventDesc.innerHTML = event.description;
		eventEntry.appendChild(eventDesc);

		eventContainer.appendChild(eventEntry);

		// If there's a register form, set up event handling
		const registerForm = document.querySelector('.register-form');
		if (registerForm) {
			setupRegisterForm(registerForm, event);
		}

		console.log('API:', window.API);
		console.log('teamAPI:', window.API ? window.API.teamAPI : 'undefined');
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
			// Use the window.API object and API_BASE_URL constant
			const API_BASE_URL = 'http://localhost:5000/api';
			const response = await fetch(
				`${API_BASE_URL}/events/${event._id}/register`,
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
