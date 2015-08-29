//COLLECTIONS
var app = app || {};
	 app.Routes = Backbone.Collection.extend({
		model : app.Route,
		url:"http://svc.metrotransit.org/NexTrip/Routes?format=json",
		getLightRailRoutes: function () {
        var filtered = this.filter(function (route) {
			var routeNumber = route.get("Route");
            return routeNumber === "901" || routeNumber === "902" || routeNumber === "903";
        });
        return new app.Routes(filtered);
    }
	});
	
	 app.Directions = Backbone.Collection.extend({
		model : app.Direction,
		initialize : function(options){
			this.routeNumber = options.routeNumber;
		},
		url: function(){
			return "http://svc.metrotransit.org/NexTrip/Directions/" + this.routeNumber + "?format=json";
		},
		getRouteNumber: function(){
			return this.routeNumber;
		}
		
	});
	
	 app.Stops = Backbone.Collection.extend({
		model : app.Stop,
		initialize : function(options){
			this.routeNumber = options.routeNumber;
			this.direction = options.direction;
		},
		url: function(){
			return "http://svc.metrotransit.org/NexTrip/Stops/" + this.routeNumber + "/" + this.direction + "?format=json";
		},
		getRouteNumber: function(){
			return this.routeNumber;
		},
		getDirection: function(){
			return this.direction;
		}
		
	});	
	
	 app.Times = Backbone.Collection.extend({
		model : app.Time,
		initialize: function(options){
			this.routeNumber = options.routeNumber;
			this.direction = options.direction;
			this.stopId = options.stopId;
		},
		url: function(){
			return "http://svc.metrotransit.org/NexTrip/" + this.routeNumber + "/" + this.direction + "/" + this.stopId + "?format=json";
		},
		getRouteNumber: function(){
			return this.routeNumber;
		},
		getDirection: function(){
			return this.direction;
		},
		getStopId: function(){
			return this.stopId;
		}
	});