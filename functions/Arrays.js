// ========================================================================== //
console.log({
    name: "Array Functions",
    version: "1.1",
	details: [
		"Array.unique",
		"Array.devideBy",
		"Array.devideIn",
		"Array.chunckOf",
		"Array.toLowerCase",
		"Array.toUpperCase",
		"Array.simplifyText",
		"Array.simplify",
		"Array.fromLast",
		"Array.last",
		"Array.randomElement (depreciated)",
		"Array.getRandomElement",
		"Array.outRandomElement",
		"Array.shuffle",
	]
});
// ========================================================================== //



// Array.unique
Array.prototype.unique = function() {
	return Array.from(new Set(this));
}

// Array devideBy
Array.prototype.devideBy = function(N=1) {
	console.warn("WARNING: 'devideBy' is depreciated.\nUse 'chunckOf' instead.");
    let inArr = [...this];
    let outArr = [];
    while (inArr.length > 0) {
        ___ = [];
        for (i=0; i<N; i++) if (inArr.length > 0) ___.push(inArr.shift());
        outArr.push(___);
    }
    return outArr;
}

Array.prototype.devide = function(N=1) {
	console.warn("WARNING: 'devide' is depreciated.\nUse 'chunckOf' instead.");
    let inArr = [...this];
    let outArr = [];
    while (inArr.length > 0) {
        ___ = [];
        for (i=0; i<N; i++) if (inArr.length > 0) ___.push(inArr.shift());
        outArr.push(___);
    }
    return outArr;
}

Array.prototype.chunckOf = function(size) {
    let arr = [];
	for (let i=0; i<this.length/size; i++) {
		arr.push( this.slice(i*size, (i+1)*size) );
	};
	
	return arr;
}



// Array To LowerCase
Array.prototype.toLowerCase = function() {
	return this.map(v => typeof v === 'string' ? v.toLocaleLowerCase() : v);
}

// Array To UpperCase
Array.prototype.toUpperCase = function() {
	return this.map(v => typeof v === 'string' ? v.toUpperCase() : v);
}

// Array Simplify Text
Array.prototype.simplifyText = function() {
	console.warn("WARNING: 'simplifyText' is depreciated.\nUse 'simplify' instead.");
	return this.map(v => typeof v === 'string' ? v.simplifyText() : v);
}
Array.prototype.simplify = function() {
	return this.map(v => typeof v === 'string' ? v.simplify() : v);
}

Array.prototype.fromLast = function(n=0) {
	return this[this.length - 1 - n];
}

Array.prototype.last = function() {
	return this[this.length - 1];
}

Array.prototype.randomElement = function () {
	console.warn("WARNING: 'randomElement' is depreciated.\nUse 'getRandomElement' instead.");
	return this[Math.floor(Math.random() * this.length)]
};
Array.prototype.getRandomElement = function () {return this[Math.floor(Math.random() * this.length)]};

Array.prototype.outRandomElement = function () {
	rdm = Math.floor(Math.random() * this.length);
	el = this[rdm]
	this.splice(rdm,1);
	return el;
}

Array.prototype.shuffle = function() {
  for (let i = this.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [this[i], this[j]] = [this[j], this[i]];
  }
  return this;
}