const express = require('express')
const path = require('path');
require('dotenv').config();
const clientRouter = require('./routes/clientRouter')
const rootDir = require("./utils/pathUtils");
const { monitorEventLoopDelay } = require('perf_hooks');
const { default: mongoose } = require('mongoose');
const { razorpay, WEBHOOK_SECRET } = require('./config/razorpay');
const crypto = require('crypto');
const fs = require('fs');
const app = express();
const MONGODB_URI = process.env.MONGODB_URL;
app.set('view engine', 'ejs');
app.set('views', 'views');

const db_path = MONGODB_URI;




app.use(express.json());
app.use(express.urlencoded());

app.use(express.static(path.join(rootDir, 'public')))

// Serve React build if it exists
const reactBuildPath = path.join(rootDir, 'client', 'dist');
const hasReactBuild = fs.existsSync(reactBuildPath);

if (hasReactBuild) {
  app.use(express.static(reactBuildPath));
}

app.use(clientRouter);

// React client-side routing fallback
if (hasReactBuild) {
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(reactBuildPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 3000;

mongoose.connect(db_path).then(() => {
  console.log("Connected to database");
  app.listen(PORT, () => {
    console.log('Server is running');
  });
}).catch((err) => {
  console.log(err);
})

