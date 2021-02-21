require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const session = require('express-session');
const passport = require('./config/ppConfig'); //
const flash = require('connect-flash');
const methodOverride = require('method-override');



const app = express();
app.set('view engine', 'ejs');

// Session 
const SECRET_SESSION = process.env.SECRET_SESSION;
const isLoggedIn = require('./middleware/isLoggedIn');
const db = require('./models');

// MIDDLEWARE
app.use(methodOverride('_method'));
app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);
app.use('/lists', require('./controllers/list'));

// Session Middleware

// secret: What we actually will be giving the user on our site as a session cookie
// resave: Save the session even if it's modified, make this false
// saveUninitialized: If we have a new session, we save it, therefore making that true

const sessionObject = {
  secret: SECRET_SESSION,
  resave: false,
  saveUninitialized: true
}
app.use(session(sessionObject));
// Passport
app.use(passport.initialize()); // Initialize passport
app.use(passport.session()); // Add a session
// Flash 
app.use(flash());
app.use((req, res, next) => {
  console.log(res.locals);
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

// Controllers
app.use('/auth', require('./controllers/auth'));

app.get('/', (req, res) => {
  res.render('index');
});


app.get('/profile', isLoggedIn, (req, res) => {
  const { id, name, email } = req.user.get();
  req.user.getLists().then(function(lists) {
   res.render('profile', { id, name, email, lists });  
  }); 
  
});

app.post('/list', (req, res) => {
  console.log(req.body)
  console.log(req.user)
  req.user.createList({
    title: req.body.title 
  }).then(function(list) {
    console.log(list.title);
    res.redirect('/profile')
  });
});

//SHOW Route
app.get('/lists/:id', (req, res) => {
  const id = req.params.id
  console.log("Here is id and I'm hitting the show route!")
  console.log(id)
  //db.list.findOne()
  db.list.findOne({
    //I know that list has a column for the id,
    //so I am saying "where the list's id is the value of req.params.id"
    where: { id: id },
    //Now that the POST route in the controllers' list.js successfully creates an item
    //and it's associated with a list, let's include an array of all the items
    //that belong to this list!
    include: [db.item]
  }).then(function(foundList) {
    let items = foundList.dataValues.items
    //console.log(items)
    //Let's make sure that we can grab the item's name!
   // console.log("Here is foundlist.dataValues.items[0].item:")
    console.log("foundList!!!!!", foundList.list.dataValues.items);
    res.render('single', {foundList, id, items: items})
  });
});
     
app.post('/profile/list', (req, res) => {
  console.log(req.body)
  console.log(req.user)
  req.list.createList({
    name: req.body.name 
  }).then(function(list) {
    console.log(list.name);
    res.redirect('/profile/list')
  });
})

app.get('/singleItem', (req, res) => {
  const { id, name } = req.item.get();
  req.item.getItem().then(function(item) {
   res.render('singleItem', { id, name });  
  }); 
  
});





const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🎧 You're listening to the smooth sounds of port ${PORT} 🎧`);
});

module.exports = server;






