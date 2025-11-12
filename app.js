const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

const port = 3000;
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

// get all tours
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
});

// get a specific tour marked by id
// could mkae optional parameters with '?' after param name, f.ex. ':id?'
app.get('/api/v1/tours/:id', (req, res) => {
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
});

// create a new tour
app.post('/api/v1/tours', (req, res) => {
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

});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});