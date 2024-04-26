exports.randomRange = (min,max) => {
	console.warn("WARNING: 'randomRange' is depreciated.\nUse 'getrandomRange' instead.");
	return Math.random() * (max - min) + min;
}
exports.randomRangeFloor = (min,max) => {
	console.warn("WARNING: 'randomRangeFloor' is depreciated.\nUse 'getrandomRangeFloor' instead.");
	return Math.floor(Math.random() * (max - min) + min);
}
exports.randomRangeFloor = (min,max) => {
	console.warn("WARNING: 'randomRangeFloor' is depreciated.\nUse 'getrandomRangeFloor' instead.");
	return Math.round(Math.random() * (max - min) + min);
}

exports.getRandomRange = (min,max) => {
	return Math.random() * (max - min) + min;
}
exports.getRandomRangeFloor = (min,max) => {
	return Math.floor(Math.random() * (max - min) + min);
}
exports.getRandomRangeRound = (min,max) => {
	return Math.round(Math.random() * (max - min) + min);
}