const path = require('path');
const Tour = require('../models/tourModel');

// Middleware region

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-rating,-price';
  req.query.fields = 'name,price,rating,difficulty';
  next();
}

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

    let query = await Tour.find(queryObj);

    // sorting
    if(req.query.sort){
      const sortBy = req.query.sort.split(',').join(' '); // to allow multiple sort criteria separated by comma
      query = query.sort(sortBy);
    } else {
      query = query.sort('-price'); // default sort by price descending because the - operator
    }

    // limiting fields
    if(req.query.fields){
      const fields = req.query.fields.split(',').join(' '); // to allow multiple fields separated by comma
      query = query.select(fields);
    } else {
      query = query.select('-__v'); // exclude __v field by default
    }

    // pagination
    const page = req.query.page * 1 || 1; // default to page 1
    const limit = req.query.limit * 1 || 10; // default to 10 results per page
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    // if the requested page is out of range
    if(req.query.page){
      const numTours = await Tour.countDocuments(); // get total number of documents
      if(skip >= numTours){
        throw new Error('This page does not exist');
      }
    }

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
