(function() {
  var map = L.map('map', {zoomControl: false}, null).setView([47.5, -98], 6.8);
  var geojson = {};
  var isRunOnce = false;

  map.touchZoom.disable();
  map.doubleClickZoom.disable();
  map.scrollWheelZoom.disable();
  map.boxZoom.disable();

  function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
  }

  function resetHighlight(e) {
    geojson.resetStyle(e.target);
  }

  function onEachFeature(feature, layer) {
    layer.on({
    });
  }

  function attachGui() {
    var info = L.control();

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    info.update = function (props) {
        this._div.innerHTML =
        "<div class='container ui-wrap'id='Information'>"
        +"<h2 style='font-family:verdana; font-size:200%; text-align:center'>"
        +"The Fantastical MCMC Approach to Gerrymandering</h2>"
        +"<hr style='border-width: 5px; border-color:black;'>"
        +"<p id='update' style='border: 2px solid; border-radius: 30px'/>"
        +"<div class='title_image'><img src='../images/background.jpg'/></div>"
        +"</div>";
    };
    info.addTo(map);
  }

  function style(feature) {
     return {
      fillColor: (function() {
        // if(!isRunOnce) {
          feature["District"] = Math.floor(Math.random() * Math.floor(4)) + 1;
          return (feature["District"] == 1) ? "#00ff00"
                  : (feature["District"] === 2) ? "#ff0000"
                  : (feature["District"] === 3) ? "#0000ff"
                  : (feature["District"] === 4) ? "#6700aa" : "#000000";
        // } else {
        //   isRunOnce = true;
        // }
      })(),
      weight:2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    }
  }

  geojson = L.geoJson(window.data, {
    style: style,
    onEachFeature: onEachFeature
  }).addTo(map);

  map.dragging.disable();
  attachGui();

    console.log("calculating");

  window.setInterval(function() {
    area1 = 0;
    area2 = 0;
    area3 = 0;
    area4 = 0;
    perimeter1 = 0;
    perimeter2 = 0;
    perimeter3 = 0;
    perimeter4 = 0;
    polsby1 = 0;
    polsby2 = 0;
    polsby3 = 0;
    polsby4 = 0;
    window.data.features.forEach(function(f){
      if(f["District"] == 1){
        area1+=f.properties["Area"];
        perimeter1+=f.properties["Perimeter"];
      }
      if(f["District"] == 2){
        area2+=f.properties["Area"];
        perimeter2+=f.properties["Perimeter"];
      }
      if(f["District"] == 3){
        area3+=f.properties["Area"];
        perimeter3+=f.properties["Perimeter"];
      }
      if(f["District"] == 4){
        area4+=f.properties["Area"];
        perimeter4+=f.properties["Perimeter"];
      }
    });

    polsby1 = (4*Math.PI*area1)/(Math.pow(perimeter1, 2));
    polsby2 = (4*Math.PI*area2)/(Math.pow(perimeter2, 2));
    polsby3 = (4*Math.PI*area3)/(Math.pow(perimeter3, 2));
    polsby4 = (4*Math.PI*area4)/(Math.pow(perimeter4, 2));

    totalP = polsby1+polsby2+polsby3+polsby4;

    scores = [polsby1, polsby2, polsby3, polsby4];
    console.log(scores);
    max = scores.indexOf(Math.max(...scores)) + 1;
    min = scores.indexOf(Math.min(...scores)) + 1;

    pastTotalP = 0.0;
    targetDistricts = [];
    window.data.features.forEach(function(x) {
      if (x['District'] === max) {
        targetDistricts.push(x);
      }
    });

    idx = Math.floor(Math.random() * Math.floor(518)) + 1
    targetDistricts[idx]["District"] = min;
    idx = idx - 1;
    if (pastTotalP < totalP) {
      console.log("flipped district.");
      pastTotalP = totalP;

      document.getElementById("update").innerHTML =
      "<h4 style='font-family:verdana;text-align:center;' id='update'>Polsby-Popper Score:<br>"+totalP+"</h4>";

      console.log(pastTotalP);
      console.log(targetDistricts[idx].geometry.coordinates[0]);
      //targetDistricts[idx].geometry.setStyle({fillColor: "#000"});
      L.polygon(targetDistricts[idx].geometry.coordinates[0].map(function(x){
          return [x[1],x[0]]
      }),{
                 color:(targetDistricts[idx]["District"] == 1) ? "#007700"
                  : (targetDistricts[idx]["District"] === 2) ? "#770000"
                  : (targetDistricts[idx]["District"] === 3) ? "#000077"
                  : (targetDistricts[idx]["District"] === 4) ? "#6700aa" : "#000000",
             }).addTo(map)
    } else {
      targetDistricts[idx]["District"] = max;
    }

  }, 250);

})();
