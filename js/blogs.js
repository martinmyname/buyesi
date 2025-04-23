document.addEventListener('DOMContentLoaded', async function () {
	try {
		// Get the container where blogs will be displayed
		const blogsContainer = document.querySelector('.row.blogs-container');

		if (!blogsContainer) {
			console.error('Blogs container not found in the DOM');
			return;
		}

		// Clear any existing content
		blogsContainer.innerHTML =
			'<div class="col-12 text-center"><div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div></div>';

		// Fetch blogs from the API
		console.log('window.API:', window.API);
		console.log(
			'window.API.blogAPI:',
			window.API ? window.API.blogAPI : 'undefined'
		);
		console.log('Fetching blogs...');
		const response = await window.API.blogAPI.getAll();
		console.log('API Response from blogs:', response);

		// Handle both array response and object with data property
		const blogs = Array.isArray(response) ? response : response.data || [];
		console.log('Processed blogs:', blogs);

		if (!blogs || !blogs.length) {
			blogsContainer.innerHTML =
				'<div class="col-12 text-center"><p>No blogs found.</p></div>';
			return;
		}

		// Clear the loading indicator
		blogsContainer.innerHTML = '';

		// Sort blogs by date (most recent first)
		blogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

		// Render each blog
		blogs.forEach((blog) => {
			console.log('Processing blog:', blog);
			const blogDate = new Date(blog.createdAt);
			const formattedDate = blogDate.toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			});

			// Handle the image URL properly
			let imageUrl;
			if (blog.image) {
				if (blog.image.startsWith('http')) {
					imageUrl = blog.image;
				} else if (blog.image.includes('/uploads/')) {
					// If the path already contains /uploads/, don't add it again
					imageUrl = `http://localhost:5000${blog.image}`;
				} else {
					imageUrl = `http://localhost:5000/uploads/blog/${blog.image}`;
				}
				console.log('Image URL for', blog.title, ':', imageUrl);
			} else if (blog.imageUrl) {
				imageUrl = blog.imageUrl;
			} else {
				imageUrl = 'images/blog-default.jpg';
			}

			const blogHTML = `
        <div class="col-md-4 d-flex ftco-animate">
          <div class="blog-entry align-self-stretch">
            <a href="blog-single.html?id=${
							blog._id
						}" class="block-20" style="background-image: url('${imageUrl}');">
            </a>
            <div class="text p-4 d-block">
              <div class="meta mb-3">
                <div><a href="#">${formattedDate}</a></div>
                <div><a href="#">${blog.author || 'Admin'}</a></div>
                <div><a href="#" class="meta-chat"><span class="icon-chat"></span> ${
									blog.comments?.length || 0
								}</a></div>
              </div>
              <h3 class="heading mt-3"><a href="blog-single.html?id=${
								blog._id
							}">${blog.title}</a></h3>
              <p>${
								blog.content
									? blog.content.substring(0, 150) +
									  (blog.content.length > 150 ? '...' : '')
									: ''
							}</p>
            </div>
          </div>
        </div>
      `;

			blogsContainer.innerHTML += blogHTML;
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
		console.error('Failed to load blogs:', error.message, error.stack);
		const blogsContainer = document.querySelector('.row.blogs-container');
		if (blogsContainer) {
			blogsContainer.innerHTML = `<div class="col-12 text-center"><p>Error loading blogs. Please try again later.</p></div>`;
		}
	}
});
