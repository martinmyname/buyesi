document.addEventListener('DOMContentLoaded', async function () {
	try {
		// Get the cause ID from the URL
		const urlParams = new URLSearchParams(window.location.search);
		const causeId = urlParams.get('id');

		if (!causeId) {
			showError('No cause ID specified');
			return;
		}

		// Get elements
		const causeContainer = document.querySelector('.cause-container');
		const causeTitle = document.querySelector('.cause-title');
		const causeImage = document.querySelector('.cause-image');
		const causeDescription = document.querySelector('.cause-description');
		const causeDonationTime = document.querySelector('.donation-time');
		const causeProgressBar = document.querySelector('.progress-bar');
		const causeFundRaised = document.querySelector('.fund-raised');
		const donationForm = document.querySelector('.donation-form');

		if (
			!causeContainer ||
			!causeTitle ||
			!causeImage ||
			!causeDescription ||
			!causeDonationTime ||
			!causeProgressBar ||
			!causeFundRaised
		) {
			showError('Page elements not found');
			return;
		}

		// Show loading state
		causeContainer.innerHTML =
			'<div class="text-center my-5"><div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div></div>';

		// Fetch cause details from the API
		console.log('Fetching cause with ID:', causeId);
		const response = await window.API.causeAPI.getById(causeId);
		console.log('API Response:', response);

		// Handle both direct response and object with data property
		const cause = response && response.data ? response.data : response;
		console.log('Processed cause:', cause);

		if (!cause) {
			showError('Cause not found');
			return;
		}

		// Calculate progress percentage - handle different field naming conventions
		const raisedAmount =
			typeof cause.raisedAmount === 'number'
				? cause.raisedAmount
				: typeof cause.amountRaised === 'number'
				? cause.amountRaised
				: 0;

		const targetAmount =
			typeof cause.targetAmount === 'number'
				? cause.targetAmount
				: typeof cause.goalAmount === 'number'
				? cause.goalAmount
				: 1; // Avoid division by zero

		const progressPercentage =
			Math.min(100, Math.round((raisedAmount / targetAmount) * 100)) || 0;

		// Update page elements
		document.title = `${cause.title} - Buyesi Youth Initiative`;
		causeTitle.textContent = cause.title;

		// Reset the container
		causeContainer.innerHTML = '';

		// Rebuild the content structure
		const causeEntry = document.createElement('div');
		causeEntry.className = 'cause-entry';

		// Image
		const causeImageDiv = document.createElement('a');
		causeImageDiv.href = '#';
		causeImageDiv.className = 'img cause-image mb-4';
		let imageUrl;
		if (cause.image) {
			if (cause.image.startsWith('http')) {
				imageUrl = cause.image;
			} else if (cause.image.includes('/uploads/')) {
				imageUrl = `http://localhost:5000${cause.image}`;
			} else {
				imageUrl = `http://localhost:5000/uploads/general/${cause.image}`;
			}
			console.log('Image URL:', imageUrl);
		} else {
			imageUrl = 'images/cause-1.jpeg';
		}
		causeImageDiv.style.backgroundImage = `url('${imageUrl}')`;
		causeEntry.appendChild(causeImageDiv);

		// Description
		const causeDesc = document.createElement('p');
		causeDesc.className = 'cause-description';
		causeDesc.innerHTML = cause.description;
		causeEntry.appendChild(causeDesc);

		// Donation Time
		const donationTime = document.createElement('span');
		donationTime.className = 'donation-time mb-3 d-block';
		donationTime.textContent = `Last donation ${formatTimeAgo(
			cause.updatedAt
		)}`;
		causeEntry.appendChild(donationTime);

		// Progress Bar
		const progressDiv = document.createElement('div');
		progressDiv.className = 'progress custom-progress-success';
		const progressBar = document.createElement('div');
		progressBar.className = 'progress-bar bg-primary';
		progressBar.setAttribute('role', 'progressbar');
		progressBar.style.width = `${progressPercentage}%`;
		progressBar.setAttribute('aria-valuenow', progressPercentage);
		progressBar.setAttribute('aria-valuemin', '0');
		progressBar.setAttribute('aria-valuemax', '100');
		progressDiv.appendChild(progressBar);
		causeEntry.appendChild(progressDiv);

		// Fund Raised
		const fundRaised = document.createElement('span');
		fundRaised.className = 'fund-raised d-block';
		const raisedAmountFormatted =
			typeof raisedAmount === 'number' ? raisedAmount.toLocaleString() : '0';
		const targetAmountFormatted =
			typeof targetAmount === 'number' ? targetAmount.toLocaleString() : '0';
		fundRaised.textContent = `$${raisedAmountFormatted} raised of $${targetAmountFormatted}`;
		causeEntry.appendChild(fundRaised);

		causeContainer.appendChild(causeEntry);

		// Handle donation form if it exists
		if (donationForm) {
			setupDonationForm(donationForm, cause);
		}
	} catch (error) {
		console.error('Failed to load cause details:', error);
		showError('Error loading cause details. Please try again later.');
	}
});

