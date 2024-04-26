const express = require('express');
const router = express.Router();

const { authentication, login } = require('../../jwt');
const actions = require('../../actions/v1');


router.get('/', actions.HelloWorld);

router.get('/login', login);

router.get('/helloworld', authentication, actions.HelloWorld);


router.post('/image', authentication, actions.CreateGraph);
router.get('/image/:uuid', actions.DisplayGraph);
router.get('/rdm', actions.RandomGraph);



module.exports = router;