const express = require("express");
const router = express.Router();
const bookController = require('../controllers/bookController');

// get book by book id
router.get('/getBook/:id',bookController.getBook);


// get book by userId
router.get('/getBooku/:id',bookController.getBooku);


//post book data with userId as params
router.post('/postBook/:id',bookController.postBook);

module.exports = router;