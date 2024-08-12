//server/models/JobPost.js
const mongoose = require('mongoose');

const customFieldSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true },
  mandatory: { type: Boolean, default: false },
});

const jobPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  salary: { type: String },
  salaryNotDisclosed: { type: Boolean, default: false },
  description: { type: String, required: true },
  aboutUs: { type: String },
  qualifications: { type: String },
  role: { type: String },
  industryType: { type: String },
  employmentType: { type: String, required: true },
  keySkillsMandatory: { type: String },
  keySkillsNiceToHave: { type: String },
  customFields: [customFieldSchema],
});

const JobPost = mongoose.model('JobPost', jobPostSchema);

module.exports = JobPost;