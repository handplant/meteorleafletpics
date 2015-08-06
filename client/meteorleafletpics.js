Template.meteorleafletpics.onRendered(function () {

    var markerArray = [];
    var layers = {};

    var basemaps = {
        "Topographic": L.esri.basemapLayer('Topographic'),
        "Streets": L.esri.basemapLayer('Streets'),
        "National Geographic": L.esri.basemapLayer('NationalGeographic'),
        "Oceans": L.esri.basemapLayer('Oceans'),
        "Gray": L.esri.basemapLayer('Gray'),
        "DarkGray": L.esri.basemapLayer('DarkGray'),
        "Imagery": L.esri.basemapLayer('Imagery'),
        "Shaded Relief": L.esri.basemapLayer('ShadedRelief')
    };

    var icon_current = L.divIcon({
        iconSize: new L.Point(20, 20),
        className: 'icon_current'
    });

    var controlOptions = {
        zoom: true,
        fullscreen: true,
        layers: true,
        loading: true,
        coordinate: true
    }

    var mapOptions = {
        minZoom: undefined,
        maxZoom: undefined,
        maxBounds: undefined,
        dragging: true,
        touchZoom: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        trackResize: true,
        closePopupOnClick: true,
        zoomControl: false,
        attributionControl: false
    }

    L.Icon.Default.imagePath = 'packages/bevanhunt_leaflet/images';
    Tracker.autorun(function () {
        if (Geolocation.latLng()) {

            var currentPoint = Geolocation.latLng();
            //var currentPoint = {lat: 40.712784, lng: -74.005941}; -> New York

            // Create Map
            var map = L.map('map', mapOptions).setView([currentPoint.lat, currentPoint.lng], 8);

            // Controlls
            if (controlOptions.layers) {
                var layersControl = L.control.layers(basemaps, layers).addTo(map);
            }
            if (controlOptions.zoom) {
                var zoomControl = L.control.zoom().addTo(map);
            }
            if (controlOptions.fullscreen) {
                var fullscreenControl = new L.Control.FullScreen().addTo(map);
            }
            if (controlOptions.loading) {
                var loadingControl = L.Control.loading().addTo(map);
            }
            if (controlOptions.coordinate) {
                var coordinateControl = L.control.coordinates().addTo(map);
            }

            // Add default layer
            map.addLayer(basemaps.Streets);

            // Create current location marker
            var currentmarker = L.marker([currentPoint.lat, currentPoint.lng], {icon: icon_current}).addTo(map).bindPopup("Your are here!");
            markerArray.push(currentmarker);

            //Get Instagram Pics by locationsearch
            Meteor.call('getInstragramPics', currentPoint.lat, currentPoint.lng, function (error, result) {

                if (result) {
                    var data = result.data.data;
                    for (var i = 0; i < data.length; i++) {
                        var marker = L.marker(
                            [data[i].location.latitude, data[i].location.longitude],
                            {
                                icon: L.divIcon({
                                    iconSize: new L.Point(50, 50),
                                    className: 'icon_pic',
                                    html: '<a href="' + data[i].link + '" target="_blank"><img style="width:50px" src="' + data[i].images.thumbnail.url + '"></a>'
                                })
                            }
                        );
                        markerArray.push(marker);
                        marker.addTo(map);
                    }
                    var group = L.featureGroup(markerArray).addTo(map);
                    map.fitBounds(group.getBounds());
                }
            });


        }
    });

});