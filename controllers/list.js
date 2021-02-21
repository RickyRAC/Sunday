const express = require('express');
const passport = require('../config/ppConfig');
const router = express.Router();
// import database
const db = require('../models');
//I transferred this route from server.js to here
//so our form submit does not hit the GET route
router.post('/:id', (req, res) => {
  //Check that I can see req.body
  console.log('Here is req.body')
  console.log(req.body)
  //Check that I can see req.params.id
  console.log("Here is req.params.id. THIS IS WHERE I WANT TO BE!")
  console.log(req.params.id)
  //Now that I can see that req.params.id works, 
  //store it in a variable to use later.
  const id = req.params.id
  db.item.create({
    item:req.body.title,
    //I know that the item model has a column named "listId",
    //so I am associating item to a list by using the id variable
    //we created on line 19.
    listId: id
    //.then(): Once the item is created in the db,
    //lets call it "item". To be more semantic, we could
    //also call this "createdItem"
  }).then(function(item){
    console.log("Here is the item's name:")
    let newItem = item.item
    console.log(item.item)
    console.log("Here is the item's listId:")
    console.log(item.listId)
    res.redirect(`/lists/${id}`)
  })
})
module.exports = router