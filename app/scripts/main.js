/*jslint browser: true*/
/*jslint nomen: true*/
/*global $, _, d3, L*/

(function () {
    'use strict';

    var app,
        map;

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
            L.mapbox.accessToken = 'pk.eyJ1IjoiNjFxdWlzYmVydGgiLCJhIjoib1lsUTNsbyJ9.UZh_yfTjTscW-48eFaWCQQ';
            map = L.mapbox.map('map', 'examples.map-i86nkdio').setView([38.89, -77.03], 12);
        }
    };

}());
