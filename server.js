require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const session = require('express-session');
const passport = require('./config/ppConfig'); //
const flash = require('connect-flash');


const app = express();
app.set('view engine', 'ejs');

// Session 
const SECRET_SESSION = process.env.SECRET_SESSION;
const isLoggedIn = require('./middleware/isLoggedIn');
const db = require('./models');

// MIDDLEWARE
app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);

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

app.get('/lists/:id', (req, res) => {
  // route needs to query the db to get all lists by current user
  // const { id, name } = req.list.get();
  // req.list.getLists().then(function(lists) {
  const id = req.params.id
  //db.list.findOne()
  db.list.findByPk(id).then(function(foundList) {
    console.log(foundList.data);
    res.render('single', {foundList})
    //res.send("myTemplate", {user: foundUser);
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

app.post('/lists/:id', (req, res) => {
  console.log(req.body)
  console.log(req.list)
  req.item.createItem({
    name:req.body.name
  }).then(function(item){
    console.log(list.name);
    res.redirect('/list/:id')
  })

})

 














const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🎧 You're listening to the smooth sounds of port ${PORT} 🎧`);
});

module.exports = server;






