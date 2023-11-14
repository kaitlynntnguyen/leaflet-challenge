// Store our API endpoint as a Url.
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"



//perform GET reqeust to the query URL
d3.json(url).then(function (data) {

   // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

    // Create our map.
    let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [topo]});


    //colors for later
    function getColor(d) {
    return d > 100 ? '#800026' :
           d > 75  ? '#BD0026' :
           d > 50  ? '#E31A1C' :
           d > 25  ? '#FC4E2A' :
           d > 10  ? '#FD8D3C' :
           d > 5   ? '#FEB24C' :
           d > 1   ? '#FED976' :
                     '#FFEDA0';
                    }




  // create an empy array for the markers
  let circleMarkers = [];
  // loop through the data, create a new marker, and push it to the circleMarkers array
  for (let i = 0; i < data.features.length; i++) {

    let lat = data.features[i].geometry.coordinates[1]
    let long = data.features[i].geometry.coordinates[0]
    let depth = data.features[i].geometry.coordinates[2]
    let colors = ["#00FF00", "#99FF00", "#FFFF00", "#FFCC00", "#FF6600", "#FF0000"]

    circleMarkers.push(
      L.circleMarker([lat,long], {
        fillOpacity: 0.75,
        color: "black",
        fillColor: getColor(depth),
        radius: data.features[i].properties.mag ** 3
      }).bindPopup("<h3>" + data.features[i].properties.place +" <br>" + data.features[i].properties.mag + " magnitude "  +" <br>" + depth + "km deep </h3>").addTo(myMap)
    );
  }

  let circleLayer = L.layerGroup(circleMarkers);


    // Create an overlay object to hold our overlay.
    let overlayMaps = {
        Circles: circleLayer
      };


 //legend
 var legend = L.control({position: 'bottomright'});

 legend.onAdd = function (map) {
 
     var div = L.DomUtil.create('div', 'info legend'),
         grades = [0, 1, 5, 10, 25, 50, 75, 100],
         labels = [];
 
     // loop through our density intervals and generate a label with a colored square for each interval
     for (var i = 0; i < grades.length; i++) {
         div.innerHTML +=
             '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
             grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
     }
 
     return div;
 };
 
 legend.addTo(myMap);

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);




});