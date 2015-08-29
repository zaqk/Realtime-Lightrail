var app = app || {};

	// Initiate the router
	appRouter = new app.AppRouter;

	appRouter.on('route:getRoute', function (routeNumber) {
		directions = new app.Directions({routeNumber : routeNumber});
			directions.fetch({
				success: function() {
					directionView = new app.DirectionView({collection: directions});
					directionView.render(directions);
				},
				error: function(){
					console.log('There was some error in loading and processing the JSON file');
				}
				
			})
	});
	
	appRouter.on('route:getDirection', function (routeNumber, direction) {
				stops = new app.Stops({routeNumber: routeNumber, direction: direction});
				stops.fetch({
					success: function() {
								stopView = new app.StopView({collection: stops});
								stopView.render(stops);
							},
					error: function(){
								console.log('There was some error in loading and processing the JSON file');
							}
					})
	});

	appRouter.on('route:getStop', function (routeNumber, direction, stopId) {
				console.log(stopId);
				times = new app.Times({routeNumber: routeNumber, direction: direction, stopId: stopId});
				times.fetch({
					success: function() {
								timeView = new app.TimeView({collection: times});
								timeView.render(times);
							},
					error: function(){
								console.log('There was some error in loading and processing the JSON file');
							}
					})

	});

	appRouter.on('route:defaultRoute', function(actions) {
		console.log(actions);
		var allRoutes = new app.Routes();
	
		allRoutes.fetch({
			success: function() {
				var lightRailRoutes = allRoutes.getLightRailRoutes();
				var routeView = new app.RouteView({collection: lightRailRoutes});
				routeView.render(lightRailRoutes);
				},
			error: function(){
					console.log('There was some error in loading and processing the JSON file');
				}
		});
	});
	// Start Backbone history a necessary step for bookmarkable URL's

	Backbone.history.start();
