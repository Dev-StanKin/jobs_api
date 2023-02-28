require('dotenv').config();
require('express-async-errors');
const helmet = require('helmet');
const cors = require('cors');
const rateLimiter = require('express-rate-limit');
const xss = require('xss-clean');
const express = require('express');
const app = express();

const connectDB = require('./db/connect');
const authenticateUser = require('./middleware/authentication');
// error handler
const authRoute = require('./routes/auth');
const jobsRoute = require('./routes/jobs');
// connect DB
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
app.set('trust proxy', 1);
app.use(express.json());
// extra packages
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
app.use(cors());
app.use(xss());
app.use(helmet());

app.get('/',(req, res) =>{
  res.send('jobs-api')
})
// routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/job', authenticateUser, jobsRoute);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
