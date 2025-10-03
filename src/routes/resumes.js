const express = require('express');
const multer = require('multer');
const path = require('path');
const { uploadResume, listResumes } = require('../controllers/resumes');

const router = express.Router();

const upload = multer({ dest: path.join(__dirname, '../../uploads') });

router.get('/', listResumes);
router.post('/', upload.single('resume'), uploadResume);

module.exports = router;


