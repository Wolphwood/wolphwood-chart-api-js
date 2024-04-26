const express = require('express');
const router = express.Router();

const actions = require('../../actions/v2');

router.get('/get/:type', actions.DisplayGraph);


module.exports = router;