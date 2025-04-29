// Admin Upload Utility for Cloudinary
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin upload utility initialized');

    // Function to create an upload button dynamically and append it to a target container
    function createUploadButton(containerId, inputId, buttonText = 'Upload Image') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container not found: ${containerId}`);
            return;
        }

        // Create button and hidden input
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'btn btn-primary upload-btn';
        button.textContent = buttonText;

        const input = document.createElement('input');
        input.type = 'hidden';
        input.id = inputId;
        input.name = 'image';

        const imagePreview = document.createElement('div');
        imagePreview.className = 'image-preview mt-3';
        imagePreview.style.display = 'none';

        // Append elements
        container.appendChild(button);
        container.appendChild(input);
        container.appendChild(imagePreview);

        // Add click handler
        button.addEventListener('click', function() {
            if (window.uploadImage) {
                window.uploadImage(function(error, url) {
                    if (!error && url) {
                        input.value = url;
                        
                        // Show preview
                        imagePreview.style.display = 'block';
                        imagePreview.innerHTML = `
                            <div class="card" style="max-width: 300px;">
                                <img src="${url}" class="card-img-top" alt="Uploaded image">
                                <div class="card-body">
                                    <p class="card-text">Image uploaded successfully!</p>
                                </div>
                            </div>
                        `;
                    }
                });
            } else {
                alert('Upload functionality not available. Make sure Cloudinary scripts are loaded.');
            }
        });

        console.log(`Upload button created for ${containerId}`);
        return { button, input, imagePreview };
    }

    // Make function available globally
    window.createCloudinaryUploadButton = createUploadButton;

    // Look for elements with data-cloudinary-upload attribute
    document.querySelectorAll('[data-cloudinary-upload]').forEach(function(container) {
        const inputId = container.getAttribute('data-input-id') || 'imageInput';
        const buttonText = container.getAttribute('data-button-text') || 'Upload Image';
        
        createUploadButton(container.id, inputId, buttonText);
    });
}); 