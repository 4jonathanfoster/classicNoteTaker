const express = require(`express`);
//const apiroutes = require(`./Routes/apiroutes`);
//const htmlroutes = require(`./Routes/htmlroutes`);
const app = express();
const path = require('path')
const db = require('./db/db.json')

const fs = require('fs')

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"))
//app.use("/api", apiroutes)
//app.use("/", htmlroutes)

app.get('/notes',function(req,res){
    console.log('we hit the route')
    //res.send ('hello from the route')
    res.sendFile(path.join(__dirname, './public','notes.html'));
})
console.log('dirname thing ?', __dirname)

app.get('/api/notes',function(req,res){
    console.log('we hit hte /api/notes route!!', db)
    // fs.readFile('./db/db.json', 'utf8',function(err,data) {
    //     console.log('data we read in', data, err)
    //     res.json(JSON.parse(data))
    // } )
    res.json(db)  
  //  res.sendFile(path.join(__dirname, './public','notes.html'));
})


app.post('/api/notes', function(req, res){
    console.log('New note to save!', req.body)

    // take req.body and add it to the db thing we imported!!

    // maybe a .push() !!

})


app.listen(PORT, () => {
    console.log(`App listening on PORT: ${PORT}`);
});