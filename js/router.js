//ROUTER
var app = app || {};

	app.AppRouter = Backbone.Router.extend({

		routes: {

					"route/:routeNumber": "getRoute",

					"route/:routeNumber/direction/:direction" : "getDirection",

					"route/:routeNumber/direction/:direction/stopId/:stopId" : "getStop",

					"*actions": "defaultRoute"

					// matches http://example.com#/route/901/direction/1/stop/FRHI

		}

	});
	
	