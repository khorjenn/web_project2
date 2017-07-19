/**
 * Created by Joey on 7/18/2017.
 */

var restify     = require('restify');
var fs          = require('fs');
var serveStatic = require('serve-static-restify');
var jwt         = require('restify-jwt');
const Settings  = require('./settings');
var port        = process.env.PORT || 8080;

const GooglePlaceController = require('./controller/GooglePlaceController');

//const MainController = require('./controller/MainController');

const Models = require('./models');

var server = restify.createServer({
    name : 'TravelAgent'
})

server.pre(serveStatic('public/',{'index': ['index.html']}));

// Routes and its handlers
server.use(restify.plugins.bodyParser());

// Search nearby
server.post('searchTerm', GooglePlaceController.searchTerm);

// Start server
Models.sequelize.sync().then(() => {
    server.listen(8080, function (){
        console.log('Start server on port 8080')
    });
});