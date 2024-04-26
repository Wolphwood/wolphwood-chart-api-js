const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// #region Value type checker
function isArray(value) {
	return Array.isArray(value) || value instanceof mongoose.Schema.Types.Array;
}

function isObject(value) {
	return (typeof value === 'object' && !Array.isArray(value)) || value instanceof mongoose.Schema.Types.Array;
}

function isString(value) {
	return typeof value === 'string' || value instanceof mongoose.Schema.Types.String;
}

function isNumber(value) {
	return typeof value === 'number' || value instanceof mongoose.Schema.Types.Number;
}

function isDate(value) {
	return typeof value instanceof Date || value instanceof mongoose.Schema.Types.Date;
}

function isBoolean(value) {
	return typeof value === 'boolean' || value instanceof mongoose.Schema.Types.Boolean;
}

function isArrayOfNumber(array) {
	if (!isArray(array)) return false;
	return array.every(value => isNumber(value));
}
// #endregion

function ValidateSchema(baseschema, data) {
	let schema = new Schema(baseschema, {autoCreate: false, autoIndex: false});
	let model = mongoose.model('SchemaValidator', schema);
	let document = new model(data);
	
	let error = document.validateSync();
	
	delete mongoose.connection.models['SchemaValidator'];

	if (error) console.error(document.validateSync());
	return !error;
}

const SchemaUser = new Schema({
	token: String
});

const SchemaChartDataset = new Schema({
	label: String,
	data: {
		type: Array,
		validate: {
			validator: function(array) {
				return array.every(element => isNumber(element)) || array.every(element => ValidateSchema(SchemaChartDatasetCoordinates, element) || (element.length == 2 && element.every(n => isNumber(n))));
			},
			message: props => `${props.value} have wrong type.\nMust be [Number|SchemaChartDatasetCoordinates|[Number, Number]]`
		}
	},
	backgroundColor: Array,
});


const SchemaChartDatasetCoordinates = new Schema({
    x: { type: Number, required: true },
    y: { type: Number, required: true }
});



const SchemaChart = new Schema({
	uuid: { type: String, required: true },
	type: { type: String, required: true },
	EnableChartDataLabels: { type: Boolean, default: false },
	EnableEmptyDoughnut: { type: Boolean, default: false },
	size: {
		width: { type: Number, default: 512 },
		height: { type: Number, default: 512 },
	},
	data: {
		labels: {
			type: Array,
			validate: {
				validator: function(array) {
					return array.every(element => isNumber(element) || isString(element));
				},
				message: props => `${props.value} have wrong type.\nMust be [Number|String]`
			}
		},
		datasets: {
			type: Array,
            validate: {
                validator: function(array) {
                    return array.every(element => isObject(element) && ValidateSchema(SchemaChartDataset, element));
                },
                message: props => `${props.value} have wrong type.\nMust be [SchemaChartDataset]`
            }
		}
	},
	options: { type: Object, default: {} }
});


module.exports = {
	User: SchemaUser,
	Chart: SchemaChart,
}