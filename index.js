const express = require('express');
const app = express();
const port = 3000;
require('./model');
const bodyParser = require('body-parser');
const indexRouter = require('./routes/index')


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use('/',indexRouter);
app.use('/user',require('./routes/user'));
app.use('/book',require('./routes/book'));



app.listen(port, () => {
  console.log(`app is listening on port ${port}`)
})