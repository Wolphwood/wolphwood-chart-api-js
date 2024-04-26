const mongoose = require("mongoose");

const { bdd } = require('../config');

function db_connect() {
	mongoose.connect(`mongodb://${bdd.host}/${bdd.name}`);
}

db = mongoose.connection;
db.on('connecting', () => {console.log('[MONGO] : Connexion avec la base de données en cours ...')})
db.on('error', console.error.bind(console, '[MONGO] : Erreur de connexion: '));
db.once('open', () => {console.log("[MONGO] : Connexion réussi !\n");});
db.on('disconnected', () => {
	setTimeout(() => {
			try {
				db_connect();
			} catch (err) {
				console.error(`[MONGO] : Impossible de se reconnecter: ${err}`)
			}
	}, 5000)
});
db_connect();