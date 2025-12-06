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

// Start server region
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});