const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const cors = require('cors');

//use cors to allow cross origin resource sharing
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.post('/calculate', (req, res) => {
    console.log("In proxy server to calculate expression");
    let inputExpression = req.body.expression;
    let result = eval(inputExpression);
    if(!isNaN(result)){
      result = Number((result).toFixed(5));
    }
    console.log("Result:"+result);
    res.send({"result": result});
});