/*jslint browser: true*/
/*jslint nomen: true*/
/*global $, _, d3, L*/

(function () {
    'use strict';

    var app,
        map;
    
    var accessToken = "$MY_MAPBOX_ACCESS_TOKEN_HERE";
	
    //TODO: use config file
    function getAccessToken()
    {
	return accessToken;
    }
    $(function () {
        app.initialize();
        map.initialize();
    });

    app = {
        initialize: function (data) {
            $('#loading').fadeOut();
            $('#main').fadeIn();
        }
    };

    window.app = app;
    map = {
        initialize: function () {
            L.mapbox.accessToken = getAccessToken();
            map = L.mapbox.map('map', 'examples.map-i86nkdio').setView([38.89, -77.03], 11);
            
            //default to es layer
    		var featureLayer = L.mapbox.featureLayer()
   	 			.loadURL('../data/es.json')
   	 			.addTo(map)
    			.on('click', clickOnGroup)
    			.on('mouseover', mouseOverOnGroup);
    			
    		function clickOnGroup()
   			{
    			//TODO: change planning details here
    			console.log('clicked on group');
    		}
    
    		function mouseOverOnGroup()
    		{
    			//TODO:add context for mouse over here
    			console.log('mouse over on group');
    		}
        }
    };

}());
