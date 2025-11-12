const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

const app = express();

// Middleware region
// Use morgan middleware for logging
app.use(morgan('dev'));

app.use(express.json()); // Middleware to parse JSON bodies

// Dummy middleware to add request timestamp conversion and make it usable in all requests
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Methods region
const port = 3000;
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

// get all tours
const getAllTours = (req, res) => {
  const timeStamp = req.requestTime;
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
const getTour = (req, res) => {
  const id = req.params.id * 1; // convert string to number
  const tour = tours.find(el => el.id === id);
  if(tour){
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } else {
    res.status(404).json({
      status: 'fail',
      message: 'Tour not found'
    });
  }
};

// create a new tour
const createTour = (req, res) => {
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
const updateTour = (req, res) => {

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
const deleteTour = (req, res) => {
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

// get user
const getAllUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined'
    });
  };

// Routes region
app.route('/api/v1/tours')
  .get(getAllTours)
  .post(createTour);

app.route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

app.route('/api/v1/users')
  .get(getAllUser);

// Start server region
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});