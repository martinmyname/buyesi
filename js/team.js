// Import API modules
import { teamAPI } from './api.js';

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
				} else if (member.image.includes('/uploads/')) {
					imageUrl = `${API_BASE_URL}${member.image}`;
				} else {
					imageUrl = `${API_BASE_URL}/uploads/team/${member.image}`;
				}
				console.log('Image URL for', member.name, ':', imageUrl);
			} else {
				imageUrl = 'images/team-default.jpg';
			}

			const memberHTML = `
				<div class="col-md-6 col-lg-3 ftco-animate">
					<div class="staff">
						<div class="img-wrap d-flex align-items-stretch">
							<div class="img align-self-stretch" style="background-image: url(${imageUrl});"></div>
						</div>
						<div class="text pt-3 text-center">
							<h3>${member.name}</h3>
							<span class="position mb-2">${member.position}</span>
							<div class="faded">
								<p>${member.bio || ''}</p>
								<ul class="ftco-social text-center">
									${
										member.socialLinks
											? `
										${
											member.socialLinks.facebook
												? `<li class="ftco-animate"><a href="${member.socialLinks.facebook}"><span class="icon-facebook"></span></a></li>`
												: ''
										}
										${
											member.socialLinks.twitter
												? `<li class="ftco-animate"><a href="${member.socialLinks.twitter}"><span class="icon-twitter"></span></a></li>`
												: ''
										}
										${
											member.socialLinks.instagram
												? `<li class="ftco-animate"><a href="${member.socialLinks.instagram}"><span class="icon-instagram"></span></a></li>`
												: ''
										}
										${
											member.socialLinks.linkedin
												? `<li class="ftco-animate"><a href="${member.socialLinks.linkedin}"><span class="icon-linkedin"></span></a></li>`
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
	} catch (error) {
		console.error('Failed to load team members:', error);
		const teamContainer = document.querySelector('.team-container');
		if (teamContainer) {
			teamContainer.innerHTML =
				'<div class="col-12 text-center"><p>Failed to load team members. Please try again later.</p></div>';
		}
	}
}
