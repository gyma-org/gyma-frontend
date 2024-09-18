"use client";

import mapboxgl from "@neshan-maps-platform/mapbox-gl";

import polyline from "@mapbox/polyline";

import "./index.css";
import React from "react";

import { useEffect, useRef } from "react";
import { Marker } from "mapbox-gl";

const Map = () => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapContainerRef.current) {
      mapRef.current = new mapboxgl.Map({
        mapType: mapboxgl.Map.mapTypes.neshanVector,
        container: mapContainerRef.current,
        zoom: 12,
        pitch: 0,
        center: [51.392173, 35.730954],
        minZoom: 2,
        maxZoom: 21,
        trackResize: true,
        mapKey: "web.659fc6316bb54b98b27499e3972b294e",
        poi: false,
        traffic: false,
      }) as unknown as mapboxgl.Map;

      mapRef.current.on("load", () => {
        handleClickOnMap();
        drawMarkerOnMap();
        addRouteToMap();
        drawPolygonOnMap();
      });
    }
  }, []);

  function addRouteToMap() {
    const routes: [number, number][][] = [];
    const points: number[][] = [];

    const exampleResponse = {
      routes: [
        {
          overview_polyline: {
            points: "cy{xEa{sxHCyEr@}FIi@MWi@Um@L[l@A^{Jr@",
          },
          legs: [
            {
              summary: "میدان انقلاب اسلامی - کارگر شمالی",
              distance: {
                value: 555.0,
                text: "۵۷۵ متر",
              },
              duration: {
                value: 99.0,
                text: "۲ دقیقه",
              },
              steps: [
                {
                  name: "آزادی",
                  instruction: "در جهت شرق در آزادی قرار بگیرید",
                  bearing_after: 88,
                  type: "depart",
                  distance: {
                    value: 197.0,
                    text: "۲۰۰ متر",
                  },
                  duration: {
                    value: 35.0,
                    text: "۱ دقیقه",
                  },
                  polyline: "cy{xEa{sxHAkBAmBDa@BKHs@BWD]J{@",
                  start_location: [51.388811, 35.70082],
                },
                {
                  name: "کارگر شمالی",
                  instruction: "در میدان انقلاب اسلامی، از خروجی سوم، خارج شوید",
                  rotaryName: "میدان انقلاب اسلامی",
                  bearing_after: 111,
                  type: "rotary",
                  modifier: "straight",
                  exit: 3,
                  distance: {
                    value: 146.0,
                    text: "۱۵۰ متر",
                  },
                  duration: {
                    value: 38.0,
                    text: "۱ دقیقه",
                  },
                  polyline: "}w{xEohtxHDSBUCUESEKGKSOUEW@UJORKXAN?N",
                  start_location: [51.390956, 35.700632],
                },
                {
                  name: "",
                  instruction: "به مسیر خود ادامه دهید",
                  bearing_after: 354,
                  type: "exit rotary",
                  modifier: "right",
                  exit: 3,
                  distance: {
                    value: 212.0,
                    text: "۲۲۵ متر",
                  },
                  duration: {
                    value: 39.0,
                    text: "۱ دقیقه",
                  },
                  polyline: "a|{xEuitxH_ADaBLO@{BRmAH",
                  start_location: [51.391154, 35.701293],
                },
                {
                  name: "کارگر شمالی",
                  instruction: "در مقصد قرار دارید",
                  bearing_after: 0,
                  type: "arrive",
                  distance: {
                    value: 0.0,
                    text: "",
                  },
                  duration: {
                    value: 0.0,
                    text: "",
                  },
                  polyline: "}g|xEahtxH",
                  start_location: [51.390885, 35.703188],
                },
              ],
            },
          ],
        },
      ],
    };

    for (let k = 0; k < exampleResponse.routes.length; k++) {
      for (let j = 0; j < exampleResponse.routes[k].legs.length; j++) {
        for (let i = 0; i < exampleResponse.routes[k].legs[j].steps.length; i++) {
          const step = exampleResponse.routes[k].legs[j].steps[i]["polyline"];
          const point = exampleResponse.routes[k].legs[j].steps[i]["start_location"];

          const route = polyline.decode(step, 5);

          route.map((item: number[]) => {
            item.reverse();
          });

          routes.push(route);
          points.push(point);
        }
      }
    }

    const map = mapRef.current;

    map?.on("load", function () {
      map.addSource("route", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "MultiLineString",
                coordinates: routes,
              },
              properties: null,
            },
          ],
        },
      });
      map.addSource("points1", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "MultiPoint",
                coordinates: points,
              },
              properties: null,
            },
          ],
        },
      });

      map.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#250ECD",
          "line-width": 9,
        },
      });

      map.addLayer({
        id: "points1",
        type: "circle",
        source: "points1",
        paint: {
          "circle-color": "#9fbef9",
          "circle-stroke-color": "#FFFFFF",
          "circle-strokeWidth": 2,
          "circle-radius": 5,
        },
      });
    });
  }

  function drawMarkerOnMap() {
    const map = mapRef.current;

    if (map) {
      new mapboxgl.Marker({ color: "purple" }).setLngLat([51.405574, 35.719938]).addTo(map);

      const popup = new mapboxgl.Popup({ offset: 25 }).setText(
        "با نگه داشتن مارکر می‌توانید آن را روی نقشه جابه‌جا کنید"
      );

      new mapboxgl.Marker({ color: "#00F955", draggable: true })
        .setPopup(popup)
        .setLngLat([51.4055941, 35.70019216])
        .addTo(map)
        .togglePopup();

      const geojson = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [51.338057, 35.699736],
            },
            properties: {
              title: "میدان آزادی",
              description: "نمایش مارکر با آیکون اختصاصی <br/> مختصات:<br/> [51.338057 , 35.699736]",
            },
          },
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [51.375265, 35.74472],
            },
            properties: {
              title: "برج میلاد",
              description: "مختصات:<br/> [51.375265 , 35.744720]",
            },
          },
        ],
      };

      for (const feature of geojson.features) {
        const el = document.createElement("div");
        el.className = "marker";
        new mapboxgl.Marker(el)
          .setLngLat(feature.geometry.coordinates as [number, number])
          .setPopup(
            new mapboxgl.Popup({ offset: 40 }).setHTML(
              `<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`
            )
          )
          .addTo(map)
          .togglePopup();
      }
    }
  }

  function drawPolygonOnMap() {
    const map = mapRef.current;
    if (map) {
      // map.addSource("poly", {
      // 	type: "geojson",
      // 	data: {
      // 		type: "FeatureCollection",
      // 		features: [
      // 			{
      // 				type: "Feature",
      // 				properties: {
      // 					name: "tehran University",
      // 					stroke: "#555555",
      // 					"strokeWidth": 3,
      // 					"stroke-opacity": 1,
      // 					fill: "#e230e7",
      // 					"fill-opacity": 0.4,
      // 				},
      // 				geometry: {
      // 					coordinates: [
      // 						[
      // 							[51.392153869298085, 35.70599700070689],
      // 							[51.39423091885348, 35.70113968739244],
      // 							[51.39822005194469, 35.70123056336374],
      // 							[51.39573429635138, 35.70697949099247],
      // 							[51.392153869298085, 35.70599700070689],
      // 						],
      // 					],
      // 					type: "Polygon",
      // 				},
      // 				id: 0,
      // 			},
      // 			{
      // 				type: "Feature",
      // 				properties: {
      // 					name: "Islamic revolution square",
      // 					"marker-color": "#7e7e7e",
      // 					"marker-size": "medium",
      // 					"marker-symbol": "circle",
      // 				},
      // 				geometry: {
      // 					coordinates: [51.391168881656654, 35.70095570031016],
      // 					type: "Point",
      // 				},
      // 				id: 1,
      // 			},
      // 			{
      // 				type: "Feature",
      // 				properties: {
      // 					name: "Laleh Park to Daneshjoo Park",
      // 					stroke: "#0032FF",
      // 					"strokeWidth": 4,
      // 				},
      // 				geometry: {
      // 					coordinates: [
      // 						[51.39614727982291, 35.71104319431835],
      // 						[51.40040823327368, 35.701051919124325],
      // 						[51.40659890297641, 35.701192981898316],
      // 					],
      // 					type: "LineString",
      // 				},
      // 				id: 2,
      // 			},
      // 			{
      // 				type: "Feature",
      // 				properties: {
      // 					name: "Vali-e Asr Square",
      // 				},
      // 				geometry: {
      // 					coordinates: [51.40703037624576, 35.71165597537197],
      // 					type: "Point",
      // 				},
      // 				id: 4,
      // 			},
      // 			{
      // 				type: "Feature",
      // 				properties: {
      // 					name: "Laleh Park",
      // 					stroke: "#555555",
      // 					"strokeWidth": 3,
      // 					"stroke-opacity": 2,
      // 					fill: "#e230e7",
      // 					"fill-opacity": 0.4,
      // 				},
      // 				geometry: {
      // 					coordinates: [
      // 						[
      // 							[51.3911101366981, 35.71471999612072],
      // 							[51.39154294420885, 35.71399441971964],
      // 							[51.39114444871424, 35.71369188653436],
      // 							[51.39085722161798, 35.71330918414725],
      // 							[51.3907308187415, 35.71298731605151],
      // 							[51.39064628519219, 35.71270201489284],
      // 							[51.390654762582045, 35.71246247596444],
      // 							[51.39076691640008, 35.71190324007553],
      // 							[51.39097056196405, 35.71119491377392],
      // 							[51.3909442836443, 35.71102116786325],
      // 							[51.39074464874457, 35.710818035648316],
      // 							[51.39036964297492, 35.710605841938076],
      // 							[51.390056478405086, 35.71048869968217],
      // 							[51.39028912155362, 35.70872989546359],
      // 							[51.390632385160785, 35.70870650430683],
      // 							[51.39089291110179, 35.70863408057632],
      // 							[51.39117474346281, 35.70848477626528],
      // 							[51.391328838698854, 35.70832536431581],
      // 							[51.39142630494038, 35.70806230639059],
      // 							[51.39144347890297, 35.70788992816584],
      // 							[51.3920231360905, 35.707803574379426],
      // 							[51.393014186341645, 35.70790981639327],
      // 							[51.39604878933889, 35.7087700697209],
      // 							[51.39596014062121, 35.709247526760194],
      // 							[51.39576888801207, 35.70966900566374],
      // 							[51.39587522646423, 35.709869501969365],
      // 							[51.395731511260465, 35.710286472057135],
      // 							[51.396294489884724, 35.71045539895077],
      // 							[51.39602524881758, 35.71114052570134],
      // 							[51.39551885836519, 35.711020331217426],
      // 							[51.395380077672456, 35.711020331217426],
      // 							[51.395174610154214, 35.711087650059724],
      // 							[51.394899807900345, 35.71140935658491],
      // 							[51.394651557444234, 35.71207372587263],
      // 							[51.39469865121757, 35.712094736112306],
      // 							[51.394470327368936, 35.71265161541061],
      // 							[51.39423973311804, 35.713153228124284],
      // 							[51.39408264903469, 35.71342261344962],
      // 							[51.393753966183766, 35.71375515606104],
      // 							[51.39343307378286, 35.71403475525386],
      // 							[51.393557001241675, 35.71415662253669],
      // 							[51.39346538772176, 35.714420089483085],
      // 							[51.39284676473335, 35.714191554786495],
      // 							[51.39269080090082, 35.71449982512941],
      // 							[51.39264677337022, 35.7144994279347],
      // 							[51.392594429528316, 35.71451928767068],
      // 							[51.3922669444423, 35.715142935321],
      // 							[51.3911101366981, 35.71471999612072],
      // 						],
      // 					],
      // 					type: "Polygon",
      // 				},
      // 				id: 5,
      // 			},
      // 		],
      // 	},
      // });

      map.addLayer({
        id: "pointLayer",
        type: "circle",
        source: "poly",
        filter: ["==", "$type", "Point"],
        paint: {
          "circle-radius": 6,
          "circle-strokeWidth": 2,
          "circle-color": "red",
          "circle-stroke-color": "blue",
        },
      });

      map.addLayer({
        id: "linesLayer",
        type: "line",
        source: "poly",
        filter: ["==", "$type", "LineString"],
        paint: {
          "line-color": ["get", "stroke"],
          "line-width": ["get", "strokeWidth"],
        },
      });

      map.addLayer({
        id: "polygonsLayer",
        type: "fill",
        source: "poly",
        filter: ["==", "$type", "Polygon"],
        paint: {
          "fill-color": ["get", "fill"],
          "fill-opacity": 0.3,
          "fill-outline-color": "#9ddcfb",
        },
      });
    }
  }

  function handleClickOnMap() {
    const map = mapRef.current;
    if (map) {
      let marker: Marker;
      map.on("click", (e: mapboxgl.EventData) => {
        console.log(e.lngLat);
        if (marker) {
          marker.remove();
        }
        marker = new mapboxgl.Marker().setLngLat(e.lngLat).addTo(map);
      });
    }
  }

  return (
    <>
      {typeof window !== "undefined" && (
        <div ref={mapContainerRef} id="map" style={{ width: "100vw", height: "100vh" }} />
      )}
    </>
  );
};

export default Map;
