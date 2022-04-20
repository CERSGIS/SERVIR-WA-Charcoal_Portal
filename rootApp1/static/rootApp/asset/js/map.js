// $( document ).ready(function() {

const geojsonurl = "http://boundapi.cersgis.org/";
const geoserverUrl = "http://socrates.cersgis.org:8080/geoserver/cite/wms?";

const geoservergon = "http://socrates.cersgis.org:8080/geoserver/cersgis/wms?";

function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?

}

charapi = "/map/kilns/"
var char2019, char2021

// char2019= geojsonloadpoint(charapi+"2019/", char2019, "red", onEachFeature)
// char2020= geojsonloadpoint(charapi+"2020/", char2019, "black", onEachFeature,"check")




function geojsonloadpoint1(url, geodata, color, onEachFeature, checkbox, check) {

    var geojsonMarkerOptions = {
        radius: 6,
        fillColor: color,
        color: "white",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };


    $.get(url, function(res) {
        geodata = L.geoJSON(res, {
            pointToLayer: function(feature, latlng) {
                return L.circleMarker(latlng, geojsonMarkerOptions);
            },
            onEachFeature: onEachFeature
        });
    })




    $(checkbox).on("click", function(e) {

        layerTogglefunction(mymap, geodata, $(this).hasClass("on"));
    });

    // $("#char2020").on("click", function(e) {

    //     layerTogglefunction(mymap, geodata, $(this).hasClass("on"));
    // });


}

geojsonloadpoint1(charapi + "2020/", char2019, "black", onEachFeature, "#char2020")
geojsonloadpoint1(charapi + "2019/", char2019, "red", onEachFeature, "#char2019")



$("#asd").mousedown(function() {
    mymap.dragging.disable();
});

$(".side").mousedown(function() {
    mymap.dragging.disable();
});

$("#toolbox").click(function() {
    mymap.dragging.disable();
});

$("html").mouseup(function() {
    mymap.dragging.enable();
});

var ghanabounds;

ghanabounds = L.latLngBounds([3.7388, -4.262], [12.1748, 2.2]);

function mapdisbled(map) {
    mymap.touchZoom.disable();
    mymap.doubleClickZoom.disable();
    mymap.scrollWheelZoom.disable();
    //map.dragging.disable();
    mymap.keyboard.disable();
    if (map.tap) map.tap.disable();
}
//enabled map
function mapenabled(map) {
    mymap.touchZoom.enable();
    mymap.doubleClickZoom.enable();
    mymap.scrollWheelZoom.enable();
    //map.dragging.enable();
    mymap.keyboard.enable();
    if (mymap.tap) mymap.tap.enable();
} //

// ################################  map tools  ####################################

$("#reload").on("click", function() {
    location.reload();
});

$("#zin").on("click", function() {
    mapdisbled(mymap);
    mymap.zoomIn(1);
});

$("#zout").on("click", function() {
    mapdisbled(mymap);
    mymap.zoomOut(1);
});

$("#Zoomextent").on("click", function() {
    mymap.setView([9, -2.0], 11);
    mymap.panTo(new L.LatLng(9, -2.0));
});

// ################################  Load region boundary  ####################################

function regionstlye() {
    return {
        fillColor: "transparent",
        weight: 2,
        opacity: 1,
        color: "black",
        dashArray: "3",
        fillOpacity: 0.7,
    };
}

function regionresetHighlight(e) {
    regionboundary.resetStyle(e.target);
}

// function regiononEachFeature(feature, layer) {

//      layer.bindTooltip((feature.properties.region));
//     // layer.on({
//     //     mouseover: highlightFeature,
//     //     mouseout: regionresetHighlight,
//     //     // click: zoomToFeature,
//     // });


//         // layer.bindTooltip(feature.properties.region).openTooltip();
//      // layer.bindTooltip(feature.properties.region, {
//      //        direction: 'auto'
//      //    })
// }

