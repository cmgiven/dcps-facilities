/*jslint browser: true*/
/*jslint nomen: true*/
/*global $, _, d3, L*/

(function () {
    'use strict';

    var app,
        map;
    
    var featureLayer;
    var accessToken = "$MY_MAPBOX_ACCESS_TOKEN_HERE";
    var accessToken = "pk.eyJ1IjoiYmJyb3Rzb3MiLCJhIjoiNUZOQVBWSSJ9.oxGErG4MjBcoVH64nqIFHw";

	
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
            map = L.mapbox.map('map', 'examples.map-i86nkdio').setView([38.89, -77.03], 12);
            
            //default to es layer
    		featureLayer = L.mapbox.featureLayer()
   	 			.loadURL('../data/es.json')
   	 			.addTo(map)
    			.on('click', clickOnGroup)
    			.on('mouseover', mouseOverOnGroup);
    		
        }
    };
    
    function onEachFeature(feature, layer) {
    	// does this feature have a property named popupContent?
    	if (feature.properties && feature.properties.NAME) {
     	   layer.bindPopup(feature.properties.NAME);
   		}
	}
	
	L.geoJson(featureLayer, {
  		  onEachFeature: onEachFeature
		}).addTo(map);
    
    function clickOnGroup(){
    	//TODO: change planning details here
    	console.log('clicked on group');
    }
    
    function mouseOverOnGroup(){
    	//TODO:add context for mouse over here
    	console.log('mouse over on group');
    }
    
    $(document).ready(function(){
   	 $('input[type=radio]').click(function(){
   	    //remove old layer
   		map.removeLayer(featureLayer);
        var filename = "../data/" + this.value + ".json";
        featureLayer = L.mapbox.featureLayer()
   	 			.loadURL(filename)
   	 			.addTo(map)
   	 			.on('click', clickOnGroup)
    			.on('mouseover', mouseOverOnGroup);
    	});
	});

}());
