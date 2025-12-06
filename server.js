const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');
const port = process.env.PORT || 3000;

const mongoose = require('mongoose');
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,  
    useCreateIndex: true,
    useFindAndModify: false
  }).then(() => console.log('DB connection successful!'));

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  rating: Number,
})

const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
  name: 'The Forest Hiker',
  price: 497,
  rating: 4.7,
});

testTour.save().then(doc => {
  console.log('Tour saved:', doc);
}).catch(err => {
  console.error('Error saving tour:', err);
});

// Start server region
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});