function regiononEachFeature(feature, layer) {
    layer.bindTooltip(feature.properties.region)
    layer.on({
        mouseover: highlightFeature,
        mouseout: regionresetHighlight,
        // click: zoomToFeature
    });
}




var regionboundary

$.get("/map/region/", function(res) {

    regionboundary = L.geoJSON(res, { style: regionstlye, onEachFeature: regiononEachFeature });

    regionboundary.on('mouseover', function(e) {
        // e.layer.bindTooltip(e.layer.feature.properties["region"]).openTooltip();
    })

    // if (check) {mymap.addLayer(regionboundary)}
    $("#loadregion").addClass("hidden")
});


// $("#regionCheck").click(function() {
$("body").on("click", "#regionCheck", function() {

    if (regionboundary) {



        layerTogglefunction(mymap, regionboundary, $(this).hasClass("on"));
    }
});

// ################################  Load district boundary  ####################################

function districtstye() {
    return {
        fillColor: "transparent",
        weight: 2,
        opacity: 1,
        color: "#b7a",
        dashArray: "3",
        fillOpacity: 0.7,
    };
}

function districtresetHighlight(e) {
    districtboundary.resetStyle(e.target);
}

function districtonEachFeature(feature, layer) {
    layer.bindTooltip(feature.properties.district)
    layer.on({
        mouseover: highlightFeature,
        mouseout: districtresetHighlight,
        // click: districtzoomToFeature,
    });
}

function districtzoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
    $("#mapchart").show();
    $("#maploader").show();
    $.get(
        geojsonurl +
        "calculatearea/?districtcode=" +
        e.target.feature.properties.district,
        function(data) {
            $("#containerdiv").html(data);
            $("#maploader").hide();
        }
    );
}

// var districtboundary = geojsonload(
//     geojsonurl + "districtjson/",
//     false,
//     districtboundary,
//     districtstye,
//     districtonEachFeature,
//     "district_n"
// );

var districtboundary

$.get("/map/district/", function(res) {

    districtboundary = L.geoJSON(res, { style: districtstye, onEachFeature: districtonEachFeature });

    districtboundary.on('mouseover', function(e) {
        // e.layer.bindTooltip(e.layer.feature.properties["region"]).openTooltip();
    })

    // if (check) {mymap.addLayer(regionboundary)}
    $("#loadregion").addClass("hidden")
});




$("#districtCheck").on("click", function(e) {


    if (districtboundary) {
        layerTogglefunction(mymap, districtboundary, $(this).hasClass("on"));
    }
});

// ################################  Load protected Areas  ####################################
function protectedareastye() {
    return {
        fillColor: "rgb(68,150,149,0.5)",
        weight: 2,
        opacity: 1,
        color: "green",
        dashArray: "3",
        fillOpacity: 1,
    };
}

function proectedarearesetHighlight(e) {
    proectedarea.resetStyle(e.target);
}

function proectedareaEachFeature(feature, layer) {
    layer.bindTooltip(feature.properties.reserve_na)
    layer.on({
        mouseover: highlightFeature,
        mouseout: proectedarearesetHighlight,
        // click: zoomToFeature,
    });
}
// var proectedarea = geojsonload(
//     geojsonurl + "protectareajson/",
//     false,
//     proectedarea,
//     protectedareastye,
//     proectedareaEachFeature,
//     "reserve_na"
// );
var proectedarea
$.get("/map/protectareajson/", function(res) {

    proectedarea = L.geoJSON(res, { style: protectedareastye, onEachFeature: proectedareaEachFeature });

    proectedarea.on('mouseover', function(e) {
        // e.layer.bindTooltip(e.layer.feature.properties["region"]).openTooltip();
    })

    // if (check) {mymap.addLayer(regionboundary)}
    $("#loadregion").addClass("hidden")
});


$("#proectedCheck").on("click", function(e) {
    if (proectedarea) {
        layerTogglefunction(mymap, proectedarea, $(this).hasClass("on"));
    }
});

