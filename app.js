/**
 * Main application file.
 * Initializes the Express server, connects to MongoDB via Mongoose,
 * sets up middleware (sessions, CSRF protection, file uploads via Multer),
 * and defines the core routing structure.
 */
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
// Importing the new mongoose function instead of mongoConnect.
const mongoose = require('mongoose');
const session = require('express-session');
// 1. Import the package and pass the session object to it
const MongoDBStore = require('connect-mongodb-session')(session); 
const csrf = require('csurf');
const flash = require('connect-flash');
// Import the error controller
const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI = 'ADD_YOUR_MONGODB_CONNECTION_STRING_HERE';

// 2. Initialize the store pointing to your exact database
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions' // It will automatically create this collection
});
const csrfProtection = csrf();
const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth'); // Import new routes

app.set('view engine', 'ejs');
app.set('views', 'views'); // Tells Express where to look for templates

app.use(bodyParser.urlencoded({extended: false}));

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store // This tells it to save in MongoDB now!
  })
);
// Register CSRF Protection (Must be AFTER session is created)
app.use(csrfProtection);
app.use(flash());

// NEW MIDDLEWARE: Rehydrating the Mongoose User object
app.use((req, res, next) => {
  // 1. If there is no user in the session (not logged in), skip this entirely!
  if (!req.session.user) {
    return next();
  }
  
  // 2. If a session user exists, use their ID to fetch the real Mongoose model
  User.findById(req.session.user._id)
    .then(user => {
      // 3. Attach the fully powered Mongoose user object to the request
      req.user = user; 
      next();
    })
    .catch(err => {
      // Inside asynchronous code (like Promises), throw new Error() does not reach the Express error handling middleware.
      // We must explicitly use next(new Error(err)) to forward the crash to the global 500 error page.
      next(new Error(err));
    });
});

// This middleware uses res.locals to pass the CSRF token and the 
// authentication status to every single EJS view automatically.
// This eliminates the need to manually pass them in every controller.
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// Use the error controller to handle 404 and 505 requests

app.get('/500', errorController.get500);
app.use(errorController.get404);

// This special 4-argument middleware is the centralized error handler for the Express application. 
// Any route or controller calling next(error) will skip all other middlewares and jump directly to this block.
app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).render('500', {
    pageTitle: 'Error!',
    path: '/500',
    isAuthenticated: req.session ? req.session.isLoggedIn : false
  });
});

// Updated the database connection to use Mongoose instead of the native MongoDB driver.
// Mongoose manages the connection pool for us and simplifies database interactions.
mongoose
  .connect(MONGODB_URI)
  .then(result => {
    app.listen(3000);
    console.log('Connected via Mongoose!');
  })
  .catch(err => {
    console.log(err);
  });