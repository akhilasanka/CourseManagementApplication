const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const bodyParser = require('body-parser');
var dbConnection = require('./src/dao/dbConnectionPool');
var loginSignupRoutes = require('./src/routes/loginSignupRoutes');
var profileRoutes = require('./src/routes/profileRoutes');
var courseRoutes = require('./src/routes/courseRoutes');
var announcementAssignmentRoutes = require('./src/routes/announcementAssignmentRoutes');
var filesRoutes = require('./src/routes/filesRoutes');
var StudentCourseRouteWithoutPooling = require('./src/routes/StudentCourseWithoutPooling');
var quizRoutes = require('./src/routes/quizRoutes');

app.use('/uploads', express.static(path.join(__dirname, '/uploads/')));

app.use(session({
    secret: 'cmpe273_canvas_node_react_mysql',
    resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration: 60 * 60 * 1000,    // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration: 5 * 60 * 1000
}));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
  });

  
  testDBConection = async() => {
    let con = await dbConnection();
    if(con){
      console.log("Connected to Database");
    }
  }
  testDBConection();

//use cors to allow cross origin resource sharing
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use('/', loginSignupRoutes);
app.use('/', profileRoutes);
app.use('/', courseRoutes);
app.use('/', announcementAssignmentRoutes);
app.use('/', filesRoutes);
app.use('/',quizRoutes);
//app.use('/', StudentCourseRouteWithoutPooling);


//app.use('/', quizRoutes);
// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));