/*jslint browser: true*/
/*jslint nomen: true*/
/*global $, _, d3*/

(function () {
    'use strict';

    var app,
        map;

    $(function () {
        app.initialize();
    });

    app = {
        initialize: function (data) {
            $('#loading').fadeOut();
            $('#main').fadeIn();
        }
    };

    window.app = app;
	map = {
		initialize: function(){

		} 
	};

}());
