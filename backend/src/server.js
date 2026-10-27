const http = require('http');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Fallback MongoDB URI & Secret for Cloud Deployment
if (!process.env.MONGO_URI || process.env.MONGO_URI.includes('<') || !process.env.MONGO_URI.startsWith('mongodb')) {
  process.env.MONGO_URI = "mongodb+srv://ashvanisingh930_db_user:Ashvani%40930@cluster0.lbhzsid.mongodb.net/hospital_management?retryWrites=true&w=majority";
}
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "caresync_secret_jwt_2026";
}

const app = require('./app');
const connectDB = require('./config/db');
const { initSocket } = require('./utils/socket');
const initDemoAccounts = require('./config/initDemoAccounts');

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize Socket.IO on HTTP server
initSocket(server);

// Connect to MongoDB Atlas
connectDB().then(async () => {
  await initDemoAccounts();
  if (process.env.NODE_ENV !== 'test') {
    server.listen(PORT, () => {
      console.log(`🚀 CareSync Server running on http://localhost:${PORT}`);
    });
  }
}).catch((err) => {
  console.error('Fatal Database Connection Error:', err.message);
  process.exit(1);
});

module.exports = { app, server };
