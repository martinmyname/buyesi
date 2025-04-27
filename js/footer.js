// Import API modules
import { blogAPI } from './api.js';

// Get API_BASE_URL from window object
const API_BASE_URL = window.API_BASE_URL;

document.addEventListener('DOMContentLoaded', async function () {
	try {
		// Get the footer blog section with multiple selector options
		let footerBlogSection = document.querySelector('#recent-blog-posts');
		if (!footerBlogSection) {
			footerBlogSection = document.querySelector(
				'.ftco-footer-widget.mb-4 div h2.ftco-heading-2:contains("Recent Blog")'
			).parentElement;
		}
		if (!footerBlogSection) {
			footerBlogSection = document.querySelector('.ftco-footer-widget.mb-4');
		}

		if (!footerBlogSection) {
			console.error('Footer blog section not found with any selector');
			return;
		}

		// Clear existing hardcoded blog posts
		footerBlogSection.innerHTML = '';

		// Show loading indicator
		const loadingHTML = `
            <div class="d-flex justify-content-center">
                <div class="spinner-border text-light" role="status" style="width: 1.5rem; height: 1.5rem;">
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
        `;
		footerBlogSection.innerHTML += loadingHTML;

		// Fetch blogs from the API
		const response = await blogAPI.getAll();
		const blogs = Array.isArray(response) ? response : response.data || [];

		if (!blogs || !blogs.length) {
			footerBlogSection.innerHTML =
				'<h2 class="ftco-heading-2">Recent Blog</h2><p>No blog posts available.</p>';
			return;
		}

		// Remove loading indicator
		footerBlogSection.innerHTML = '<h2 class="ftco-heading-2">Recent Blog</h2>';

		// Sort blogs by date (most recent first) and take the 2 most recent
		blogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
		const recentBlogs = blogs.slice(0, 2);

		// Render each blog in the footer
		recentBlogs.forEach((blog) => {
			// Format date
			const blogDate = new Date(blog.createdAt);
			const formattedDate = blogDate.toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
			});

			// Determine image URL
			let imageUrl;
			if (blog.image) {
				if (blog.image.startsWith('http')) {
					imageUrl = blog.image;
				} else if (blog.image.includes('/uploads/')) {
					imageUrl = `${API_BASE_URL}${blog.image}`;
				} else {
					imageUrl = `${API_BASE_URL}/uploads/blog/${blog.image}`;
				}
			} else if (blog.imageUrl) {
				imageUrl = blog.imageUrl;
			} else {
				imageUrl = 'images/blog-default.jpg';
			}

			// Create truncated title for footer (max 60 chars)
			const truncatedTitle =
				blog.title.length > 60
					? blog.title.substring(0, 60) + '...'
					: blog.title;

			// Create blog HTML for footer
			const blogHTML = `
                <div class="block-21 mb-4 d-flex">
                    <a href="blog-single.html?id=${
											blog._id
										}" class="blog-img mr-4" style="background-image: url('${imageUrl}');"></a>
                    <div class="text">
                        <h3 class="heading"><a href="blog-single.html?id=${
													blog._id
												}">${truncatedTitle}</a></h3>
                        <div class="meta">
                            <div><a href="blog-single.html?id=${
															blog._id
														}"><span class="icon-calendar"></span> ${formattedDate}</a></div>
                            <div><a href="#"><span class="icon-person"></span> ${
															blog.author?.name || 'Admin'
														}</a></div>
                            <div><a href="blog-single.html?id=${
															blog._id
														}"><span class="icon-chat"></span> ${
				blog.comments?.length || 0
			}</a></div>
                        </div>
                    </div>
                </div>
            `;

			footerBlogSection.innerHTML += blogHTML;
		});
	} catch (error) {
		console.error('Failed to load blogs for footer:', error);
		let footerBlogSection = document.querySelector('#recent-blog-posts');
		if (!footerBlogSection) {
			footerBlogSection = document.querySelector(
				'.ftco-footer-widget.mb-4 div h2.ftco-heading-2:contains("Recent Blog")'
			).parentElement;
		}
		if (!footerBlogSection) {
			footerBlogSection = document.querySelector('.ftco-footer-widget.mb-4');
		}
		if (footerBlogSection) {
			footerBlogSection.innerHTML =
				'<h2 class="ftco-heading-2">Recent Blog</h2><p>Unable to load blog posts.</p>';
		}
	}
});
