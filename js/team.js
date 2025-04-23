document.addEventListener('DOMContentLoaded', async function () {
	try {
		// Get the container where team members will be displayed
		const teamContainer = document.querySelector('.row.team-container');

		if (!teamContainer) {
			console.error('Team container not found in the DOM');
			return;
		}

		// Clear any existing content
		teamContainer.innerHTML =
			'<div class="col-12 text-center"><div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div></div>';

		// Fetch team members from the API
		const teamMembers = await window.API.teamAPI.getAll();

		if (!teamMembers || !teamMembers.length) {
			teamContainer.innerHTML =
				'<div class="col-12 text-center"><p>No team members found.</p></div>';
			return;
		}

		// Clear the loading indicator
		teamContainer.innerHTML = '';

		// Render each team member
		teamMembers.forEach((member) => {
			// Construct the image URL properly
			let imageUrl;
			if (member.image) {
				if (member.image.startsWith('http')) {
					imageUrl = member.image;
				} else if (member.image.includes('/uploads/')) {
					// If the path already contains /uploads/, don't add it again
					imageUrl = `http://localhost:5000${member.image}`;
				} else {
					imageUrl = `http://localhost:5000/uploads/team/${member.image}`;
				}
				console.log('Image URL for', member.name, ':', imageUrl);
			} else if (member.imageUrl) {
				imageUrl = member.imageUrl;
			} else {
				imageUrl = 'images/person-default.jpg';
			}

			const memberHTML = `
        <div class="col-lg-4 d-flex mb-sm-4 ftco-animate">
          <div class="staff">
            <div class="d-flex mb-4">
              <div class="img" style="background-image: url(${imageUrl});"></div>
              <div class="info ml-4">
                <h3><a href="#">${member.name}</a></h3>
                <span class="position">${member.position}</span>
                ${
									member.bio
										? `<p class="mt-2">${member.bio.substring(0, 50)}${
												member.bio.length > 50 ? '...' : ''
										  }</p>`
										: ''
								}
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
		console.error('Failed to load team members:', error.message, error.stack);
		const teamContainer = document.querySelector('.row.team-container');
		if (teamContainer) {
			teamContainer.innerHTML = `<div class="col-12 text-center"><p>Error loading team members. Please try again later.</p></div>`;
		}
	}
});
