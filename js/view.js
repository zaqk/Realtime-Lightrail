//VIEWS FROM THE 6
var app = app || {};
	app.RouteView = Backbone.View.extend({
	
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
			var id = event.currentTarget.id;
			if(id.match(/^\d{3}$/)){ //regex to match route as id.
				directions = new app.Directions({routeNumber : id});
				directions.fetch({
					success: function() {
								self.destroyView();
								directionView = new app.DirectionView({collection: directions});
								appRouter.navigate('route/' + id);
								directionView.render(directions);
							},
					error: function(){
								console.log('There was some error in loading and processing the JSON file');
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
			
			$( "#main-container").prepend(routesElement);

		}
	});
	
	app.DirectionView = Backbone.View.extend({
	
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
			var id = event.currentTarget.id;
			var theRouteNumber = directions.getRouteNumber();
			if(id.match(/^[1-4]$/)){ //regex to match direction as id.
				stops = new app.Stops({routeNumber: theRouteNumber, direction: id});
				stops.fetch({
					success: function() {
								self.destroyView();
								stopView = new app.StopView({collection: stops});
								appRouter.navigate('route/' + theRouteNumber + '/direction/' + id);
								stopView.render(stops);
							},
					error: function(){
								console.log('There was some error in loading and processing the JSON file');
							}
					})
			}
	   },
	   renderBack: function(){
			this.destroyView();
			var allRoutes = new app.Routes();
	
			allRoutes.fetch({
				success: function() {
					var lightRailRoutes = allRoutes.getLightRailRoutes();
					var routeView = new app.RouteView({collection: lightRailRoutes});
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
			var allRoutes = new app.Routes();
	
			allRoutes.fetch({
				success: function() {
					var lightRailRoutes = allRoutes.getLightRailRoutes();
					var routeView = new app.RouteView({collection: lightRailRoutes});
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
			
			$( "#main-container").prepend( directionsElement );

		}	   
	});
	
	app.StopView = Backbone.View.extend({
	
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
			if(id.match(/^[A-Z0-9]{3,4}$/)){ //regex to match stopId as id.
				times = new app.Times({routeNumber: stops.getRouteNumber(), direction: stops.getDirection(), stopId: id});
				times.fetch({
					success: function() {
								self.destroyView();
								timeView = new app.TimeView({collection: times});
								appRouter.navigate('route/' + theRouteNumber + '/direction/' + theDirection + "/stopId/" + id);
								timeView.render(times);
					
							},
					error: function(){
								console.log('There was some error in loading and processing the JSON file');
							}
					})
			}
	   },	   
	   renderBack: function(){
				var self = this;
				var theRouteNumber = this.collection.routeNumber;
				directions = new app.Directions({routeNumber : theRouteNumber});
				directions.fetch({
					success: function() {
								self.destroyView();
								directionView = new app.DirectionView({collection: directions});
								appRouter.navigate('/route/' + theRouteNumber);
								directionView.render(directions);
							},
					error: function(){
								console.log('There was some error in loading and processing the JSON file');
							}
				
					})		
	   
	   },
	   renderReset: function(){
			this.destroyView();
			var allRoutes = new app.Routes();
	
			allRoutes.fetch({
				success: function() {
					var lightRailRoutes = allRoutes.getLightRailRoutes();
					var routeView = new app.RouteView({collection: lightRailRoutes});
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
			
			$( "#main-container").prepend( stopsElement );

		}	   	
	
	
	
	
	});
	
	app.TimeView = Backbone.View.extend({
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
				stops = new app.Stops({routeNumber : theRouteNumber, direction : theDirection});
				stops.fetch({
					success: function() {
								self.destroyView();
								stopView = new app.StopView({collection: stops});
								appRouter.navigate('/route/' + theRouteNumber + "/direction/" + theDirection);
								stopView.render(stops);
							},
					error: function(){
								console.log('There was some error in loading and processing the JSON file');
							}
				
					})		
	   
	   },
	   renderReset: function(){
			this.destroyView();
			var allRoutes = new app.Routes();
	
			allRoutes.fetch({
				success: function() {
					var lightRailRoutes = allRoutes.getLightRailRoutes();
					var routeView = new app.RouteView({collection: lightRailRoutes});
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
			
			$( "#main-container").prepend( timesElement );

		}	   	
	});
