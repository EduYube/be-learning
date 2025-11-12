const express = require('express');
const { getAllUsers } = require('../controller/userController');

// Routes region
const router = express.Router();

router
  .route('/')
  .get(getAllUsers);

module.exports = router;