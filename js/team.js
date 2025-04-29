// Import API modules
import { teamAPI } from '../api.js';

// Get API_BASE_URL from window object
const API_BASE_URL = window.API_BASE_URL;

document.addEventListener('DOMContentLoaded', async function () {
	try {
		await loadTeamMembers();
	} catch (error) {
		console.error('Error loading team members:', error);
	}
});

async function loadTeamMembers() {
	try {
		// Use more specific selector for the team container
		const teamContainer = document.querySelector('.team-container');
		if (!teamContainer) {
			console.error('Team container not found');
			return;
		}

		// Add loading state
		teamContainer.innerHTML =
			'<div class="col-12 text-center"><div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div></div>';

		// Fetch team members from the API
		console.log('Fetching team members...');
		const response = await teamAPI.getAll();
		console.log('API Response:', response);

		// Handle both array response and object with data property
		const teamMembers = Array.isArray(response)
			? response
			: response.data || [];
		console.log('Processed team members:', teamMembers);

		if (!teamMembers || !teamMembers.length) {
			teamContainer.innerHTML =
				'<div class="col-12 text-center"><p>No team members found.</p></div>';
			return;
		}

		// Clear any existing content
		teamContainer.innerHTML = '';

		// Render each team member
		teamMembers.forEach((member) => {
			// Construct the image URL properly
			let imageUrl;
			if (member.image) {
				if (member.image.startsWith('http')) {
					imageUrl = member.image;
				} else if (member.image.startsWith('/uploads/')) {
					// Remove 'api' from the path if it exists
					imageUrl = `${API_BASE_URL.replace('/api', '')}${member.image}`;
				} else {
					imageUrl = `${API_BASE_URL.replace('/api', '')}/uploads/team/${
						member.image
					}`;
				}
				console.log('Image URL for', member.name, ':', imageUrl);
			} else {
				imageUrl = 'images/team-default.jpg';
			}

			const memberHTML = `
				<div class="col-md-6 col-lg-3 ftco-animate">
					<div class="staff">
						<div class="img-wrap d-flex align-items-stretch">
							<img src="${imageUrl}" alt="${
				member.name
			}" class="img align-self-stretch" style="width: 100%; height: 300px; object-fit: cover;">
						</div>
						<div class="text pt-3 text-center">
							<h3>${member.name}</h3>
							<span class="position mb-2">${member.position}</span>
							<div class="faded">
								<p>${member.bio || ''}</p>
								<ul class="ftco-social text-center">
									${
										member.socialMedia
											? `
										${
											member.socialMedia.facebook
												? `<li class="ftco-animate"><a href="${member.socialMedia.facebook}"><span class="icon-facebook"></span></a></li>`
												: ''
										}
										${
											member.socialMedia.twitter
												? `<li class="ftco-animate"><a href="${member.socialMedia.twitter}"><span class="icon-twitter"></span></a></li>`
												: ''
										}
										${
											member.socialMedia.instagram
												? `<li class="ftco-animate"><a href="${member.socialMedia.instagram}"><span class="icon-instagram"></span></a></li>`
												: ''
										}
										${
											member.socialMedia.linkedin
												? `<li class="ftco-animate"><a href="${member.socialMedia.linkedin}"><span class="icon-linkedin"></span></a></li>`
												: ''
										}
									`
											: ''
									}
								</ul>
							</div>
						</div>
					</div>
				</div>
			`;

			teamContainer.innerHTML += memberHTML;
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
		console.error('Failed to load team members:', error);
		const teamContainer = document.querySelector('.team-container');
		if (teamContainer) {
			teamContainer.innerHTML =
				'<div class="col-12 text-center"><p>Failed to load team members. Please try again later.</p></div>';
		}
	}
}
