   initialbasemap = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
        }
    );




    var mymap = L.map("mapid", {
        zoomControl: false,
        layers: [initialbasemap],
    }).setView([9.258089172541451, -1.645479135666168], 15);
    // .addTo(mymap);

    // initialbasemap.bringToBack();
    var mymap2 = L.map("mapid2", { drawControl: false }).setView(
        [9.258089172541451, -1.645479135666168],
        15
    );

    // L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
    //     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    //     maxZoom: 20,
    //     subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    // }).addTo(mymap2);



    mymap.sync(mymap2);
    mymap2.sync(mymap);
    //  // let coords;
    // var drawnItems = new L.geoJson().addTo(mymap);
    // drawnItems.bringToFront();
    // var layer;

    // mymap.on(L.Draw.Event.CREATED, function(event) {
    //     drawnItems.removeLayer(layer);
    //     layer = event.layer;

    //     // $("#dialog").dialog("open");
    //     drawnItems.addLayer(layer);

    //     let type = event.layerType;

    //     // if (type === 'rectangle' | ) {
    //     layer.on("mouseover", function() {
    //         coords = layer.getLatLngs();
    //     });
    //     // }
    // });

    // L.EditToolbar.Delete.include({
    //     removeAllLayers: false,
    // });

    // new L.Control.Draw({
    //     edit: {
    //         featureGroup: drawnItems,
    //     },
    //     draw: {
    //         polygon: true,
    //         rectangle: true,
    //         circlemarker: false,
    //         marker: false,
    //         polyline: false,
    //         circle: false,
    //     },
    // }).addTo(mymap);

    function GetSelection(layer) {

        $.get("/map/countkiln/?coord=" + coords, function(res) {


            $("#changedetection").dialog("open");

            $("#analysis_cont").html(res)



        });


    };




    let coords, layer
    var drawnItems = L.geoJson().addTo(mymap);
    mymap.addControl(new L.Control.Draw({
        edit: {
            featureGroup: drawnItems
        },
        draw: {
            polygon: true,
            rectangle: true,
            circle: false,
            circlemarker: false,
            marker: false,
            polyline: false,

        }

    }));

    mymap.on('draw:created', function(event) {
        drawnItems.removeLayer(layer);
        layer = event.layer;
        drawnItems.removeLayer(layer);


        coords = layer.getLatLngs();

        GetSelection(layer)
        // if(layer instanceof L.Rectangle){

        //    coords = layer.getLatLngs();

        //  GetSelection(layer)
        // }

        drawnItems.addLayer(layer);
    });

    
 
    $(".overlay")
        .delay(0)
        .queue(function(next) {
            $(this).css("display", "none");
            next();
        });
    $("#comparetool").click(function() {
        $(".img-comp-overlay").toggleClass("hidden");
        $(".img-comp-slider").toggleClass("hidden");
    });



    // $("#comparetool").trigger("click");


    $("#dialog").dialog({
        autoOpen: false,
        width: 600,
        minHeight: 500,
        show: {
            effect: "blind",
            duration: 1000,
        },
        hide: {
            effect: "blind",
            duration: 1000,
        },
        position: { my: "center", at: "center", of: window },
    });

    $("#opener").on("click", function() {
        if (!$("#Legenddialog").dialog("isOpen")) {
            $("#Legenddialog").dialog("open");
        } else {
            $("#Legenddialog").dialog("close");
        }
    });

    $("#analytic").on("click", function() {
        $("#dialog").dialog("open");
    });

    $("#Legenddialog").dialog({
        create: function(event, ui) {
            var widget = $(this).dialog("widget");
            $(".ui-dialog-titlebar-close span", widget)
                .removeClass("ui-icon-closethick")
                .addClass("ui-icon-minusthick");
        },
        autoOpen: false,
        width: 300,
        show: {
            effect: "blind",
            duration: 1000,
        },
        hide: {
            effect: "blind",
            duration: 1000,
        },
    });

    $("#about_dialog").dialog({
        autoOpen: false,
        width: 900,
        show: {
            effect: "blind",
            duration: 1000,
        },
        hide: {
            effect: "blind",
            duration: 1000,
        },
    });

    $("#changedetection").dialog({
        autoOpen: false,
        width: 600,
        minHeight: 500,
        show: {
            effect: "blind",
            duration: 1000,
        },
        hide: {
            effect: "blind",
            duration: 1000,
        },
    });

    $("#info").on("click", function() {
        if (!$("#about_dialog").dialog("isOpen")) {
            $("#about_dialog").dialog("open");
        } else {
            $("#about_dialog").dialog("close");
        }
    });

    $(".js-range-slider").ionRangeSlider({
        skin: "round",
        grid: true,
        // from: 2015,
        values: [2015, 2018, 2019, 2020],
    });

    function initComparisons() {
        var x, i;
        /* Find all elements with an "overlay" class: */
        x = document.getElementsByClassName("img-comp-overlay");
        for (i = 0; i < x.length; i++) {
            /* Once for each "overlay" element:
              pass the "overlay" element as a parameter when executing the compareImages function: */
            compareImages(x[i]);
        }

        function compareImages(img) {
            var slider,
                img,
                clicked = 0,
                w,
                h;
            /* Get the width and height of the img element */
            w = img.offsetWidth;
            h = img.offsetHeight;
            /* Set the width of the img element to 50%: */
            img.style.width = w / 2 + "px";
            /* Create slider: */
            slider = document.createElement("DIV");
            slider.setAttribute("class", "img-comp-slider");
            /* Insert slider */
            img.parentElement.insertBefore(slider, img);
            /* Position the slider in the middle: */
            slider.style.top = h / 2 - slider.offsetHeight / 2 + "px";
            slider.style.left = w / 2 - slider.offsetWidth / 2 + "px";
            /* Execute a function when the mouse button is pressed: */
            slider.addEventListener("mousedown", slideReady);
            /* And another function when the mouse button is released: */
            window.addEventListener("mouseup", slideFinish);
            /* Or touched (for touch screens: */
            slider.addEventListener("touchstart", slideReady);
            /* And released (for touch screens: */
            window.addEventListener("touchend", slideFinish);

            function slideReady(e) {
                /* Prevent any other actions that may occur when moving over the image: */
                e.preventDefault();
                /* The slider is now clicked and ready to move: */
                clicked = 1;
                /* Execute a function when the slider is moved: */
                window.addEventListener("mousemove", slideMove);
                window.addEventListener("touchmove", slideMove);
            }

            function slideFinish() {
                /* The slider is no longer clicked: */
                clicked = 0;
            }

            function slideMove(e) {
                var pos;
                /* If the slider is no longer clicked, exit this function: */
                if (clicked == 0) return false;
                /* Get the cursor's x position: */
                pos = getCursorPos(e);
                /* Prevent the slider from being positioned outside the image: */
                if (pos < 0) pos = 0;
                if (pos > w) pos = w;
                /* Execute a function that will resize the overlay image according to the cursor: */
                slide(pos);
            }

            function getCursorPos(e) {
                var a,
                    x = 0;
                e = e || window.event;
                /* Get the x positions of the image: */
                a = img.getBoundingClientRect();
                /* Calculate the cursor's x coordinate, relative to the image: */
                x = e.pageX - a.left;
                /* Consider any page scrolling: */
                x = x - window.pageXOffset;
                return x;
            }

            function slide(x) {
                /* Resize the image: */
                img.style.width = x + "px";
                /* Position the slider: */
                slider.style.left = img.offsetWidth - slider.offsetWidth / 2 + "px";
            }
        }
    }

    initComparisons();

    $("#toogle").trigger("click");

    function convert(string) {
        return string.split(".")[0];
    }

    // ################################  Load galamsey pic ####################################

    function onEach_Imagepoints(feature, layer) {
        // layer.on({ click: zoomToFeaturerpoint,
        //  });

        labeltoshow = '<div class="row">';

        labeltoshow +=
            '<a class="grouped_elements" data-fancybox="gallery" rel="group1"  href="https://servir.s3.eu-central-1.amazonaws.com/' +
            convert(feature.properties.img) +
            '.jpg "><img src="https://servir.s3.eu-central-1.amazonaws.com/' +
            convert(feature.properties.img) +
            '.jpg" style="width:100%" alt=""/></a>';

        labeltoshow += "</div>";
        labeltoshow +=
            '<div class="row"> <h5> ' + feature.properties.date + "</h6>";
        // labeltoshow +=
        labeltoshow += "</div>";

        layer.bindPopup(labeltoshow, { Width: "500px" });
    }

    $("a.grouped_elements").fancybox();

    // $("#single_image").fancybox({
    //         'transitionIn'  :   'elastic',
    //         'transitionOut' :   'elastic',
    //         'speedIn'       :   600,
    //         'speedOut'      :   200,
    //         'overlayShow'   :   false
    //     });

    //  var gala;
    //  var galastyle = {
    //    radius: 5,
    //    fillColor: "#ff7800",
    //    color: "#000",
    //    weight: 1,
    //    opacity: 1,
    //    fillOpacity: 0.8,
    //  };

    //  const geojsonurlpics = "http://boundapi.cersgis.org/galamseyimagesjson";
    // $.get(geojsonurlpics, function (data) {
    //    gala = L.geoJSON(data, {
    //      pointToLayer: function (feature, latlng) {
    //        return L.circleMarker(latlng, galastyle);
    //      },
    //      onEachFeature: onEach_Imagepoints,
    //    });
    //  });

    //  $("#galacheck").on("click", function (e) {
    //    // layerseldefine(mymap, layerssm, orig)
    //    layerTogglefunction(mymap, gala, $(this).hasClass("on"));
    //  });