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
            map = L.mapbox.map('map', 'examples.map-i86nkdio').setView([38.89, -77.03], 12);
        }
    };

}());
