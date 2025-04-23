// Remove the redundant API_BASE_URL declaration
// const API_BASE_URL = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', async function () {
	try {
		// Get the container where causes will be displayed
		const causesContainer = document.querySelector('.row.causes-container');

		if (!causesContainer) {
			console.error('Causes container not found in the DOM');
			return;
		}

		// Clear any existing content
		causesContainer.innerHTML =
			'<div class="col-12 text-center"><div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div></div>';

		// Fetch causes from the API
		console.log('Fetching causes...');
		const response = await window.API.causeAPI.getAll();
		console.log('API Response:', response);

		// Handle both array response and object with data property
		const causes = Array.isArray(response) ? response : response.data || [];
		console.log('Processed causes:', causes);

		if (!causes || !causes.length) {
			causesContainer.innerHTML =
				'<div class="col-12 text-center"><p>No causes found.</p></div>';
			return;
		}

		// Clear the loading indicator
		causesContainer.innerHTML = '';

		// Render each cause
		causes.forEach((cause) => {
			// Calculate progress percentage
			const raisedAmount =
				typeof cause.raisedAmount === 'number' ? cause.raisedAmount : 0;
			const targetAmount =
				typeof cause.targetAmount === 'number' ? cause.targetAmount : 1; // Avoid division by zero
			const progressPercentage =
				Math.min(100, Math.round((raisedAmount / targetAmount) * 100)) || 0;

			const raisedAmountFormatted =
				typeof raisedAmount === 'number' ? raisedAmount.toLocaleString() : '0';
			const targetAmountFormatted =
				typeof targetAmount === 'number' ? targetAmount.toLocaleString() : '0';

			// Get image URL - Check if it starts with http/https, otherwise, assume it's a relative path from the backend
			let imageUrl;
			if (cause.image) {
				if (cause.image.startsWith('http')) {
					imageUrl = cause.image;
				} else if (cause.image.includes('/uploads/')) {
					// If the path already contains /uploads/, don't add it again
					imageUrl = `http://localhost:5000${cause.image}`;
				} else {
					// Use the specific causes subfolder
					imageUrl = `http://localhost:5000/uploads/general/${cause.image}`;
				}
				console.log('Image URL for', cause.title, ':', imageUrl);
			} else {
				imageUrl = 'images/cause-1.jpeg';
			}

			const causeHTML = `
        <div class="col-md-4 ftco-animate">
          <div class="cause-entry">
            <a href="cause-single.html?id=${
							cause._id
						}" class="img" style="background-image: url(${imageUrl});"></a>
            <div class="text p-3 p-md-4">
              <h3><a href="cause-single.html?id=${cause._id}">${
				cause.title
			}</a></h3>
              <p>${cause.description.substring(0, 100)}${
				cause.description.length > 100 ? '...' : ''
			}</p>
              <span class="donation-time mb-3 d-block">Last donation ${formatTimeAgo(
								cause.updatedAt
							)}</span>
              <div class="progress custom-progress-success">
                <div class="progress-bar bg-primary" role="progressbar" style="width: ${progressPercentage}%" 
                     aria-valuenow="${progressPercentage}" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
              <span class="fund-raised d-block">$${raisedAmountFormatted} raised of $${targetAmountFormatted}</span>
            </div>
          </div>
        </div>
      `;

			causesContainer.innerHTML += causeHTML;
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
		console.error('Failed to load causes:', error);
		const causesContainer = document.querySelector('.row.causes-container');
		if (causesContainer) {
			causesContainer.innerHTML = `<div class="col-12 text-center"><p>Error loading causes. Please try again later.</p></div>`;
		}
	}
});

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
