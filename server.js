//I.
var express = require('express');
var nedbAdapter = require('fortune-nedb');
var server = express();
var jsonapi= require('fortune-json-api');

//II.
var fortune = require('fortune');

// Új tároló (alapértelmezetten memóriában tárol)
//var store = fortune();
var store  = fortune({
    adapter: {
        type: nedbAdapter,
        options: { dbPath: __dirname + '/.db' }
    },
    serializers: [{ type: jsonapi }]    
});

// Minden URL-ről engedélyezzük a hozzáférést az API-hoz
// Mindenképp a `server.use(fortune.net.http(store));` sor elé kerüljön
server.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

// Express middleware
server.use(fortune.net.http(store));

store.defineType('recipe', {
    date: {type: String},
    name: {type: String},
    description: {type: String},
    ings:{link:'ingredient',inverse:'r',isArray:true},
});
store.defineType('ingredient', {
    name: {type: String},
    r: {link:'recipe',inverse:'ings'},
});
store.defineType('error', {
    //<mező neve>: {type: <mező típusa>},
    //id: {type: Number},
    /*
    date: {type: String},
    name: {type: String},
    description: {type: String},
    status: {type: String},
    */
    date: {type: String},
    location: {type: String},
    description: {type: String},
    status: {type: String},
    //field2: {type: Number, min: 0, max: 100},
    //field3: {type: Boolean},
    //field4: {type: Date},
    /*...
    <kapcsolat neve>: { 
        link: '<kapcsolt modell neve>',
        inverse: '<visszafele kapcsolat neve>',
        isArray: true
    },
    ...*/
});

// Csak akkor fusson a szerver, ha sikerült csatlakozni a tárolóhoz
// Hasonlóan a Waterline-hoz    
var port = process.env.PORT || 8080;
store.connect().then(function () {
    server.listen(port, function () {
        console.log('JSON Api server started on port ' + port);
    });
});




