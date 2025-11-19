const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');
const port = process.env.PORT || 3000;
// Start server region
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});