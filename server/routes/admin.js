// server/routes/admin.js
const express = require('express');
const JobPost = require('../models/JobPost');
const router = express.Router();

// Get custom fields usage
router.get('/custom-fields-usage', async (req, res) => {
  try {
    const customFieldsUsage = await JobPost.aggregate([
      { $unwind: "$customFields" },
      { $group: { _id: "$customFields.label", count: { $sum: 1 } } }
    ]);
    res.status(200).json(customFieldsUsage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new custom field to specific job posts
router.post('/add-custom-field', async (req, res) => {
  try {
    const { jobPostIds, label, value, mandatory } = req.body;

    if (!jobPostIds || !label || !value) {
      return res.status(400).json({ message: "JobPost IDs, label, and value are required" });
    }

    // Update the specified job postings with the new custom field
    await JobPost.updateMany(
      { _id: { $in: jobPostIds } },
      { $push: { customFields: { label, value, mandatory: mandatory || false } } }
    );

    res.status(200).json({ message: "Custom field added successfully to the specified job postings" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove a specific custom field from a specific job post
router.delete('/:jobId/customField/:fieldId', async (req, res) => {
  const { jobId, fieldId } = req.params;

  try {
    const jobPost = await JobPost.findByIdAndUpdate(
      jobId,
      { $pull: { customFields: { _id: fieldId } } },
      { new: true }
    );

    if (!jobPost) {
      return res.status(404).send({ error: "Job post not found" });
    }

    res.status(200).send(jobPost);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

module.exports = router;
