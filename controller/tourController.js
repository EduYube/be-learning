const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

// Methods region

exports.checkId = (req, res, next, val) => {
  console.log(`Tour ID: ${val}`);
  if (isNaN(val) || val > tours.length) { // assuming ids are sequential and start from 1
    return res.status(404).json({
      status: 'fail', 
      message: 'Invalid ID'
    });
  }    
  next();
};

// get all tours
exports.getAllTours = (req, res) => {
  timeStamp = new Date().toISOString();
  res.status(200).json({
    status: 'success',
    requestTime: req.requestTime, // \wo middleware we need to declare requestTime: req.requestTime = new Date().toISOString() in every single route handler,
    results: tours.length,
    data: {
      tours
    }
  });
};

// get a specific tour marked by id
// could mkae optional parameters with '?' after param name, f.ex. ':id?'
exports.getTour = (req, res) => {
  const id = req.params.id * 1; // convert string to number
  const tour = tours.find(el => el.id === id);
  if(tour){
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  }
};

// create a new tour
exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      if (err) {
        console.log('Error writing file', err);
        res.status(500).json({
          status: 'error',
          message: 'Could not save the tour'
        });
      } else {
        res.status(201).json({
        status: 'success',
        data: {
          message: `Tour ${newTour.name} created successfully`,
        }
  });
      }
    }
  );

};

// update a tour. Better to use PATCH for partial updates instead of PUT with the full object
exports.updateTour = (req, res) => {

  const id = req.params.id * 1; // convert string to number
  const oldTour = tours.find(el => el.id === id);

  if(!oldTour){
    return res.status(404).json({
      status: 'fail',
      message: 'Tour to modify not found'
    });
  }

  const updatedTour = Object.assign(oldTour, req.body);

  tours[id] = updatedTour;
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      if (err) {
        console.log('Error writing file', err);
        res.status(500).json({
          status: 'error',
          message: 'Could not update the tour'
        });
      } else {
        res.status(200).json({
          status: 'success',
          data: {
            message: `Tour ${updatedTour.name} updated successfully`,
          }
        });
      }
    }
  );
};

// delete a tour
exports.deleteTour = (req, res) => {
  const id = req.params.id * 1; // convert string to number
  const tour = tours.find(el => el.id === id);

  if(!tour){
    return res.status(404).json({
      status: 'fail',
      message: 'Tour to delete not found'
    });
  }
  
  tours.splice(tour.id, 1); 
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      if (err) {
        console.log('Error writing file', err);
        res.status(500).json({
          status: 'error',
          message: 'Could not delete the tour'
        });
      } else {
        res.status(200).json({
          status: 'success',
          data: {
            message: `Tour ${tour.name} deleted successfully`,
          }
        });
      }
    }
  );
};
