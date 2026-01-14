require("dotenv").config();
const express = require('express');
const cookieParser = require("cookie-parser");
const app = express();

const connectDB = require('./connection');

const staticPath = require('./staticroutes');
const authRoutes = require('./routes/auth');
const homeRoutes = require('./routes/home');
const staleUserRoutes = require('./routes/staleusers');
const rateLimitRoutes = require('./routes/rateLimit.routes');
const failedJobRoutes = require("./routes/failedJob");
const startFailedJobCron = require("./jobs/cron");
const healthCheckRoutes = require('./routes/healthCheck');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", "./views");

app.use('/',staticPath);
app.use('/authorization',authRoutes);
app.use('/home',homeRoutes);
app.use('/admin/staleusers',staleUserRoutes);
app.use('/ratelimit',rateLimitRoutes);
app.use('/api/failed-jobs', failedJobRoutes);
app.use('/api/health-check',healthCheckRoutes);

const { startHealthCheckCron } = require("./jobs/healthCheck.job");

connectDB("mongodb://127.0.0.1:27017/scheduler")
  .then(() => {
    console.log("MongoDB connected");
    startHealthCheckCron();
    startFailedJobCron();
  })
  .catch(err => console.error("DB connection error:", err));

require('./jobs/staleusers.job');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});