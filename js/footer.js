// Import API modules
import { API_BASE_URL, ENDPOINTS, fetchFromApi } from './api.js';

// Load recent blog posts for footer
const loadRecentBlogs = async () => {
	try {
		const response = await fetchFromApi(ENDPOINTS.BLOGS);
		if (response && response.data) {
			const recentBlogs = response.data.slice(0, 3); // Get only 3 most recent blogs
			const blogContainer = document.getElementById('recent-blog-posts');

			if (blogContainer) {
				recentBlogs.forEach((blog) => {
					// Construct the image URL properly
					let imageUrl;
					if (blog.image) {
						if (blog.image.startsWith('http')) {
							imageUrl = blog.image;
						} else if (blog.image.includes('/uploads/')) {
							imageUrl = `${API_BASE_URL}${blog.image}`;
						} else {
							imageUrl = `${API_BASE_URL}/uploads/blog/${blog.image}`;
						}
					} else {
						imageUrl = 'images/blog-default.jpg';
					}

					const blogElement = document.createElement('div');
					blogElement.className = 'block-21 mb-4 d-flex';
					blogElement.innerHTML = `
						<a class="blog-img mr-4" style="background-image: url(${imageUrl});"></a>
						<div class="text">
							<h3 class="heading"><a href="blog-single.html?id=${blog._id}">${
						blog.title
					}</a></h3>
							<div class="meta">
								<div><a href="#"><span class="icon-calendar"></span> ${new Date(
									blog.createdAt
								).toLocaleDateString()}</a></div>
								<div><a href="#"><span class="icon-person"></span> ${
									blog.author || 'Admin'
								}</a></div>
								<div><a href="#"><span class="icon-chat"></span> ${
									blog.comments?.length || 0
								}</a></div>
							</div>
						</div>
					`;
					blogContainer.appendChild(blogElement);
				});
			}
		}
	} catch (error) {
		console.error('Failed to load blogs for footer:', error);
		const blogContainer = document.getElementById('recent-blog-posts');
		if (blogContainer) {
			blogContainer.innerHTML =
				'<p class="text-muted">Unable to load recent blog posts.</p>';
		}
	}
};

// Initialize footer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
	loadRecentBlogs();
});
