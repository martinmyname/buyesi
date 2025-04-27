// Import API modules
import { ENDPOINTS, fetchFromApi } from './api.js';

// Load recent blog posts for footer
const loadRecentBlogs = async () => {
	try {
		const response = await fetchFromApi(ENDPOINTS.BLOGS);
		if (response && response.data) {
			const recentBlogs = response.data.slice(0, 3); // Get only 3 most recent blogs
			const blogContainer = document.getElementById('recent-blog-posts');

			if (blogContainer) {
				recentBlogs.forEach((blog) => {
					const blogElement = document.createElement('div');
					blogElement.className = 'block-21 mb-4 d-flex';
					blogElement.innerHTML = `
						<a class="blog-img mr-4" style="background-image: url(${
							blog.image || 'images/blog-default.jpg'
						});"></a>
						<div class="text">
							<h3 class="heading"><a href="blog-single.html?id=${blog._id}">${
						blog.title
					}</a></h3>
							<div class="meta">
								<div><a href="#"><span class="icon-calendar"></span> ${new Date(
									blog.createdAt
								).toLocaleDateString()}</a></div>
							</div>
						</div>
					`;
					blogContainer.appendChild(blogElement);
				});
			}
		}
	} catch (error) {
		console.error('Failed to load blogs for footer:', error);
	}
};

// Initialize footer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
	loadRecentBlogs();
});
