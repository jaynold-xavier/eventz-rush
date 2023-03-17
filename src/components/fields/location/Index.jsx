import React, { useEffect, useState, useRef } from "react";

import mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiamFhYXMiLCJhIjoiY2s2dDRnMnRsMGx2cTNlbWwwMnB1c3hmdSJ9.BYKSIvv_PmPjZz7uORi9ng";

export default function LocationSelect({ value, onChange }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const searchBar = useRef(null);

  const [lng, setLng] = useState(74.06);
  const [lat, setLat] = useState(15.34);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (map.current) return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      interactive: true,
      zoom: zoom,
    });

    // set lat lng on move on map
    // map.current.on("move", () => {
    //   setLng(map.current.getCenter().lng.toFixed(4));
    //   setLat(map.current.getCenter().lat.toFixed(4));
    //   setZoom(map.current.getZoom().toFixed(2));
    // });

    // add marker
    marker.current = new mapboxgl.Marker({
      draggable: true,
      color: "hotpink",
    })
      .setLngLat([74.0521178838552, 15.344321901202562])
      .addTo(map.current);

    //Define and config search bar
    const geoCoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      marker: false,
      // limit results to India
      countries: "in",
      mapboxgl: mapboxgl,
      // further limit results to the geographic bounds representing the region of
      // Goa
      bbox: [71.889038, 14.765587, 74.502411, 16.000936],

      // apply address client side filter to further limit results to those strictly within
      // Goa
      filter: function (item) {
        // returns true if item contains New South Wales region
        return item.context
          .map(function (i) {
            // id is in the form {index}.{id} per https://github.com/mapbox/carmen/blob/master/carmen-geojson.md
            // this example attempts to find the `region` named `New South Wales`
            return i.id.split(".").shift() === "region" && i.text === "Goa";
          })
          .reduce(function (acc, cur) {
            return acc || cur;
          });
      },
    });

    if (geoCoder) {
      geoCoder.on("result", function (args) {
        marker.current.setLngLat(args.result.center);
        onChange(args.result.place_name);
      });

      map.current.addControl(geoCoder);
    }

    searchBar.current = geoCoder;
  });

  useEffect(() => {
    if (searchBar.current && value) {
      searchBar.current.setInput(value);
    }
  }, [value]);

  return (
    <div ref={mapContainer} className="map-container" style={{ height: 200 }} />
  );
}
