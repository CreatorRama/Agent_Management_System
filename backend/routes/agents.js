const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const agentController = require('../controllers/agentController');
const router = express.Router();

// @route   POST api/agents
// @desc    Create new agent
// @access  Private
router.post('/', [
  auth,
  body('name', 'Name is required').not().isEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('mobileNumber', 'Mobile number is required').not().isEmpty(),
  body('password', 'Password must be 6 or more characters').isLength({ min: 6 })
], agentController.createAgent);


router.get('/', auth, agentController.getAllAgents);

module.exports = router;