$(function(){
//GLOBAL VARS
var backButton =  '<button id="back">back</button>';
var resetButton = '<button id="reset">reset</button>';
var stopsElement = '<div id="stops"></div>';
var directionsElement = '<div id="directions"></div>';
var routesElement = '<div id="routes"></div>';
var timesElement = '<div id="times"></div>'

//ROUTER

	var AppRouter = Backbone.Router.extend({

		routes: {

									"route/:routeNumber": "getRoute",

									"route/:routeNumber/direction/:direction" : "getDirection",

									"route/:routeNumber/direction/:direction/stopId/:stopId" : "getStop",

			"*actions": "defaultRoute"

			// matches http://example.com#/route/901/direction/1/stop/FRHI

		}

	});


//MODELS
	var Route = Backbone.Model.extend({		

	});
	
	var Direction = Backbone.Model.extend({

	});
	
	var Stop = Backbone.Model.extend({

	});
	
	var Time = Backbone.Model.extend({
		initialize: function(){
			console.log(this);
		}
	});
	
	
//COLLECTIONS	
	var Routes = Backbone.Collection.extend({
		model : Route,
		url:"http://svc.metrotransit.org/NexTrip/Routes?format=json",
		getLightRailRoutes: function () {
        var filtered = this.filter(function (route) {
			var routeNumber = route.get("Route");
            return routeNumber === "901" || routeNumber === "902" || routeNumber === "903";
        });
        return new Routes(filtered);
    }
	});
	
	var Directions = Backbone.Collection.extend({
		model : Direction,
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
	
	var Stops = Backbone.Collection.extend({
		model : Stop,
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
	
	var Times = Backbone.Collection.extend({
		model : Time,
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
//VIEWS	
	var RouteView = Backbone.View.extend({
	
		el: "#routes",
	
		template: _.template($('#routeTemplate').html()),
		
		render: function(routes) {
	      _.each(routes.models, function(route){
	         var routeTemplate = this.template(route.toJSON());
	         $(this.el).append(routeTemplate);
	      }, this);
	      return this;
	   },
	   events: {
		"click .routes" : "renderClick"
	   },
	   renderClick: function(event){
			var self = this;
			var id = event.target.id;
			if(id.match(/^\d{3}$/)){ //id will match route. if id is not 3 digits then dont execute code.
				directions = new Directions({routeNumber : id});
				directions.fetch({
					success: function() {
								self.destroyView();
								directionView = new DirectionView({collection: directions});
								appRouter.navigate('route/' + id);
								directionView.render(directions);
							},
					error: function(){
								console.log('There was some error in loading and processing the JSON file in renderClick');
							}
				
					})
				
			}
	   },	   
	   destroyView: function() {

			// COMPLETELY UNBIND THE VIEW
			this.undelegateEvents();

			this.$el.removeData().unbind(); 

			// Remove view from DOM
			this.remove();  
			Backbone.View.prototype.remove.call(this);
			
			$( "body").prepend(routesElement);

		}
	});
	
	var DirectionView = Backbone.View.extend({
	
		el: "#directions",
	
		template: _.template($('#directionTemplate').html()),
		
		render: function(directions) {
	      _.each(directions.models, function(direction){
	         var directionTemplate = this.template(direction.toJSON());
	         $(this.el).append(directionTemplate);
	      }, this);
		  $(this.el).append( backButton + resetButton );
	      return this;
	   },
	   events: {
		"click .directions" : "renderClick",
		"click #back" : "renderBack",
		"click #reset" : "renderReset"
	   },
	   renderClick: function(event){
			var self = this;
			var id = event.target.id;
			var theRouteNumber = directions.getRouteNumber();
			if(id.match(/^[1-4]$/)){ //id will match direction. if id is not a single digit between 1-4 then dont execute.
				stops = new Stops({routeNumber: theRouteNumber, direction: id});
				stops.fetch({
					success: function() {
								self.destroyView();
								stopView = new StopView({collection: stops});
								appRouter.navigate('route/' + theRouteNumber + '/direction/' + id);
								stopView.render(stops);
							},
					error: function(){
								console.log('There was some error in loading and processing the JSON file in renderClick');
							}
					})
			}
	   },
	   renderBack: function(){
			this.destroyView();
			var allRoutes = new Routes();
	
			allRoutes.fetch({
				success: function() {
					var lightRailRoutes = allRoutes.getLightRailRoutes();
					var routeView = new RouteView({collection: lightRailRoutes});
					appRouter.navigate('');
					routeView.render(lightRailRoutes);
				},
				error: function(){
					console.log('There was some error in loading and processing the JSON file');
				}
		});				
	   },
	   renderReset: function(){
			this.destroyView();
			var allRoutes = new Routes();
	
			allRoutes.fetch({
				success: function() {
					var lightRailRoutes = allRoutes.getLightRailRoutes();
					var routeView = new RouteView({collection: lightRailRoutes});
					appRouter.navigate('');
					routeView.render(lightRailRoutes);
				},
				error: function(){
				console.log('There was some error in loading and processing the JSON file');
				}
		});			
	   },	   
	   destroyView: function() {

			// COMPLETELY UNBIND THE VIEW
			this.undelegateEvents();

			this.$el.removeData().unbind(); 

			// Remove view from DOM
			this.remove();  
			Backbone.View.prototype.remove.call(this);
			
			$( "body").prepend( directionsElement );

		}	   
	});
	
	var StopView = Backbone.View.extend({
	
		el: "#stops",
	
		template: _.template($('#stopTemplate').html()),
		
		render: function(stops) {
	      _.each(stops.models, function(stop){
	         var stopTemplate = this.template(stop.toJSON());
	         $(this.el).append(stopTemplate);
	      }, this);
		  $(this.el).append( backButton + resetButton );
	      return this;
	   },
	   events: {
		"click .stops" : "renderClick",
		"click #back"  : "renderBack",
		"click #reset" : "renderReset"
	   },
	   renderClick: function(event){
			var self = this;
			var id = event.target.id;
			var theRouteNumber = stops.getRouteNumber();
			var theDirection = stops.getDirection();
			if(id.match(/^[A-Z0-9]{4}$/)){ //id will match stopId. If not 4 capital alpha characters don't execute.
				times = new Times({routeNumber: stops.getRouteNumber(), direction: stops.getDirection(), stopId: id});
				times.fetch({
					success: function() {
								self.destroyView();
								timeView = new TimeView({collection: times});
								appRouter.navigate('route/' + theRouteNumber + '/direction/' + theDirection + "/stopId/" + id);
								timeView.render(times);
					
							},
					error: function(){
								console.log('There was some error in loading and processing the JSON file in stopView.renderClick()');
							}
					})
			}
	   },	   
	   renderBack: function(){
				var self = this;
				var theRouteNumber = this.collection.routeNumber;
				directions = new Directions({routeNumber : theRouteNumber});
				directions.fetch({
					success: function() {
								self.destroyView();
								directionView = new DirectionView({collection: directions});
								appRouter.navigate('/route/' + theRouteNumber);
								directionView.render(directions);
							},
					error: function(){
								console.log('There was some error in loading and processing the JSON file in stopView.renderBack()');
							}
				
					})		
	   
	   },
	   renderReset: function(){
			this.destroyView();
			var allRoutes = new Routes();
	
			allRoutes.fetch({
				success: function() {
					var lightRailRoutes = allRoutes.getLightRailRoutes();
					var routeView = new RouteView({collection: lightRailRoutes});
					appRouter.navigate('');
					routeView.render(lightRailRoutes);
				},
				error: function(){
				console.log('There was some error in loading and processing the JSON file');
				}
		});			
	   },
	   destroyView: function() {

			// COMPLETELY UNBIND THE VIEW
			this.undelegateEvents();

			this.$el.removeData().unbind(); 

			// Remove view from DOM
			this.remove();  
			Backbone.View.prototype.remove.call(this);
			
			$( "body").prepend( stopsElement );

		}	   	
	
	
	
	
	});
	
	var TimeView = Backbone.View.extend({
		el: "#times",
		
		template: _.template($('#timeTemplate').html()),
		
		render: function(times) {
	      _.each(times.models, function(time){
	         var timeTemplate = this.template(time.toJSON());
	         $(this.el).append(timeTemplate);
	      }, this);
		  $(this.el).append( backButton + resetButton );
	      return this;
	   },
	   events: {
		"click .stops" : "renderClick",
		"click #back"  : "renderBack",
		"click #reset" : "renderReset"
	   },	   
		renderBack: function(){
				var self = this;
				var theRouteNumber = this.collection.routeNumber;
				var theDirection = this.collection.direction;
				stops = new Stops({routeNumber : theRouteNumber, direction : theDirection});
				stops.fetch({
					success: function() {
								self.destroyView();
								stopView = new StopView({collection: stops});
								appRouter.navigate('/route/' + theRouteNumber + "/direction/" + theDirection);
								stopView.render(stops);
							},
					error: function(){
								console.log('There was some error in loading and processing the JSON file in stopView.renderBack()');
							}
				
					})		
	   
	   },
	   renderReset: function(){
			this.destroyView();
			var allRoutes = new Routes();
	
			allRoutes.fetch({
				success: function() {
					var lightRailRoutes = allRoutes.getLightRailRoutes();
					var routeView = new RouteView({collection: lightRailRoutes});
					appRouter.navigate('');
					routeView.render(lightRailRoutes);
				},
				error: function(){
				console.log('There was some error in loading and processing the JSON file');
				}
		});			
	   },
	   destroyView: function() {

			// COMPLETELY UNBIND THE VIEW
			this.undelegateEvents();

			this.$el.removeData().unbind(); 

			// Remove view from DOM
			this.remove();  
			Backbone.View.prototype.remove.call(this);
			
			$( "body").prepend( timesElement );

		}	   	
	});
	
	////init	



	// Initiate the router
	var appRouter = new AppRouter;

	appRouter.on('route:getRoute', function (routeNumber) {
		directions = new Directions({routeNumber : routeNumber});
			directions.fetch({
				success: function() {
					directionView = new DirectionView({collection: directions});
					directionView.render(directions);
				},
				error: function(){
					console.log('There was some error in loading and processing the JSON file');
				}
				
			})
	});
	
	appRouter.on('route:getDirection', function (routeNumber, direction) {
				stops = new Stops({routeNumber: routeNumber, direction: direction});
				stops.fetch({
					success: function() {
								stopView = new StopView({collection: stops});
								stopView.render(stops);
							},
					error: function(){
								console.log('There was some error in loading and processing the JSON file');
							}
					})
	});

	appRouter.on('route:getStop', function (routeNumber, direction, stopId) {
				console.log(stopId);
				times = new Times({routeNumber: routeNumber, direction: direction, stopId: stopId});
				times.fetch({
					success: function() {
								timeView = new TimeView({collection: times});
								timeView.render(times);
							},
					error: function(){
								console.log('There was some error in loading and processing the JSON file');
							}
					})

	});

	appRouter.on('route:defaultRoute', function(actions) {
		console.log(actions);
		var allRoutes = new Routes();
	
		allRoutes.fetch({
			success: function() {
				var lightRailRoutes = allRoutes.getLightRailRoutes();
				var routeView = new RouteView({collection: lightRailRoutes});
				routeView.render(lightRailRoutes);
				},
			error: function(){
					console.log('There was some error in loading and processing the JSON file');
				}
		});
	});
	// Start Backbone history a necessary step for bookmarkable URL's

	Backbone.history.start();
	
	
	
	
	

	
	
	
	


});