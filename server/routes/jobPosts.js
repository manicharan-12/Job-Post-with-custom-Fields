//server/routes/jobPosts.js
const express = require('express');
const JobPost = require('../models/JobPost');
const router = express.Router();

// Create a new job post
router.post('/', async (req, res) => {
  try {
    const jobPost = new JobPost(req.body);
    await jobPost.save();
    res.status(201).send(jobPost);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Get all job posts
router.get('/', async (req, res) => {
  try {
    const jobPosts = await JobPost.find();
    res.status(200).send(jobPosts);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get a specific job post by ID
router.get('/:id', async (req, res) => {
  try {
    const jobPost = await JobPost.findById(req.params.id);
    if (!jobPost) {
      return res.status(404).send();
    }
    res.status(200).send(jobPost);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update a job post by ID
router.put('/:id', async (req, res) => {
  try {
    const jobPost = await JobPost.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!jobPost) {
      return res.status(404).send();
    }
    res.status(200).send(jobPost);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Delete a job post by ID
router.delete('/:id', async (req, res) => {
  try {
    const jobPost = await JobPost.findByIdAndDelete(req.params.id);
    if (!jobPost) {
      return res.status(404).send();
    }
    res.status(200).send(jobPost);
  } catch (err) {
    res.status(500).send(err);
  }
});


router.post('/', async (req, res) => {
    try {
      const jobPost = new JobPost(req.body);
      await jobPost.save();
      io.emit('notification', { message: `New job post created: ${jobPost.title}` });
      res.status(201).send(jobPost);
    } catch (err) {
      res.status(400).send(err);
    }
  });

  
module.exports = router;