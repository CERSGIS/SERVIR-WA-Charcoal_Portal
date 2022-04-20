   var map = L.map('mapid', {
       maxBounds: L.latLngBounds([6.7388, -4.262], [12.1748, 2.200]),
       zoomControl: false,



   }).setView([6.2, -2.5], 13);

   // setView([9.099, -1.000], 7);


   googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
       maxZoom: 20,
       subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
   })


googleHybrid.on('loading', function (event) {
   $(".overlay").removeClass("hidden")
   alert("loading")
});
googleHybrid.on('load', function (event) {
  
    $(".overlay").addClass("hidden")

    alert("load")
});


   function mapdisbled(map) {
       map.touchZoom.disable();
       map.doubleClickZoom.disable();
       // map.scrollWheelZoom.disable();
       //map.dragging.disable();
       map.keyboard.disable();
       if (map.tap) map.tap.disable();
   }




      L.control.mousePosition().addTo(map);


   $('#zoomin').on('click', function() {

       mapdisbled(map);
       map.zoomIn(1);
   })


   $('#zoomout').on('click', function() {

       mapdisbled(map);
       map.zoomOut(1);
   })



   function autoquick1(code, ftype) {
       getextent('/extent/' + code + '/' + ftype + '/', map);
       // selectmap('/highlight/' + code  + '/' + ftype + '/',map,'',selectstyle)
   }



   function getextent(url, map) {
       $.get(url, function(data) { map.fitBounds([
               [data[1], data[0]],
               [data[3], data[2]]
           ]) })
   }

   //Highlightmap style
   function highlightstyle() {
       return {
           fillColor: 'transparent',
           weight: 4,
           opacity: 1,
           color: 'cyan',
           dashArray: '',
           fillOpacity: '1'
       };

   }

   //selecymap style
   function selectstyle() {
       return {
           fillColor: 'transparent',
           weight: 4,
           opacity: 1,
           color: '#f00',
           dashArray: '',
           fillOpacity: '1'
       };

   }




   var selectfeaturezone;

   function selectmap(url, map, typem, mnh) {
       $.get(url, function(data) {
           if (selectfeaturezone != undefined) {
               map.removeLayer(selectfeaturezone)
           }
           if (typem == 'point') {
               selectfeaturezone = new L.GeoJSON(data, { pointToLayer: mnh }).addTo(map).bringToFront();
           } else {
               selectfeaturezone = new L.GeoJSON(data, { style: mnh }).addTo(map).bringToBack();
           }
       }).done(function() {}).fail(function() {});
   }








   //Autocomplete function
   var options = {
       url: function(phrase) {
           return "/autocompleteview/?phrase=" + phrase;
       },
       placeholder: "Search by region,district,plantation",
       template: {
           type: "description",
           fields: {
               description: "type"
           },
       },
       getValue: "name",
       requestDelay: 500,
       list: {
           match: {
               enabled: true
           },
           maxNumberOfElements: 10,
           showAnimation: {
               type: "slide",
               time: 300
           },
           hideAnimation: {
               type: "slide",
               time: 300
           },
           onSelectItemEvent: function() {
               var code = $("#inputsearch").getSelectedItemData().code;
               var ftype = $("#inputsearch").getSelectedItemData().type;
               autoquick1(code, ftype)
           },
           onChooseEvent: function() {
               var code = $("#inputsearch").getSelectedItemData().code;
               var ftype = $("#inputsearch").getSelectedItemData().type;
               autoquick1(code, ftype)

           },
           onKeyEnterEvent: function() {
               var code = $("#inputsearch").getSelectedItemData().code;
               var ftype = $("#inputsearch").getSelectedItemData().type;
               autoquick1(code, ftype)
           },
           onShowListEvent: function() {
               $(".circlemainsmallsearch").addClass("hidden");
           },
           onLoadEvent: function() {
               $(".circlemainsmallsearch").removeClass("hidden");
           }
       },
       theme: "blue-light",
       //theme: "round"
   };
   $("#inputsearch").easyAutocomplete(options);






   $("#layerbtn").click(function() {
       // alert("goop")
       $("#basemap").slideToggle("slow");
   });

   var options = {
       position: 'topleft', // Leaflet control position option
       circleMarker: { // Leaflet circle marker options for points used in this plugin
           color: 'red',
           radius: 2
       },
       lineStyle: { // Leaflet polyline options for lines used in this plugin
           color: 'red',
           dashArray: '1,6'
       },
       lengthUnit: { // You can use custom length units. Default unit is kilometers.
           display: 'km', // This is the display value will be shown on the screen. Example: 'meters'
           decimal: 2, // Distance result will be fixed to this value. 
           factor: null, // This value will be used to convert from kilometers. Example: 1000 (from kilometers to meters)  
           label: 'Distance:'
       },
       angleUnit: {
           display: '&deg;', // This is the display value will be shown on the screen. Example: 'Gradian'
           decimal: 2, // Bearing result will be fixed to this value.
           factor: null, // This option is required to customize angle unit. Specify solid angle value for angle unit. Example: 400 (for gradian).
           label: 'Bearing:'
       }
   }

  L.control.scale().addTo(map);



