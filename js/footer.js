// Access the API objects from the window.API namespace
const { blog: blogAPI } = window.API;

// Wait for DOM content to be loaded
document.addEventListener('DOMContentLoaded', async () => {
	await loadRecentBlogs();
});

async function loadRecentBlogs() {
	try {
		const response = await blogAPI.getAll();
		if (response && (Array.isArray(response) || response.data)) {
			const blogsData = Array.isArray(response) ? response : response.data;
			const recentBlogs = blogsData.slice(0, 3); // Get only 3 most recent blogs
			const blogContainer = document.getElementById('recent-blog-posts');

			if (blogContainer) {
				blogContainer.innerHTML = ''; // Clear any existing content
				recentBlogs.forEach((blog) => {
					// Construct the image URL properly
					let imageUrl;
					const API_BASE_URL =
						window.API_BASE_URL || 'https://buyesi.onrender.com/api';
					if (blog.image) {
						// Check if it's a Cloudinary URL first
						if (blog.image.includes('cloudinary.com')) {
							imageUrl = blog.image;
						}
						// Otherwise, handle other URL types
						else if (blog.image.startsWith('http')) {
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
									blog.author?.name || blog.author || 'Admin'
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
}
