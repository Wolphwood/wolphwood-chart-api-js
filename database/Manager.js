// Connexion BDD
require('./Mongoose');

// Importation de Lib Mongoose
const mongoose = require("mongoose");

// Importation des Schemas
const Schemas = require("./Schemas.js");

// ==================================================================================================== //
const mUser = mongoose.model('users', Schemas.User, 'users');
const mChart = mongoose.model('charts', Schemas.Chart, 'charts');
// ==================================================================================================== //


module.exports = class Manager {
	constructor(){};
	
	async #createUser(id) {

	}

	async #existUser(id) {
		return mUser.findOne({ discord_id: id }).then(o => !!o);
	}

	async #getUser(id) {
		return mUser.findOne({ discord_id: id });
	}

	async #userCheckToken({ token } = {}) {
		return mUser.findOne({ token }).then(o => !!o);
	}

	async #userCheckAccessToken(id, token) {

	}
	
	get user() {
		return {
			exist: this.#existUser,
			create: this.#createUser,
			get: this.#getUser,
			check_token: this.#userCheckToken,
			check_access_token: this.#userCheckAccessToken,
		};
	}




	#existChart(uuid) {
		return mChart.findOne({ uuid }).then(o => !!o);
	}

	#getChart(uuid) {
		return mChart.findOne({ uuid });
	}

	#createChart(data) {
		let document = new mChart(data);
		document.save();
		return document;
	}

	get chart() {
		return {
			exist: this.#existChart,
			get: this.#getChart,
			create: this.#createChart,
		};
	}




}