'use strict';

// Cick event for coords
function onMapClick(e) {
    L.popup()
        .setLatLng(e.latlng)
        .setContent('You clicked the map at ' + e.latlng.toString())
        .openOn(map);
}

// Set bounds for map
function bounds(south, west, north, east){
    var southWest = L.latLng(south, west),
        northEast = L.latLng(north, east);
    return L.latLngBounds(southWest, northEast);
}

var map;

var layerLocations = L.layerGroup();
var layerQuests = L.layerGroup();
var layerWorkshops = L.layerGroup();
var layerEvents = L.layerGroup();

var tileBase = L.tileLayer('assets/tiles/{z}/{x}/{y}.png', {
    tms: true,
    noWrap: true
});

var tileLevels = L.tileLayer('assets/tiles/{z}/{x}/{y}.png', {
    tms: true,
    noWrap: true
});

map = L.map('mapid', {
    attributionControl: false,
    maxBounds: bounds(-85, -180, 85, 180),
    minZoom: 1,
    maxZoom: 5,
    layers: [tileBase, layerLocations, layerQuests, layerWorkshops, layerEvents]
}).setView([49.7244, -64.8193], 4);

var baseMaps = {
    "Map": tileBase,
    //"Map with Levels": tileLevels
};
var overlayMaps = {
    "Locations": layerLocations,
    "Quest": layerQuests,
    "Public Workshops": layerWorkshops,
    "Events": layerEvents
};

L.control.layers(baseMaps, overlayMaps).addTo(map);

map.on('click', onMapClick);

var icons = {
    'vault76': L.icon({
        iconUrl: 'assets/images/icons/icon-vault-76.svg',
        iconSize: [25,25]
    }),
    'location': L.icon({
        iconUrl: 'assets/images/icons/icon-town.svg',
        iconSize: [25,25]
    }),
    'quest': L.icon({
        iconUrl: 'assets/images/icons/icon-quest.svg',
        iconSize: [25,25]
    }),
    'workshop': L.icon({
        iconUrl: 'assets/images/icons/icon-workshop.svg',
        iconSize: [25,25]
    }),
    'event': L.icon({
        iconUrl: 'assets/images/icons/icon-event.svg',
        iconSize: [25,25]
    }),
    'silo': L.icon({
        iconUrl: 'assets/images/icons/icon-silo.svg',
        iconSize: [25,25]
    }),
}

var div = document.getElementById('data');
var template = Handlebars.templates['entry'];

var context = {
    name: 'Welcome',
    description: 'Hello'
}

div.innerHTML = template(context);

var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1KhjXwprJOqtA-NprufjdI-rfYJ7VeBV8PusDHcuAPkw/';

function init(){
    Tabletop.init({
        key: publicSpreadsheetUrl,
        callback: showInfo,
        //simpleSheet: true,
        debug: true
    })
}

function showInfo(sheet, tabletop){
    var locations = tabletop.sheets('locations').all();

    for (let i = 0; i < locations.length; i++) {
        var location = locations[i];
        
        var thisMarker = L.marker([location.latitude, location.longitude], {icon: icons[location.icon]});
        var customTooltip = '<strong>' + location.name + '</strong><br><small>' + location.type + '</small>';
        //var customPopup = '<strong>' + location.name + '</strong><br><small>' + location.type + '</small>';

        function addMarker(){
            thisMarker
                .bindTooltip(customTooltip)
                //.bindPopup(customPopup)
                .on('click', markerOnClick);
            
            var context = {
                name: location.name,
                image: 'assets/images/' + location.image,
                description: location.description
            }
            
            function markerOnClick(e){
                div.innerHTML = template(context);
            }
        }

        if (location.type == 'Location') {
            addMarker();
            thisMarker.addTo(layerLocations);
        } else if (location.type == 'Quest') {
            addMarker();
            thisMarker.addTo(layerQuests);
        } else if (location.type == 'Public Workshop') {
            addMarker();
            thisMarker.addTo(layerWorkshops);
        } else if (location.type == 'Event') {
            addMarker();
            thisMarker.addTo(layerEvents);
        }
    }
}

window.addEventListener('DOMContentLoaded', init)