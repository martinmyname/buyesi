document.addEventListener('DOMContentLoaded', async function () {
	try {
		// Get the blog ID from the URL
		const urlParams = new URLSearchParams(window.location.search);
		const blogId = urlParams.get('id');

		if (!blogId) {
			showError('No blog ID specified');
			return;
		}

		// Get elements
		const blogContainer = document.querySelector('.blog-container');
		const blogTitle = document.querySelector('.blog-title');
		const blogImage = document.querySelector('.blog-image');
		const blogDate = document.querySelector('.blog-date');
		const blogAuthor = document.querySelector('.blog-author');
		const blogContent = document.querySelector('.blog-content');
		const commentCount = document.querySelector('.comment-count');
		const commentsContainer = document.querySelector('.comments-container');

		if (
			!blogContainer ||
			!blogTitle ||
			!blogImage ||
			!blogDate ||
			!blogAuthor ||
			!blogContent
		) {
			showError('Page elements not found');
			return;
		}

		// Show loading state
		blogContainer.innerHTML =
			'<div class="text-center my-5"><div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div></div>';

		// Fetch blog details from the API
		console.log('Fetching blog with ID:', blogId);
		const response = await window.API.blogAPI.getById(blogId);
		console.log('API Response:', response);

		// Handle both direct response and object with data property
		const blog = response && response.data ? response.data : response;
		console.log('Processed blog:', blog);

		if (!blog) {
			showError('Blog not found');
			return;
		}

		// Update page elements
		document.title = `${blog.title} - Buyesi Youth Initiative`;
		blogTitle.textContent = blog.title;

		// Format date
		const blogDateObj = new Date(blog.createdAt);
		const formattedDate = blogDateObj.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});

		// Reset the container
		blogContainer.innerHTML = '';

		// Rebuild the content structure
		const blogEntry = document.createElement('div');
		blogEntry.className = 'blog-entry';

		// Image
		const blogImageDiv = document.createElement('a');
		blogImageDiv.href = '#';
		blogImageDiv.className = 'block-20 blog-image mb-4';
		let imageUrl;
		if (blog.image) {
			if (blog.image.startsWith('http')) {
				imageUrl = blog.image;
			} else if (blog.image.includes('/uploads/')) {
				imageUrl = `http://localhost:5000${blog.image}`;
			} else {
				imageUrl = `http://localhost:5000/uploads/blog/${blog.image}`;
			}
			console.log('Image URL for blog:', imageUrl);
		} else if (blog.imageUrl) {
			imageUrl = blog.imageUrl;
		} else {
			imageUrl = 'images/blog-default.jpg';
		}
		blogImageDiv.style.backgroundImage = `url('${imageUrl}')`;
		blogEntry.appendChild(blogImageDiv);

		// Blog Meta
		const blogMeta = document.createElement('div');
		blogMeta.className = 'blog-meta mb-4';
		const dateDiv = document.createElement('div');
		dateDiv.innerHTML = `<span class="icon-calendar"></span> <span class="blog-date">${formattedDate}</span>`;
		const authorDiv = document.createElement('div');
		authorDiv.innerHTML = `<span class="icon-person"></span> <span class="blog-author">${
			blog.author || 'Admin'
		}</span>`;
		blogMeta.appendChild(dateDiv);
		blogMeta.appendChild(authorDiv);
		blogEntry.appendChild(blogMeta);

		// Content
		const blogContentDiv = document.createElement('div');
		blogContentDiv.className = 'blog-content';
		blogContentDiv.innerHTML = blog.content;
		blogEntry.appendChild(blogContentDiv);

		blogContainer.appendChild(blogEntry);

		// Comment count
		if (commentCount) {
			const count = blog.comments?.length || 0;
			commentCount.textContent =
				count === 1 ? '1 Comment' : `${count} Comments`;
		}

		// Comments
		if (commentsContainer && blog.comments && blog.comments.length > 0) {
			commentsContainer.innerHTML = '';

			blog.comments.forEach((comment) => {
				const commentDate = new Date(comment.createdAt);
				const formattedCommentDate = commentDate.toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'long',
					day: 'numeric',
				});

				const commentHTML = `
          <div class="comment">
            <div class="comment-body">
              <h3>${comment.name}</h3>
              <div class="meta">${formattedCommentDate}</div>
              <p>${comment.content}</p>
            </div>
          </div>
        `;

				commentsContainer.innerHTML += commentHTML;
			});
		} else if (commentsContainer) {
			commentsContainer.innerHTML =
				'<p>No comments yet. Be the first to comment!</p>';
		}

		// Handle comment form if it exists
		const commentForm = document.querySelector('.comment-form');
		if (commentForm) {
			setupCommentForm(commentForm, blog);
		}
	} catch (error) {
		console.error('Failed to load blog details:', error);
		showError('Error loading blog details. Please try again later.');
	}
});

function setupCommentForm(form, blog) {
	form.addEventListener('submit', async function (e) {
		e.preventDefault();

		// Get form data
		const name = document.getElementById('name').value;
		const email = document.getElementById('email').value;
		const message = document.getElementById('message').value;

		// Form validation
		if (!name || !email || !message) {
			showAlert('Please fill in all required fields', 'danger', form);
			return;
		}

		// Disable submit button and show loading state
		const submitBtn = form.querySelector('input[type="submit"]');
		const originalBtnValue = submitBtn.value;
		submitBtn.value = 'Submitting...';
		submitBtn.disabled = true;

		try {
			// Use the window.API object and API_BASE_URL constant
			const API_BASE_URL = 'http://localhost:5000/api';
			const response = await fetch(
				`${API_BASE_URL}/blogs/${blog._id}/comments`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						name,
						email,
						content: message,
						blogId: blog._id,
					}),
				}
			);

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || 'Failed to submit comment');
			}

			// Clear form
			form.reset();

			// Show success message
			showAlert(
				'Your comment has been submitted successfully!',
				'success',
				form
			);

			// Optionally refresh the page to show the new comment
			setTimeout(() => {
				window.location.reload();
			}, 2000);
		} catch (error) {
			console.error('Failed to submit comment:', error);
			showAlert(
				'Failed to submit comment. Please try again later.',
				'danger',
				form
			);
		} finally {
			// Restore submit button
			submitBtn.value = originalBtnValue;
			submitBtn.disabled = false;
		}
	});
}

function showError(message) {
	const mainContent = document.querySelector('.ftco-section');
	if (mainContent) {
		mainContent.innerHTML = `
      <div class="container">
        <div class="row">
          <div class="col-md-12 text-center">
            <div class="alert alert-danger">
              ${message}
            </div>
            <a href="blog.html" class="btn btn-primary">Back to Blog</a>
          </div>
        </div>
      </div>
    `;
	}
}

function showAlert(message, type, targetForm) {
	const alertDiv = document.createElement('div');
	alertDiv.className = `alert alert-${type} mt-3`;
	alertDiv.textContent = message;

	// Insert alert before the form or after it
	if (targetForm) {
		targetForm.parentNode.insertBefore(alertDiv, targetForm.nextSibling);
	}

	// Auto remove after 5 seconds
	setTimeout(() => {
		alertDiv.remove();
	}, 5000);
}
