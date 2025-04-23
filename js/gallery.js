document.addEventListener('DOMContentLoaded', async function () {
	// const API_BASE_URL = 'http://localhost:5000/api';

	// Get the container where gallery items will be displayed
	const galleryContainer = document.querySelector('.row.gallery-container');

	if (!galleryContainer) {
		console.error('Gallery container not found in the DOM');
		return;
	}

	// Clear any existing content
	galleryContainer.innerHTML =
		'<div class="col-12 text-center"><div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div></div>';

	// Fetch gallery items from the API
	const galleryItems = await window.API.galleryAPI.getAll();

	if (!galleryItems || !galleryItems.length) {
		galleryContainer.innerHTML =
			'<div class="col-12 text-center"><p>No gallery items found.</p></div>';
		return;
	}

	// Clear the loading indicator
	galleryContainer.innerHTML = '';

	// Add category filter section
	const categories = [
		...new Set(galleryItems.map((item) => item.category || 'general')),
	];

	const filterHTML = `
	<div class="col-12 mb-5 gallery-filters">
		<div class="text-center">
			<div class="btn-group filter-buttons" role="group" aria-label="Gallery filters">
				<button type="button" class="btn btn-primary active" data-filter="all">All</button>
				${categories
					.map(
						(category) =>
							`<button type="button" class="btn btn-primary" data-filter="${category}">${
								category.charAt(0).toUpperCase() + category.slice(1)
							}</button>`
					)
					.join('')}
			</div>
		</div>
	</div>`;

	galleryContainer.innerHTML = filterHTML;

	// Create a div for the gallery items
	const galleryItemsContainer = document.createElement('div');
	galleryItemsContainer.className = 'row gallery-items-container';
	galleryContainer.appendChild(galleryItemsContainer);

	// Render each gallery item with more details
	galleryItems.forEach((item) => {
		// Construct the image URL properly
		let imageUrl;
		if (item.image) {
			if (item.image.startsWith('http')) {
				imageUrl = item.image;
			} else if (item.image.includes('/uploads/')) {
				// If the path already contains /uploads/, use the API base URL without the /api part
				imageUrl = `http://localhost:5000${item.image}`;
			} else {
				imageUrl = `http://localhost:5000/uploads/gallery/${item.image}`;
			}
		} else if (item.imageUrl) {
			imageUrl = item.imageUrl;
		} else {
			imageUrl = 'images/gallery-default.jpg';
		}

		const galleryHTML = `
    <div class="col-md-4 ftco-animate gallery-item" data-category="${
			item.category || 'general'
		}">
      <a href="${imageUrl}" class="image-popup gallery-box">
        <img src="${imageUrl}" alt="${
			item.title || 'Gallery Image'
		}" class="img-fluid">
      </a>
    </div>
  `;

		galleryItemsContainer.innerHTML += galleryHTML;
	});

	// Add filter functionality
	const filterButtons = document.querySelectorAll('.filter-buttons button');
	const galleryItemElements = document.querySelectorAll('.gallery-item');

	filterButtons.forEach((button) => {
		button.addEventListener('click', function () {
			// Remove active class from all buttons
			filterButtons.forEach((btn) => btn.classList.remove('active'));
			// Add active class to clicked button
			this.classList.add('active');

			const filter = this.getAttribute('data-filter');

			// Show/hide gallery items based on filter
			galleryItemElements.forEach((item) => {
				if (filter === 'all' || item.getAttribute('data-category') === filter) {
					item.style.display = 'block';
				} else {
					item.style.display = 'none';
				}
			});
		});
	});

	// Initialize animations and Magnific Popup
	if (typeof $.fn.waypoint !== 'undefined') {
		$('.ftco-animate').waypoint(
			function () {
				$(this.element).addClass('fadeInUp ftco-animated');
			},
			{ offset: '95%' }
		);
	}

	if (typeof $.fn.magnificPopup !== 'undefined') {
		$('.image-popup').magnificPopup({
			type: 'image',
			closeOnContentClick: true,
			closeBtnInside: false,
			fixedContentPos: true,
			mainClass: 'mfp-no-margins mfp-with-zoom',
			gallery: {
				enabled: true,
				navigateByImgClick: true,
				preload: [0, 1],
			},
			image: {
				verticalFit: true,
				titleSrc: function (item) {
					const galleryItem = $(item.el).closest('.gallery-item');
					const title = galleryItem.find('.card-title').text();
					const description = galleryItem.find('.card-text').text();
					return title + (description ? ' - ' + description : '');
				},
			},
			zoom: {
				enabled: true,
				duration: 300,
			},
		});
	}
});
