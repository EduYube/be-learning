const path = require('path');
const Tour = require('../models/tourModel');

// Methods region

// get all tours
exports.getAllTours = async (req, res) => {

  try {
    const tours = await Tour.find();
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours
    }});
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// get a specific tour marked by id
// could mkae optional parameters with '?' after param name, f.ex. ':id?'
exports.getTour = async (req, res) => {
  try{
    const tour = await Tour.findById(req.params.id);
    if(tour){
      res.status(200).json({
        status: 'success',
        data: {
          tour
        }
      });
    }
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// create a new tour
exports.createTour = async (req, res) => {
 try {
  const newTour =  await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour
    }
  });
 } catch (err) {
   res.status(400).json({
     status: 'fail',
     message: err.message
   });
 }

};

// update a tour. Better to use PATCH for partial updates instead of PUT with the full object
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// delete a tour
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};
