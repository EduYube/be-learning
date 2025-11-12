const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

const port = 3000;
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
});

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
        return res.status(500).json({
          status: 'error',
          message: 'Could not save the tour'
        });
      } else {
        return res.status(201).json({
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