// ################################  Load settlement boundary  ####################################
var communityboundary = loadVectorlayerfunction(
    geoservergon,
    "WGONJA_SETTLEMENT",
    "settlement"
)


$("#settlementCheck").on("click", function(e) {
    layerTogglefunction(mymap, communityboundary, $(this).hasClass("on"));
});

// ################################   Load ecowas boundary   ######################################
var ecowasboundary = loadVectorlayerfunction(
    geoserverUrl,
    "ECOWAS_boundary",
    "cite"
);
mymap.addLayer(ecowasboundary);
$("#ecowasCheck").on("click", function(e) {
    alert();
    layerTogglefunction(mymap, ecowasboundary, $(this).hasClass("on"));
});

function checkDate(dateText) {
    var arrDate = dateText.split("-");
    var today = new Date();
    useDate = new Date(arrDate[2], arrDate[1] - 1, arrDate[0]);
    return false;
}

function loadtilelayer(url, layer) {
    $("#overlay").css("display", "block");
    if (layer) {
        mymap.removeLayer(layer);
    }

    $.get(url, function(res) {
        layer = L.tileLayer(res["mapid"]);
        mymap.addLayer(layer);
        $("#overlay").css("display", "none");
    });
    return layer;
}

var layerssm, compare, query1, query2, inactivechangedet, activechangedet;


if (query1) {

    query1.on('loading', function(event) {
        console.log('start loading tiles');
    });
    query1.on('load', function(event) {
        console.log('all tiles loaded');
    });
    query1.on('tileloadstart', function(event) {
        console.log('start loading 1 tile');
    });

}







// ################################  Load district boundary  ####################################

function blockstye() {
    return {
        fillColor: "transparent",
        weight: 2,
        opacity: 1,
        color: "#e55",
        dashArray: "3",
        fillOpacity: 0.7,
    };
}

function blockresetHighlight(e) {
    blockboundary.resetStyle(e.target);
}

function blockhighlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: 'cyan',
        dashArray: '',
        fillOpacity: 0.7,
        fillColor: 'transparent',
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

function blockzoomToFeature(e) {
    mymap.fitBounds(e.target.getBounds());

    // e.layer.bindTooltip(e.layer.feature.properties["blocks"]).openTooltip();

}




function blockEachFeature(feature, layer) {
    layer.on({
        mouseover: blockhighlightFeature,
        mouseout: blockresetHighlight,
        // click: blockzoomToFeature,
    });
}





var blockboundary

$.get("/map/blocks/None/", function(res) {

    blockboundary = L.geoJSON(res, { style: blockstye, onEachFeature: blockEachFeature });


    $("#loaddistrict").addClass("hidden")

});



var heat2019, heat2020

function loadheatmap(url, layer, checkbox) {
    $.get(url, function(res) {

        layer = L.heatLayer(res)



        // $("#loaddistrict").addClass("hidden")

    });

    $("#" + checkbox).on("change", function(e) {

        if ($(this).is(":checked")) {
            mymap.addLayer(layer)
        } else {

            mymap.removeLayer(layer)
        }

    })

}

loadheatmap("/map/heatmap/2019/", heat2019, "heat2019")


loadheatmap("/map/heatmap/2020/", heat2020, "heat2020")






$("#aoicheck").on("click", function(e) {
    if (blockboundary) {
        layerTogglefunction(mymap, blockboundary, $(this).hasClass("on"));
    }
});


















