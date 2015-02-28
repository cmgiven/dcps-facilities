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

            $.getJSON(ELEMENTARY_GEOJSON_FILE, function(school_json) {
            	featureLayer = L.geoJson(school_json, { 
            		style: getStyle,
            		onEachFeature: onEachFeature
            	});
  				featureLayer.addTo(map);
			});
        }
    };
    
    function getStyle(feature) {
      return {
          weight: 2,
          opacity: 0.1,
          color: 'black',
          fillOpacity: 0.7,
          fillColor: getColorByCondition(feature.properties.GIS_ID)
      };
  	}
  	
  	//TODO: Put all colors in CSS
    function getColorByCondition(d) {
  	  var school = getSchool(d);
  	  
  	  if (school != null){
  	  	d = ('condition2013' in school) ? school.condition2013 : "TBD";
  	  }
  	  else{
  	  	d = "TBD";
  	  }

  	  if (d == "Good"){
  	  	return '#66CC00';
  	  }
  	  else if ((d == "Poor") || (d == "Unsatisfactory")){
  	  	return '#FF0000';
  	  }
  	  else if (d == "Fair"){
  	  	return '#8c2d04';
  	  }  	
  
  	  else{
  	  	return '#fff7bc';
  	  }
     
  }
    
    function onEachFeature(feature, layer) {
    	layer.on({
     	    click: clickOnGroup
    	});    	    	
	}
    function clickOnGroup(e){
    	var layer = e.target;
    	showSchool(layer.feature.properties.GIS_ID)
    }
    
    function showSchool (gis_school_id){
   		var schoolView = d3.select('#school-view');
   		var school = getSchool(gis_school_id);
   		schoolView.selectAll('.field.enrollment.amount').text(school.estimatedEnrollment2015);
        schoolView.selectAll('.field.schoolname').text(school.name);
        schoolView.selectAll('.field.modernization.code').text(school.modernization);
        schoolView.selectAll('.field.modernization.status').text(school.modernizationStatus);
    }
    
    function getSchool(GIS_ID){
    	var gis_school_split = GIS_ID.split('_');
    	var gis_school_code = gis_school_split[1];
    	
    	for (var school_key in schoolData){
            var school = schoolData[school_key];
            if (school.code == gis_school_code){
              return school;
            }
        }
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
   		
        $.getJSON(geoJsonLayerFile, function(school_json) {
            	featureLayer = L.geoJson(school_json, { 
            		style: getStyle, 
            		onEachFeature: onEachFeature
            	});
  				featureLayer.addTo(map);
		   });
   		
    	});
	});

}());
