import express from 'express';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import cvRoutes from './routes/cvRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

initializeDatabase().then(() => {
    console.log('Database initialization complete.');

    app.use('/api/auth', authRoutes);
    app.use('/api/cv', cvRoutes);
    app.use('/api/analytics', analyticsRoutes);
    app.use('/api/ai', aiRoutes);

    app.use((err, req, res, next) => {
        console.error(err); // Log the error for debugging
        const statusCode = err.statusCode || 500;
        const message = err.statusCode ? err.message : 'An unexpected error occurred.';

        res.status(statusCode).json({
            status: 'error',
            message: message
        });
    });
    
    app.listen(port, () => {
        console.log(`Backend server listening at http://localhost:${port}`);
    });

}).catch(error => {
    console.error('Failed to start the server due to database initialization error:', error);
    process.exit(1);
});
