const path = require('path');
const Tour = require('../models/tourModel');

// Methods region

// get all tours
exports.getAllTours = async (req, res) => {
  try {
    // BUILD THE QUERY
    let queryObj = { ...req.query }; // to avoid mutating req.query directly
    const excludedFields = ['page', 'sort', 'limit', 'fields']; // fields we want to exclude from filtering
    excludedFields.forEach(el => delete queryObj[el]);
    /*const tours = await Tour.find({ name: 'Tour name', price: {lte: 400}, rating: 4.7 }); una manera de filtrar apoyándonos en moongose es especificándo parámetros en el find() como JSON que suele venir en req.query*/
    /*const tours = await Tour.find().where('price').equals(499).where('rating').equals(4.7); la otra manera es usando lenguaje más similar a las BDD con verbos como where(...) lo malo es lo que se puede alargar*/

    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`); // add $ before gte, gt, lte, lt for mongoose query
    queryObj = JSON.parse(queryStr);

    const query = await Tour.find(queryObj);

    const tours = await query; // execute the query

    // SEND RESPONSE
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
