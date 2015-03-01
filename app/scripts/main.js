/*jslint browser: true*/
/*jslint nomen: true*/
/*global $, _, d3, L*/

(function () {
    'use strict';

    var app,
        mapModule,
        schoolModule;
    
    
    var ELEMENTARY_GEOJSON_FILE = 'data/es.json';
    var MIDDLE_SCHOOL_GEOJSON_FILE = 'data/ms.json';
    var HIGH_SCHOOL_GEOJSON_FILE = 'data/hs.json';    
    var SCHOOL_DATA_FILE = 'data/schools.csv';
    
    //TODO: Add these to CSS? 
    var SCHOOL_CONDITION_FAIR_COLOR = '#8c2d04';
    var SCHOOL_CONDITION_GOOD_COLOR = '#66CC00';
    var SCHOOL_CONDITION_POOR_COLOR = '#FF0000';
    var SCHOOL_CONDITION_DEFAULT_COLOR = '#FFF7BC';
    
    var LAYER_STYLE = {
    			weight: 3,
          		opacity: 0.3,
          		fillOpacity: 0.9
    };
    
    var FEATURE_STYLE = {
         		weight: 2,
         	 	opacity: 0.1,
          		color: 'black',
          		fillOpacity: 0.7,
    };
    
        
    var accessToken = "$MY_MAPBOX_ACCESS_TOKEN_HERE";
    
    //TODO: encapsulate in schoolModule
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
            mapModule.initialize();
        }
    };

    window.app = app;
    
   
    mapModule = (function() {
	    
	    var featureLayer;
	    var closeTooltip;
	    var popup = new L.Popup({ autoPan: false });
    	
    	function initialize(){
    	 	L.mapbox.accessToken = getAccessToken();
            map = L.mapbox.map('map', 'examples.map-i86nkdio').setView([38.89, -77.03], 12);
            map.options.minZoom = 11;
            setSchoolLayer('es');
        };
        
        function onEachFeature(feature, layer){
         	layer.on({
     	   	 click: clickOnGroup,
     	   	 mouseover: mousemove,
     	   	 mouseout: mouseout
    		});  
         };
         
         function getStyle (feature){
        	 var style = FEATURE_STYLE;
        	 style.fillColor = schoolModule.getSchoolConditionColor(feature.properties.GIS_ID);
        	 return style;
     	 };
     	 
     	 function clickOnGroup(e){
    		var layer = e.target;
    		schoolModule.showSchool(layer.feature.properties.GIS_ID)
    	 }; 
     	 
		function mousemove(e) {
      		var layer = e.target;
      		popup.setLatLng(e.latlng);
		    popup.setContent(schoolModule.showPopupContent(layer.feature.properties.GIS_ID));

      		if (!popup._map) popup.openOn(map);
      			window.clearTimeout(closeTooltip);

      		layer.setStyle(LAYER_STYLE);      		

      		if (!L.Browser.ie && !L.Browser.opera) {
          		layer.bringToFront();
      		}
  		};

  		function mouseout(e) {
    		featureLayer.resetStyle(e.target);
     	 	closeTooltip = window.setTimeout(function() {
      	    map.closePopup();
      		}, 100);
  		};
        
        function setSchoolLayer(schoolTypeCode){
       		if (map.hasLayer(featureLayer)){
         		map.removeLayer(featureLayer);
         	}   		
   			
   			var geoJsonLayerFileName = schoolModule.getSchoolGeoJson(schoolTypeCode);
   			
   			$.getJSON(geoJsonLayerFileName, function(school_json) {
            	featureLayer = L.geoJson(school_json, { 
            		style: getStyle,
            		onEachFeature: onEachFeature
            	});
  				featureLayer.addTo(map);
			});
        };
        
        return{
        	initialize:initialize,
        	setSchoolLayer: function(schoolTypeCode){
        		setSchoolLayer(schoolTypeCode);	
        	}
        }
        
    }());
    
    
    schoolModule = (function() {
    	function showSchool (gis_school_id){
   			var schoolView = d3.select('#school-view');
   			var school = getSchool(gis_school_id);
   			schoolView.selectAll('.field.enrollment.amount').text(school.estimatedEnrollment2015);
        	schoolView.selectAll('.field.schoolname').text(school.name);
        	schoolView.selectAll('.field.modernization.code').text(school.modernization);
       		schoolView.selectAll('.field.modernization.status').text(school.modernizationStatus);
    	};
    	
    	function getSchool(GIS_ID){
    		var gis_school_split = GIS_ID.split('_');
    		var gis_school_code = gis_school_split[1];
    	
    		for (var school_key in schoolData){
            	var school = schoolData[school_key];
            		if (school.code == gis_school_code){
              			return school;
            		}
        		}
    	};
    	
    	function getSchoolGeoJson(schoolTypeCode)
    	{
    		if (schoolTypeCode == 'es'){
   				return ELEMENTARY_GEOJSON_FILE;
   			}
   			else if (schoolTypeCode == 'ms'){
   				return MIDDLE_SCHOOL_GEOJSON_FILE;
   			}
   			else if (schoolTypeCode== 'hs'){
   				return HIGH_SCHOOL_GEOJSON_FILE;
   			}
   			else{
   				return ELEMENTARY_GEOJSON_FILE;
			}
		}
    	
    	function getSchoolConditionColor (gis_school_id){
    	
    		var school = getSchool(gis_school_id)
    		var schoolCondition;
    		if (school != null){
  	  			schoolCondition = ('condition2013' in school) ? school.condition2013 : "TBD";
  	  		}
  	 		else{
  	  			schoolCondition = "TBD";
  	  		}

  	  		if (schoolCondition == "Good"){
  	  			return SCHOOL_CONDITION_GOOD_COLOR;
  	  		}
  	  		else if ((schoolCondition == "Poor") || (schoolCondition == "Unsatisfactory")){
  	  			return SCHOOL_CONDITION_POOR_COLOR;
  	  		}
  	 		else if (schoolCondition == "Fair"){
  	  			return SCHOOL_CONDITION_FAIR_COLOR;
  	  		}  	
  	 		else{
  	  			return SCHOOL_CONDITION_DEFAULT_COLOR;
  	  		}
    	}
    	
    	function showPopupContent(gis_school_id){
    		var school = getSchool(gis_school_id);
    		
    		var schoolEnrollment = ('estimatedEnrollment2015' in school) ? school.estimatedEnrollment2015 : 100;
      		var modernization = ('modernization' in school) ? school.modernization : "N/A";
      		var condition= ('condition2013' in school) ? school.condition2013 : "N/A";
      		

    		return '<div class="marker-title">' + school.name + 
      				'</div> Enrollment: ' + schoolEnrollment +
      				'<br/> Modernization: ' + modernization + 
      				'<br/>Condition:' + condition;
    	}
    	
    	return {
    		showSchool:function(gis_school_id){
    			showSchool(gis_school_id);
    		},
    		getSchoolConditionColor:function(gis_school_id){
    			return getSchoolConditionColor(gis_school_id);
    		}, 
    		getSchoolGeoJson:function(schoolTypeCode){
    			return getSchoolGeoJson(schoolTypeCode);
    		},
    		showPopupContent:function(schoolTypeCode){
    			return showPopupContent(schoolTypeCode);
    		}
    	};
    
    }());
    
    
    $(document).ready(function(){
   	 $('input[type=radio]').click(function(){
   	    mapModule.setSchoolLayer(this.value);
   	    
    	});
	});

}());
