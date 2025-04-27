// Import API modules
import { causeAPI } from './api.js';

// Get API_BASE_URL from window object
const API_BASE_URL = window.API_BASE_URL;

document.addEventListener('DOMContentLoaded', async function () {
	try {
		await loadCauses();
	} catch (error) {
		console.error('Error loading causes:', error);
	}
});

async function loadCauses() {
	try {
		const causesContainer = document.querySelector('#causes-container');
		if (!causesContainer) {
			console.error('Causes container not found');
			return;
		}

		// Add loading state
		causesContainer.innerHTML =
			'<div class="col-12 text-center"><div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div></div>';

		// Fetch causes from the API
		console.log('Fetching causes...');
		const response = await causeAPI.getAll();
		console.log('API Response:', response);

		// Handle both array response and object with data property
		const causes = Array.isArray(response) ? response : response.data || [];
		console.log('Processed causes:', causes);

		if (!causes || !causes.length) {
			causesContainer.innerHTML =
				'<div class="col-12 text-center"><p>No causes found.</p></div>';
			return;
		}

		// Clear any existing content
		causesContainer.innerHTML = '';

		// Render each cause
		causes.forEach((cause) => {
			// Calculate progress percentage
			const raisedAmount =
				typeof cause.raisedAmount === 'number' ? cause.raisedAmount : 0;
			const targetAmount =
				typeof cause.targetAmount === 'number' ? cause.targetAmount : 1;
			const progressPercentage =
				Math.min(100, Math.round((raisedAmount / targetAmount) * 100)) || 0;

			// Construct the image URL properly
			let imageUrl;
			if (cause.image) {
				if (cause.image.startsWith('http')) {
					imageUrl = cause.image;
				} else if (cause.image.includes('/uploads/')) {
					imageUrl = `${API_BASE_URL}${cause.image}`;
				} else {
					imageUrl = `${API_BASE_URL}/uploads/general/${cause.image}`;
				}
				console.log('Image URL for', cause.title, ':', imageUrl);
			} else {
				imageUrl = 'images/cause-default.jpg';
			}

			const causeHTML = `
				<div class="col-md-4 ftco-animate">
					<div class="cause-entry">
						<a href="cause-single.html?id=${
							cause._id
						}" class="img" style="background-image: url(${imageUrl});"></a>
						<div class="text p-3 p-md-4">
							<h3><a href="cause-single.html?id=${cause._id}">${cause.title}</a></h3>
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
							<span class="fund-raised d-block">$${raisedAmount.toLocaleString()} raised of $${targetAmount.toLocaleString()}</span>
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
		const causesContainer = document.querySelector('#causes-container');
		if (causesContainer) {
			causesContainer.innerHTML =
				'<div class="col-12 text-center"><p>Failed to load causes. Please try again later.</p></div>';
		}
	}
}

function formatTimeAgo(dateString) {
	const date = new Date(dateString);
	const now = new Date();
	const seconds = Math.floor((now - date) / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (days > 0) {
		return `${days} day${days === 1 ? '' : 's'} ago`;
	} else if (hours > 0) {
		return `${hours} hour${hours === 1 ? '' : 's'} ago`;
	} else if (minutes > 0) {
		return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
	} else {
		return 'Just now';
	}
}