L.control.browserPrint({
       
    printModes: ["Portrait", "Landscape", "Auto", "Custom"],
    manualMode: true // use true if it's debug and/or default button is okay for you, otherwise false.
    }).addTo(map);

  document.querySelector("#custom_print_button").addEventListener("click", function(){
    var modeToUse = L.control.browserPrint.mode.auto();
    map.printControl.print(modeToUse);

      // alert( $("#mapotitle").val())

      var titt = $("#mapotitle").val()

      $( ".grid-print-container" ).append("<h2 id='tittop'>" + titt + "</h2>");


  });









   var style = {
       color: 'red',
       opacity: 1.0,
       fillOpacity: 0,
       weight: 2,
       clickable: false
   };
   L.Control.FileLayerLoad.LABEL = '<img class="icon" src="/static/rootApp/leaflet/folder.svg" alt="file icon"/>';
   control = L.Control.fileLayerLoad({
       fitBounds: true,
       layerOptions: {
           style: style,
           pointToLayer: function(data, latlng) {
               return L.circleMarker(
                   latlng, { style: style }
               );
           }
       }
   });
   control.addTo(map);
   control.loader.on('data:loaded', function(e) {
       var layer = e.layer;
       console.log(layer);
   });



   function getColor(d) {
       return d > 1000 ? '#800026' :
           d > 500 ? '#BD0026' :
           d > 200 ? '#E31A1C' :
           d > 100 ? '#FC4E2A' :
           d > 50 ? '#FD8D3C' :
           d > 20 ? '#FEB24C' :
           d > 10 ? '#FED976' :
           '#FFEDA0';
   }



   L.LegendControl = L.Control.extend({
       onAdd: function(map) {
           var labels = [];
           var div = L.DomUtil.create('div', 'info legend');
 
           html = ('<h2 style="text-align: center;"><strong>Legend</strong> </h2>')
           html += ('<ul class="info1" style="background-color:white"> ')
           html += ('<li>Region Boundary<span class="legendbox reg1"> </span></li> ')
           html += ('<li>District Boundary<span class="legendbox district1"> </span></li>')

           html += ('<li>Protected Area<span class="legendbox protect1" style=""> </span></li>')

           html += ('<li> Plantation<span class="legendbox platn1"> </span></li>')

           html += ('</ul>')

           html += ('</table>')
           html += ('</div >')


           labels.push(html);
           // }

           div.innerHTML = labels.join('');
           return div;
       }
   });



   L.legendControl = function(options) {
       return new L.LegendControl(options);
   };







var optionmeasure = {
  position: 'topleft' ,
  primaryAreaUnit: 'hectares',
}

var measureControl = new L.Control.Measure(optionmeasure);
measureControl.addTo(map);






   map.on("browser-print-start", function(e) {
       /*on print start we already have a print map and we can create new control and add it to the print map to be able to print custom information */
       L.legendControl({ position: 'bottomright' }).addTo(e.printMap);

       // L.legendControl({ position: 'bottomleft' }).addTo(e.printMap);

   });


