// Create the map object, putting the
// at Los Angeles, CA
let myMap = L.map("map", {
    center: [34.0536909, -118.242766],
    zoom: 4
});

// Add the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Provide the URL for JSON data

let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson"

// Get the data with d3



d3.json(url).then(function(response) {
    
    console.log(response);

    function markerSize(magnitude) {
        return Math.sqrt(magnitude) * 5;
    }
    
    const features = response.features

    for (let i = 0; i < features.length; i++) {
        let earthquake = features[i];
        console.log(earthquake)
        L.circleMarker(L.latLng(earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]), {
            fillOpacity: 0.66,
            color: "black",
            weight: 2,
            fillColor: "Yellow",
            radius: markerSize(earthquake.properties.mag)
        }).bindPopup(`<h1>${earthquake.properties.place}</h1> <hr> <h3>Magnitude ${earthquake.properties.mag}</h3>`).addTo(myMap);
    }
});


// This was a portion of my work before tutoring. Justin showed me how to start 
//getting this operational; the biggest pieces of information were: 
// 1. creating the constant features in order to properly navigate the raw data, and
// 2. Utilizing the L.latlng function from leaflet documentation in order for the plugin to properly read the coordinates I was passing.
// These changes got positive results, and this file could be a starter to do the remaining work if desired.


