var express = require('express');

var app = express();

var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cors = require('cors');

const graphqlHTTP = require('express-graphql');
var schema = require('./graphqlSchema/schema');
var mongoose = require('mongoose');


var connStr = 'mongodb+srv://root:password631@273-qoppd.mongodb.net/canvas?retryWrites=true';

mongoose.connect(connStr, { useNewUrlParser: true, poolSize: 10, })
.then(() =>  console.log('connection to mongodb successful'))
  .catch((err) => console.error(err));

//set up cors
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use(session({
    secret: 'cmpe273-canvas-graphql-app',
    resave: false,
    saveUninitialized: false,
    duration: 60 * 60 * 100,
    activeDuration: 5 * 60 * 100
}));

app.use(bodyParser.json());

//Allow acceess control headers
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});


app.use("/graphql",graphqlHTTP(
    {
    schema: schema,
    rootValue: global,
    graphiql: true
}));


app.listen(8080, ()=>{
    console.log("GraphQL server started on port 8080");
});