$("body").on("click", "#query1", function() {
    $("#overlay").css("display", "block");

    // loadtilelayer('/getdata/?from='+$("#from").val()+'&to='+$("#to").val()+'&color=gold' , query1 )

    if (query1) {
        mymap.removeLayer(query1);
    }

    $.get(
        "/compute/?from=" +
        $("#from").val() +
        "&to=" +
        $("#to").val() +
        "&typerepo=heatmap",
        function(res) {
            if (res["mapid"] == "error") {
                $("#alert").removeClass("hidden");
                $("#overlay").css("display", "none");
            } else if (res["mapid"] == "no_image") {
                $("#noimage").removeClass("hidden");
                $("#overlay").css("display", "none");
            } else {
                query1 = L.tileLayer(res["mapid"]);

                var tileProgressBarControl = new L.Control.TileLoadingProgress({
                    leafletElt: query1,
                    position: 'bottomleft'
                });
                mymap.addLayer(query1);
                tileProgressBarControl.addTo(mymap);



                $("#overlay").css("display", "none");
            }

            if (
                $("#from1").val() &&
                $("#to1").val() &&
                $("#to").val() &&
                $("#to").val()
            ) {
                $.get(
                    "/getchangedetectionactive/?from=" +
                    $("#from").val() +
                    "&to=" +
                    $("#to").val() +
                    "&from1=" +
                    $("#from1").val() +
                    "&to1=" +
                    $("#to1").val() +
                    "&status=inactive",
                    function(res) {
                        inactivechangedet = L.tileLayer(res["mapid"]);

                        $.get(
                            "/getchangedetectionactive/?from=" +
                            $("#from").val() +
                            "&to=" +
                            $("#to").val() +
                            "&from1=" +
                            $("#from1").val() +
                            "&to1=" +
                            $("#to1").val() +
                            "&status=active",
                            function(res) {
                                activechangedet = L.tileLayer(res["mapid"]);
                            }
                        );
                    }
                );

            }



        }


    );






    // mymap.addLayer(layerssm);
    $("#filterlayer").addClass("disp on");
    $("#filtereye").removeClass("disp off");
    $("#filtereye").removeClass("fa-eye-slash");
    $("#filtereye").addClass("fa fa-eye");

    $("#filtereye").addClass("disp on");

    $("#query1range").removeClass("hidden");
});

$("#query2").on("click", function() {
    $("#overlay").css("display", "block");

    // if (query2){
    //     mymap.removeLayer(query2)
    // }
    // query2=loadgogletilayer(query2, '/getdata/?from='+$("#from1").val()+'&to='+$("#to1").val()+'&color=red', '','on' ,"loadquery2");

    if (query2) {
        mymap.removeLayer(query2);
    }

    $.get(
        "/getdata/?from=" +
        $("#from1").val() +
        "&to=" +
        $("#to1").val() +
        "&color=red",
        function(res) {
            if (res["mapid"] == "error") {
                $("#alert").removeClass("hidden");
                $("#overlay").css("display", "none");
            } else if (res["mapid"] == "no_image") {
                $("#noimage").removeClass("hidden");
                $("#overlay").css("display", "none");
            } else {
                query2 = L.tileLayer(res["mapid"]);
                mymap.addLayer(query2);
                $("#overlay").css("display", "none");
            }

            if (
                $("#from1").val() &&
                $("#to1").val() &&
                $("#to").val() &&
                $("#to").val()
            ) {
                $.get(
                    "/getchangedetectionactive/?from=" +
                    $("#from").val() +
                    "&to=" +
                    $("#to").val() +
                    "&from1=" +
                    $("#from1").val() +
                    "&to1=" +
                    $("#to1").val() +
                    "&status=inactive",
                    function(res) {
                        inactivechangedet = L.tileLayer(res["mapid"]);

                        $.get(
                            "/getchangedetectionactive/?from=" +
                            $("#from").val() +
                            "&to=" +
                            $("#to").val() +
                            "&from1=" +
                            $("#from1").val() +
                            "&to1=" +
                            $("#to1").val() +
                            "&status=active",
                            function(res) {
                                activechangedet = L.tileLayer(res["mapid"]);
                            }
                        );
                    }
                );
            }
        }
    );

    // mymap.addLayer(layerssm);
    $("#filterlayer2").addClass("disp on");
    $("#filtereye2").removeClass("disp off");
    $("#filtereye2").removeClass("fa-eye-slash");
    $("#filtereye2").addClass("fa fa-eye");

    $("#filtereye2").addClass("disp on");

    $("#query2range").removeClass("hidden");
});

