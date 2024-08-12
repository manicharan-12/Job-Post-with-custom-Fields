// /server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const jobPosts = require('./routes/jobPosts');
const registrationFields = require('./routes/registrationFields')
const admin=require('./routes/admin')

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
mongoose.connect('mongodb+srv://gademanicharan12:jobPost@cluster0.bk1tf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.use('/api/jobPosts', jobPosts);
app.use('/api/registrationFields', registrationFields);
app.use("/api/admin",admin)

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
