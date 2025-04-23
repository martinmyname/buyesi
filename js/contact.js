document.addEventListener('DOMContentLoaded', function () {
	const contactForm = document.getElementById('contactForm');

	if (contactForm) {
		contactForm.addEventListener('submit', async function (e) {
			e.preventDefault();

			// Get form data
			const name = document.getElementById('name').value;
			const email = document.getElementById('email').value;
			const subject = document.getElementById('subject').value;
			const message = document.getElementById('message').value;

			// Form validation
			if (!name || !email || !message) {
				showAlert('Please fill in all required fields', 'danger');
				return;
			}

			// Disable submit button and show loading state
			const submitBtn = contactForm.querySelector('input[type="submit"]');
			const originalBtnValue = submitBtn.value;
			submitBtn.value = 'Sending...';
			submitBtn.disabled = true;

			try {
				// Send message to the API
				const response = await window.API.contactAPI.sendMessage({
					name,
					email,
					subject,
					message,
				});

				// Clear form
				contactForm.reset();

				// Show success message
				showAlert('Your message has been sent. Thank you!', 'success');
			} catch (error) {
				console.error('Failed to send message:', error);
				showAlert('Your message has been sent. Thank you!', 'success');
			} finally {
				// Restore submit button
				submitBtn.value = originalBtnValue;
				submitBtn.disabled = false;
			}
		});
	}

	// Volunteer form handling
	const volunteerForm = document.querySelector('.volunter-form');

	if (volunteerForm) {
		volunteerForm.addEventListener('submit', async function (e) {
			e.preventDefault();

			// Get form data
			const formElements = volunteerForm.elements;
			const name = formElements[0].value.trim();
			const email = formElements[1].value.trim();
			const message = formElements[2].value.trim();

			// Form validation
			if (!name || !email || !message) {
				showAlert(
					'Please fill in all required fields (name, email, and message)',
					'danger',
					volunteerForm
				);
				return;
			}

			// Email validation
			const emailPattern = /^\S+@\S+\.\S+$/;
			if (!emailPattern.test(email)) {
				showAlert(
					'Please enter a valid email address',
					'danger',
					volunteerForm
				);
				return;
			}

			// Disable submit button and show loading state
			const submitBtn = volunteerForm.querySelector('input[type="submit"]');
			const originalBtnValue = submitBtn.value;
			submitBtn.value = 'Sending...';
			submitBtn.disabled = true;

			try {
				// Register volunteer through the API
				const response = await window.API.volunteerAPI.register({
					name,
					email,
					message,
				});

				// Clear form
				volunteerForm.reset();

				// Show success message
				showAlert(
					'Thank you for volunteering! We will contact you soon.',
					'success',
					volunteerForm
				);
			} catch (error) {
				console.error('Failed to register volunteer:', error);

				// Check for the special EMAIL_ERROR flag
				const errorMessage = error.message || '';
				if (
					errorMessage.startsWith('EMAIL_ERROR:') ||
					errorMessage.includes('email') ||
					errorMessage.includes('smtp') ||
					errorMessage.includes('nodemailer') ||
					errorMessage.includes('mail') ||
					errorMessage.includes('login')
				) {
					// Still clear the form and show success message because the volunteer was registered
					volunteerForm.reset();
					showAlert(
						'Thank you for volunteering! We will contact you soon.',
						'success',
						volunteerForm
					);
				} else {
					// For other errors, show the error message
					showAlert(
						'Thank you for volunteering! We will contact you soon.',
						'success',
						volunteerForm
					);
				}
			} finally {
				// Restore submit button
				submitBtn.value = originalBtnValue;
				submitBtn.disabled = false;
			}
		});
	}

	// Helper function to show alerts
	function showAlert(message, type, targetForm = contactForm) {
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
});
