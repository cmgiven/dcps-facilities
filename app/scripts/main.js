/*jslint browser: true*/
/*jslint nomen: true*/
/*global $, _, d3, L*/

(function () {
    'use strict';

    var app,
        map;
    
    
    var ELEMENTARY_GEOJSON_FILE = 'data/es.json';
    var MIDDLE_SCHOOL_GEOJSON_FILE = 'data/ms.json';
    var HIGH_SCHOOL_GEOJSON_FILE = 'data/hs.json';    
    var SCHOOL_DATA_FILE = 'data/schools.csv';
        
    //TODO: encapsulate these in modules
    var accessToken = "$MY_MAPBOX_ACCESS_TOKEN_HERE";
    var featureLayer;
    var schoolData;
	
    //TODO: use config file
    function getAccessToken()
    {
		return accessToken;
    }
    
    $(function () {
        d3.csv(SCHOOL_DATA_FILE, function (d) {
            return {
                name: d.name,
                code: d.code,
                estimatedEnrollment2015: d.sy15_estenroll_total,
                modernization: d.modernization,
                modernizationStatus: d.mod_status,
                condition2013: d.facilitiesconditionindex_2013
            };
        },
        app.initialize);
    });

    app = {
        initialize: function (data) {
            schoolData = data;
            $('#loading').fadeOut();
            $('#main').fadeIn();
            map.initialize();
        }
    };

    window.app = app;
    map = {
        initialize: function () {
            L.mapbox.accessToken = getAccessToken();
            map = L.mapbox.map('map', 'examples.map-i86nkdio').setView([38.89, -77.03], 12);
            map.options.minZoom = 11;

            /* JQuery way to load without mapbox
             $.getJSON(filename, function(school_json) {
        	featureLayer = L.geoJson(school_json, { style: L.mapbox.simplestyle.style })
        				   .on('click', clickOnGroup)
    					   .on('mouseover', mouseOverOnGroup);
  			featureLayer.addTo(map);
			});
			*/
			
			//using mapbox api vs. using straight jquery
            //default to es layer
    		featureLayer = L.mapbox.featureLayer()
   	 			.loadURL(ELEMENTARY_GEOJSON_FILE)
   	 			.addTo(map)
    			.on('click', clickOnGroup)
    			.on('mouseover', mouseOverOnGroup);
        }
    };
    
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
   		
   		var geoJsonLayerFile;
   		if (this.value == 'es'){
   			geoJsonLayerFile = ELEMENTARY_GEOJSON_FILE;
   		}
   		else if (this.value == 'ms'){
   			geoJsonLayerFile = MIDDLE_SCHOOL_GEOJSON_FILE;
   		}
   		else if (this.value == 'hs'){
   			geoJsonLayerFile = HIGH_SCHOOL_GEOJSON_FILE;
   		}
   		
        featureLayer = L.mapbox.featureLayer()
   	 			.loadURL(geoJsonLayerFile)
   	 			.addTo(map)
   	 			.on('click', clickOnGroup)
    			.on('mouseover', mouseOverOnGroup);
    	});
	});

}());
