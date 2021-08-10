const express = require(`express`);
const { v4: uuidv4 } = require('uuid');
const app = express();
const path = require('path')
const db = require('./db/db.json')
const fs = require('fs')

const app = express();
const PORT = 3000;
const PORT = process.env.PORT || 3000 


app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.get(`/api/notes` ,(req, res) => {
	console.log(`Notes Route`);
	res.json(db);
})

app.post(`/api/notes`, (req,res) => {
	console.log(`new note to save `);

	let newNote = req.body;
	newNote.id = uuidv4();
	db.push(newNote);
	fs.writeFileSync("./db/db.json" , JSON.stringify(db), (err) => {
	if(err) throw err;
	});
	res.send(db);
})

app.delete(`/api/notes/:id` , (req, res)=> {
	console.log(`Delete`);

  const removeIndex = db.findIndex( note => note.id === req.params.id );
  db.splice(removeIndex, 1);
	fs.writeFileSync("./db/db.json" , JSON.stringify(db), (err) => {
		if(err) throw err;
	});
	res.send(db);
})

app.get('/notes' , (req,res) => 
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('*' , (req,res) => 
  res.sendFile(path.join(__dirname, '/public/index.html'))
);


app.listen(PORT, () => {
  console.log(`App listening on PORT: ${PORT}`);
});
