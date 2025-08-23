const express = require('express');
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const listController = require('../controllers/listController');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.csv', '.xlsx', '.xls'];
  const fileExtension = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only CSV, XLSX, and XLS files are allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// @route   POST api/lists/upload
// @desc    Upload and distribute CSV
// @access  Private
router.post('/upload', auth, upload.single('file'), listController.uploadAndDistribute);

// @route   GET api/lists
// @desc    Get all agent lists
// @access  Private
router.get('/', auth, listController.getAgentLists);

module.exports = router;