const fs = require('fs');
const path = require('path');

const faviconMetaTags = `
    <!-- Favicon -->
    <link rel="apple-touch-icon" sizes="180x180" href="images/favicon/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="images/favicon/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="images/favicon/favicon-16x16.png">
    <link rel="manifest" href="images/favicon/site.webmanifest">
    <link rel="mask-icon" href="images/favicon/safari-pinned-tab.svg" color="#5bbad5">
    <meta name="msapplication-TileColor" content="#da532c">
    <meta name="theme-color" content="#ffffff">
`;

// Get all HTML files
const htmlFiles = fs.readdirSync('.').filter((file) => file.endsWith('.html'));

htmlFiles.forEach((file) => {
	console.log(`Processing ${file}...`);

	// Read the file content
	let content = fs.readFileSync(file, 'utf8');

	// Check if favicon tags already exist
	if (content.includes('apple-touch-icon')) {
		console.log(`Favicon tags already exist in ${file}`);
		return;
	}

	// Find the position to insert the favicon tags (after charset meta tag)
	const insertPosition =
		content.indexOf('<meta charset="utf-8">') + '<meta charset="utf-8">'.length;

	// Insert the favicon tags
	content =
		content.slice(0, insertPosition) +
		faviconMetaTags +
		content.slice(insertPosition);

	// Write the modified content back to the file
	fs.writeFileSync(file, content);
	console.log(`Added favicon tags to ${file}`);
});
