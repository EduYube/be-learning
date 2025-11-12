const express = require('express');
// Methods region

//get user
const getAllUsers = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined'
    });
  };

// Routes region
const router = express.Router();

router
  .route('/')
  .get(getAllUsers);

module.exports = router;