// Provide the URL for JSON data - all earthquakes from the past 7 days.

let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Set up a color function to indicate earthquake depths.

function getColor(depth) {
    if (depth > 90) {
       return "red";
    }
    else if (depth > 70) {
        return "orange";
    }
    else if (depth > 50) {
        return "yellow";
    }
    else if (depth > 30) {
        return "green";
    }
    else if (depth > 10) {
        return "blue"; 
    }
    else return "silver"
}

// Perform a GET request using D3 to the query URL.
d3.json(url).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place, magnitude, and depth of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h2>Location: ${feature.properties.place}</h2><hr><h3>Magnitude: ${(feature.properties.mag)}</h3><br /><strong>Depth: ${feature.geometry.coordinates[2]}km</strong>`);
  }

  // Use the style function to set up how the different markers look.
  // This will incorporate the color function based on depth, and
  // the radius will be determined by each earthquake's magniutude.
  function style(feature) {
    console.log(feature);
    return {
        radius: feature.properties.mag * 6,
        color: "white",
        weight: 1,
        fillColor: getColor(feature.geometry.coordinates[2]),
        fillOpacity: .75

    };
  }

  // The pointToLayer function will create circle markers on each feature in the array that can utilize 
  //the style parameters passed along from the style function.
  function pointToLayer(geoJsonPoint, latlng) {
    return L.circleMarker(latlng);
}

  // Create a GeoJSON layer that contains the features array on the earthquakeData object and implements
  // all functions to create markers with the proper format and style.
  // Run the onEachFeature function once for each piece of data in the array.
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature, 
    style: style,
    pointToLayer: pointToLayer
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object. Two map types are provided that can be toggled,
  // depending on user preference or interest.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  // The map is centered around Los Angeles, CA.
  let myMap = L.map("map", {
    center: [34.0536909, -118.242766],
    zoom: 4,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


  // Create a legend to explain the depth ranges indicated by the chosen colors.
  var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [-10, 10, 30, 50, 70, 90]
        labels = [],
        div.innerHTML += "<h3>Depth of Earthquake (in km)</h3>"

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

// Add the legend to the map.
legend.addTo(myMap);

}