function setupDonationForm(form, cause) {
	// Set the cause ID in a hidden field if it exists
	const causeIdInput = document.getElementById('causeId');
	if (causeIdInput) {
		causeIdInput.value = cause._id;
	}

	form.addEventListener('submit', async function (e) {
		e.preventDefault();

		// Get form data
		const amount = document.getElementById('amount').value;
		const name = document.getElementById('fullName').value;
		const email = document.getElementById('donorEmail').value;

		// Form validation
		if (!amount || !name || !email) {
			showAlert('Please fill in all required fields', 'danger', form);
			return;
		}

		// Validate amount is a positive number
		if (isNaN(amount) || parseFloat(amount) <= 0) {
			showAlert('Please enter a valid donation amount', 'danger', form);
			return;
		}

		// Disable submit button and show loading state
		const submitBtn = form.querySelector('input[type="submit"]');
		const originalBtnValue = submitBtn.value;
		submitBtn.value = 'Processing...';
		submitBtn.disabled = true;

		try {
			// Create donation through the API
			const response = await window.API.donationAPI.create({
				amount: parseFloat(amount),
				name,
				email,
				causeId: cause._id,
				// Add any other fields you capture in your form
			});

			// Clear form
			form.reset();

			// Show success message
			showAlert('Thank you for your donation!', 'success', form);

			// Optionally redirect to a payment gateway if your backend returns a payment URL
			if (response.paymentUrl) {
				window.location.href = response.paymentUrl;
			}
		} catch (error) {
			console.error('Failed to process donation:', error);
			showAlert(
				'Failed to process donation. Please try again later.',
				'danger',
				form
			);
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
            <a href="causes.html" class="btn btn-primary">Back to Causes</a>
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

// Helper function to format time ago
function formatTimeAgo(dateString) {
	const date = new Date(dateString);
	const now = new Date();
	const diffInSeconds = Math.floor((now - date) / 1000);

	if (diffInSeconds < 60) {
		return 'just now';
	}

	const diffInMinutes = Math.floor(diffInSeconds / 60);
	if (diffInMinutes < 60) {
		return `${diffInMinutes}m ago`;
	}

	const diffInHours = Math.floor(diffInMinutes / 60);
	if (diffInHours < 24) {
		return `${diffInHours}h ago`;
	}

	const diffInDays = Math.floor(diffInHours / 24);
	if (diffInDays < 7) {
		return `${diffInDays}d ago`;
	}

	const diffInWeeks = Math.floor(diffInDays / 7);
	if (diffInWeeks < 4) {
		return `${diffInWeeks}w ago`;
	}

	const diffInMonths = Math.floor(diffInDays / 30);
	if (diffInMonths < 12) {
		return `${diffInMonths}mo ago`;
	}

	const diffInYears = Math.floor(diffInDays / 365);
	return `${diffInYears}y ago`;
}
