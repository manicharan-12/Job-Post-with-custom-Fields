//server/routes/registrationFields.js
const express = require('express');
const router = express.Router();


const registrationFields = [
  { label: 'Skills', value: 'skills' },
  { label: 'Certifications', value: 'certifications' },
  { label: 'Education', value: 'education' },
  { label: 'Experience', value: 'experience' },
];

router.get('/', (req, res) => {
  res.json(registrationFields);
});

module.exports = router;