$("#compareupdate1").on("click", function() {


var layertypesel=$("#layertypesel").val()
var yearsel=$("#yearsel").val()
var yearsel_heat=$("#yearsel_heat").val()

if (layertypesel && yearsel || yearsel_heat ){

    $("#loader").removeClass("hidden")

    if (compare) {
        mymap2.removeLayer(compare);
    }
   
   var url
   if (layertypesel == "heatmap" ){
    url = "/map/heatmap/"+yearsel_heat + "/"
   
    
    }else{

        url = "/map/treecover/"+yearsel

         
    }

    $.get( url ,function(res) {

      if ( res['mapid'] != 'error' ){

        if (layertypesel == 'heatmap' ){
           
            compare = L.heatLayer(res)
       

        }else{
            
            compare =  L.tileLayer(res['mapid'])
        }
        

        mymap2.addLayer(compare);
        $("#loader").addClass("hidden")

       }
    })

}else{

    alert("Please Select the product and year to proceed ")
}
    // // mymap.addLayer(layerssm);
    // $("#filterlayer2").addClass("disp on");
    // $("#filtereye2").removeClass("disp off");
    // $("#filtereye2").removeClass("fa-eye-slash");
    // $("#filtereye2").addClass("fa fa-eye");

    // $("#filtereye2").addClass("disp on");
});


$("#layertypesel").change(function(){
   if($(this).val()=="heatmap") {

     $("#yearsel").addClass("hidden")
    $("#yearsel_heat").removeClass("hidden")

   }else{

    $("#yearsel_heat").addClass("hidden")
    $("#yearsel").removeClass("hidden")


   }


})







var landsat, aoi;
// landsat = loadgogletilayer(landsat, '/loadLandsat/', '','');

// $.get('/loadaoi/', function(res) {

//     aoi = L.tileLayer(res['mapid'])

// })

$("#landsatCheck").on("click", function(e) {
    // layerseldefine(mymap, layerssm, orig)
    //layerTogglefunction(mymap, landsat, $(this).hasClass("on"));
});

// aoi = loadgogletilayer(aoi, '/loadaoi/', '', '');

$("#aoicheck").on("click", function(e) {
    // console.log(aoi);
    // layerseldefine(mymap, layerssm, orig)
    //layerTogglefunction(mymap, aoi, $(this).hasClass("on"));
});









// $('.lgndthumb').css('border-color', '#f00')
$(".lgndthumb").click(function(e) {
    mymap.removeLayer(initialbasemap);
    $(".lgndthumb > img").css("border-color", "#3e5766");
    var toolname = $(this).attr("id");

    if (toolname == "no_basemap") {
        initialbasemap = L.tileLayer("").addTo(mymap);
    } else if (toolname == "basemap1") {
        initialbasemap = L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>',
            }
        ).addTo(mymap);
    } else if (toolname == "basemap2") {
        initialbasemap = L.tileLayer(
            "http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}", {
                maxZoom: 20,
                subdomains: ["mt0", "mt1", "mt2", "mt3"],
            }
        ).addTo(mymap);
    } else if (toolname == "basemap3") {
        initialbasemap = L.tileLayer(
            "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>',
            }
        ).addTo(mymap);
    } else if (toolname == "basemap4") {
        initialbasemap = L.tileLayer(
            "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
                maxZoom: 17,
                attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
            }
        ).addTo(mymap);
    } else if (toolname == "basemap5") {
        initialbasemap = L.tileLayer(
            "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
                maxZoom: 17,
                attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
            }
        ).addTo(mymap);
    } else if (toolname == "basemap6") {
        initialbasemap = L.tileLayer(
            "http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
                attribution: "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012",
            }
        ).addTo(mymap);
    } else if (toolname == "basemap7") {
        initialbasemap = L.tileLayer(
            "https://{s}.tile.openstreetmap.se/hydda/roads_and_labels/{z}/{x}/{y}.png", {
                maxZoom: 18,
                attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }
        ).addTo(mymap);
    } else if (toolname == "basemap8") {
        initialbasemap = L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            }
        ).addTo(mymap);
    } else if (toolname == "basemap9") {
        initialbasemap = L.tileLayer(
            "http://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}", {
                attribution: "Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri",
            }
        ).addTo(mymap);
    } else if (toolname == "basemap10") {
        initialbasemap = L.tileLayer(
            "https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}", {
                attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                subdomains: "abcd",
                minZoom: 0,
                maxZoom: 20,
                ext: "png",
            }
        ).addTo(mymap);
    }
    initialbasemap.bringToBack();
});




