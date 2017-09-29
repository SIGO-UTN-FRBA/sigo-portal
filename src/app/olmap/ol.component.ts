import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { OlService } from './ol.service';
import Map = ol.Map;

@Component({
  selector: 'app-map',
  providers: [OlService],
  template: `
    <div id="map" class="map"></div>
  `

}) export class OlComponent implements OnInit {
//test : string;
  @Input() test : string;
  @Output() testChange:EventEmitter<string> = new EventEmitter<string>();
  lnglat: [number, number];
  zoom: number;
  map : Map;

  public layers = [];
  private vectorSource;

  constructor(private olService: OlService) {

    this.lnglat = [-93.49401, 45.08203];
    this.zoom = 7;

  }

  createMap = () => {
    console.info("createMap 1");
    let ol = this.olService.get();

    this.vectorSource = new ol.source.Vector({});
    // define layers

    let OSM = new ol.layer.Tile({
      source: new ol.source.OSM()
    });

    OSM.set('name', 'Openstreetmap');

    let boundaries = new ol.layer.Tile({
      opacity: 0.5,

      source: new ol.source.TileWMS({
        url: '',
        params: {
          'LAYERS': 'fwsys:fwsys_region',
          'TILED': true,
          'transparent': 'true',
          'format': 'image/png'
        },
        serverType: 'geoserver',
        projection: ol.proj.get('EPSG:3857')
      })
    });

    boundaries.set('name', 'Boundaries');
    let vector = new ol.layer.Vector({
      source: this.vectorSource
    });

    this.map = new ol.Map({
      target: 'map',
      layers: [OSM, vector, boundaries],

      view: new ol.View({
        center: ol.proj.fromLonLat(this.lnglat),
        zoom: this.zoom,
        projection: ol.proj.get('EPSG:3857')
      })
    });

    let select_interaction = new ol.interaction.Select();

    this.map.addInteraction(select_interaction);

    // add popup for all features
    let container = document.getElementById('ol-popup');
    let content = document.getElementById('ol-popup-content');



    let popup = new ol.Overlay({
      element: container,
      autoPan: true,
      positioning: 'bottom-center',
      stopEvent: false,
      offset: [0, -5]
    });

    this.map.addOverlay(popup);

    this.map.on('click', (evt) => {
      let feature = this.map.forEachFeatureAtPixel(evt.pixel, (feat) => {
        return feat;
      });
      if (feature) {
        let coordinate = evt.coordinate;
        content.innerHTML = feature.get('name');
        popup.setPosition(coordinate);
      }
    });

    this.test = "oooooooooooooooooooooo";

    console.info("createMap 2");
  };

  addPolygon = (polygon: [[number, number]], name: string, id: string) => {
    let ol = this.olService.get();
    let projectedPolygon = [];

    for (let poly of polygon) {
      projectedPolygon.push(ol.proj.transform(poly, 'EPSG:4326', 'EPSG:3857'));
    }

    let p = new ol.geom.Polygon([projectedPolygon]);

    let featurething = new ol.Feature({
      name: name,
      id: id,
      geometry: p
    });

    this.vectorSource.addFeature(featurething);

  };


  setMarker(coords: [number, number], name: string, id: string) {

    this.addMarker(coords, name, id);
  }

  addMarker = (coords: [number, number], name: string, id: string) => {

    let ol = this.olService.get();
    let iconFeature = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.transform(coords, 'EPSG:4326', 'EPSG:3857')),
      name: name,
      id: id,
    });

    let iconStyle = new ol.style.Style({
      image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
        opacity: 0.75,
        anchor: [0.5, 1],
        src: '//cdn4.iconfinder.com/data/icons/pictype-free-vector-icons/16/location-alt-32.png'
      }))
    });

    iconFeature.setStyle(iconStyle);

    this.vectorSource.addFeature(iconFeature);
  };

  addLayerSwitcher = (layers: [any]) => {

    this.layers = layers;

  };

  toggleLayer = (layer, evt) => {
    evt.target.blur();
    if (layer.getVisible()) {
      layer.setVisible(false);

    } else {
      layer.setVisible(true);
    }

  };

  ngOnInit() {
    this.test = "qqqqqqqqqqqqqqqqqqq";
    this.createMap();
    console.info("createMap 3");
  }

}
