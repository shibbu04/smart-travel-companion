import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const API_BASE_PATH = process.env.API_BASE_PATH || '/api';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS ? 
  process.env.ALLOWED_ORIGINS.split(',') : 
  ['http://localhost:3000', 'http://127.0.0.1:3000'];

// Middleware
app.use(cors({
  origin: ALLOWED_ORIGINS,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

// Simple file-based storage for WebContainer compatibility
const DATA_STORAGE_PATH = process.env.DATA_STORAGE_PATH || './data';
const DATA_FILE = join(__dirname, DATA_STORAGE_PATH, 'locations.json');

// Ensure data directory exists
const dataDir = dirname(DATA_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Helper functions for file operations
const readLocations = () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error reading locations:', error);
    return [];
  }
};

const writeLocations = (locations) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(locations, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing locations:', error);
    return false;
  }
};

// Routes
app.get(`${API_BASE_PATH}/health`, (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get all locations
app.get(`${API_BASE_PATH}/locations`, (req, res) => {
  try {
    const locations = readLocations();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

// Add new location
app.post(`${API_BASE_PATH}/locations`, (req, res) => {
  try {
    const { latitude, longitude, timestamp, address } = req.body;

    if (!latitude || !longitude || !timestamp) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const locations = readLocations();
    const newLocation = {
      id: Date.now().toString(),
      latitude,
      longitude,
      timestamp,
      address: address || null
    };

    locations.push(newLocation);
    
    if (writeLocations(locations)) {
      res.status(201).json(newLocation);
    } else {
      res.status(500).json({ error: 'Failed to save location' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to add location' });
  }
});

// Delete all locations
app.delete(`${API_BASE_PATH}/locations`, (req, res) => {
  try {
    if (writeLocations([])) {
      res.json({ message: 'All locations deleted' });
    } else {
      res.status(500).json({ error: 'Failed to delete locations' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete locations' });
  }
});

// Get location by ID
app.get(`${API_BASE_PATH}/locations/:id`, (req, res) => {
  try {
    const locations = readLocations();
    const location = locations.find(loc => loc.id === req.params.id);
    
    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }
    
    res.json(location);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch location' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}${API_BASE_PATH}/health`);
  console.log(`🌐 Allowed origins: ${ALLOWED_ORIGINS.join(', ')}`);
  console.log(`📁 Data storage: ${DATA_FILE}`);
});