const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');

require('./functions/Arrays');

const DatabaseManager = require('./database/Manager');
const Manager = new DatabaseManager();
module.exports.Manager = Manager;

const app = express();
app.use(bodyParser.json());
app.use(cors({origin: "*"}));

const { v1: routes_v1, v2: routes_v2 } = require('./routes');
app.use('/api/v1/', routes_v1);
app.use('/api/v2/', routes_v2);


const server = app.listen(3000, '0.0.0.0', function () {
    let port = server.address().port;
    console.log(`Serveur démarré sur le port ${port}`);
})