$("#buttonchange").on("click", function() {
    if (coords) {
        $(".overlay1").removeClass("hidden");

        $("#changedetection").dialog("open");

        $.get(
            "/areacomputation/?from=" +
            $("#from").val() +
            "&to=" +
            $("#to").val() +
            "&from1=" +
            $("#from1").val() +
            "&to1=" +
            $("#to1").val() +
            "&coords=" +
            coords,
            function(data) {
                $("#analysis_cont").html(data);
                $(".overlay1").addClass("hidden");
            }
        );
    } else {
        swal(
            "Sorry !!!!! ",
            "Please select your area of interest using the rectangle or polygon tool",
            "info"
        );
    }
});



L.control.scale().addTo(mymap);


var optionmeasure = {
    position: 'topleft',
    primaryAreaUnit: 'sqmeters',
    secondaryAreaUnit: 'acres',
    activeColor: '#ABE67E',
    completedColor: '#C8F2BE',
    popupOptions: { className: 'leaflet-measure-resultpopup', autoPanPadding: [10, 10] }
}

// var measureControl = new L.Control.Measure(optionmeasure);
// measureControl.addTo(mymap);



var landsat;
$("body").on("change", "#landsatcompo", function() {
    // $('#landsatcompo').on('change', function(e){

    $("#overlay").css("display", "block");

    $.get("/map/loadLandsat/?year=" + $(this).val(), function(res) {
        if (landsat) {
            mymap.removeLayer(landsat);
        }

        landsat = L.tileLayer(res["mapid"]);
        mymap.addLayer(landsat);
        // landsat.bringToBack();

        $("#overlay").css("display", "none");
    });
});


let tree2013, tree2014, tree2015, tree2016, tree2017, tree2018, tree2019, tree2020




// mymap.addLayer(tree2013);



function loadtree(url, tilelayer, checkbox, range) {

    $.get(url, function(res) {
        if (res['mapid'] != 'error') {
            tilelayer = L.tileLayer(res['mapid'])
        }
    })

    $("#" + checkbox).on("click", function(e) {

        if (tilelayer) {
            layerTogglefunction(mymap, tilelayer, $(this).hasClass("on"));
        }
    });


    $("#" + range).on("change", function(e) {
        sliderfunct($(this).val(), tilelayer);
    });

}


loadtree("/map/treecover/2013", tree2013, "tree2013", "tree2013range")
loadtree("/map/treecover/2014", tree2014, "tree2014", "tree2014range")
loadtree("/map/treecover/2015", tree2015, "tree2015", "tree2015range")
loadtree("/map/treecover/2016", tree2016, "tree2016", "tree2016range")
loadtree("/map/treecover/2017", tree2017, "tree2017", "tree2017range")
loadtree("/map/treecover/2018", tree2018, "tree2018", "tree2018range")
loadtree("/map/treecover/2019", tree2019, "tree2019", "tree2019range")
loadtree("/map/treecover/2020", tree2020, "tree2020", "tree2020range")



