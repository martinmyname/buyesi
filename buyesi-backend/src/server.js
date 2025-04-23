const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const causeRoutes = require('./routes/cause.routes');
const teamRoutes = require('./routes/team.routes');
const blogRoutes = require('./routes/blog.routes');
const eventRoutes = require('./routes/event.routes');
const galleryRoutes = require('./routes/gallery.routes');
const contactRoutes = require('./routes/contact.routes');
const donationRoutes = require('./routes/donation.routes');
const volunteerRoutes = require('./routes/volunteer.routes');
const adminRoutes = require('./routes/admin.routes');

// Load environment variables
dotenv.config();

// Debug environment variables
console.log('Environment variables loaded:');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Present' : 'Missing');
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Initialize Express
const app = express();

// Middleware
app.use(
	cors({
		origin: '*', // Allow all origins in development
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		credentials: true,
		exposedHeaders: ['Content-Length', 'Content-Type'],
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Configure Helmet but disable crossOriginResourcePolicy for images to be accessible
app.use(
	helmet({
		crossOriginResourcePolicy: { policy: 'cross-origin' },
	})
);

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/causes', causeRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/galleries', galleryRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/admin', adminRoutes);

// Root route
app.get('/', (req, res) => {
	res.send('Welcome to Buyesi Youth Initiative API');
});

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({
		success: false,
		message: 'Internal Server Error',
		error: process.env.NODE_ENV === 'development' ? err.message : {},
	});
});

// Connect to MongoDB
mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => {
		console.log('Connected to MongoDB');
		// Start server
		const PORT = process.env.PORT || 5000;
		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
	})
	.catch((err) => {
		console.error('MongoDB connection error:', err);
		process.exit(1);
	});
