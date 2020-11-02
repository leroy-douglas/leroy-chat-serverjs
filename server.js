const express = require("express");
//const methodOveride = require("method-override");
const cors = require('cors')

const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded( { extended: false } ));
//app.use(methodOveride("delete_method"));

const messages = [
  {
    id: 0,
    from: "Bart",
    text: "Eat my shorts!"
  },
  {
    id: 1,
    from: "Lisa",
    text: "If anyone wants me, I'll be in my room."
  },
  {
    id: 2,
    from: "Homer",
    text: "Doh!"
  },
  {
    id: 3,
    from: "Marge",
    text: "Oh, Homie!"
  },
  {
    id: 4,
    from: "Ned",
    text: "Okally-Dokally!"
  },
  {
    id: 5,
    from: "Mr. Burns",
    text: "Excellent!"
  },
  {
    id: 6,
    from: "Krusty the Clown",
    text: "I didn't do it!"
  },
  {
    id: 7,
    from: "Sideshow Bob",
    text: "Hello Bart"
  }
];

//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.
//const messages = [welcomeMessage];

// get all chat messages
app.get("/messages", (req,res) => res.json(messages));

app.get("/messages/latest", (req,res) => {
  if( messages.length > 10 ){
    res.json(messages.slice(-10));
  } else {
    res.json(messages);
  }
});


app.get("/messages/search", (req,res) => { 
  console.log("request", req.query)
  if(req.query && ("text" in req.query) && req.query.text.length){
    const found = messages.filter(msg => msg.text.toLowerCase().includes(req.query.text.toLowerCase()));
      if(found.length){
        res.json(found);
      } else {
        res.send(`Could not find messages with search text: ${req.query.text}`);
      }
    
  } else{
    res.send("Invalid: Did not receive a valid search query"); 
  }
  
});


// get the chat message with a specific id
app.get("/messages/:id", (req,res) => {
  const id = req.params.id;
  const found = messages.find( msg => msg.id == id );
  if(found){
    res.json(found)
  } else {
    res.status(400)
        .json( { msg: `Could not find message with id ${id}`} );
  }
  
});


// delete a chat message

app.delete("/messages", (req,res) => {
  const id = req.body.id;
  const pos = id ? messages.findIndex( msg => msg.id == id ) : -1 ;

  if( pos > -1 ){
    messages.splice( pos, 1);
    res.status(200).json("Delete Successful!");
  } else {
    res.status(400)
       .json( { msg: `Invalid id: Could not find message`} );
  }
});

// create a new chat message

app.post("/messages", (req,res) => {
  if(req.body.from && req.body.text){
    const msg = {};
    msg.id = messages.reduce((max, item) => (max.id > item.id) ? max : item, { id: -1}).id + 1;
    msg.from = req.body.from;
    msg.text = req.body.text;
    messages.push(msg);
    res.status(200).json(messages);
  } else {
    res.status(400).send("Invalid: You need to enter a name with a message");
  }
});


app.get('/', function(request, response) {
  response.sendFile(__dirname + '/index.html');
});

const PORT = process.env.PORT || 3000;

const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});