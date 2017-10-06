import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { OlService } from './ol.service';
import Map = ol.Map;
import GeoJSON = ol.format.GeoJSON;
import Tile = ol.layer.Tile;
import VectorSource = ol.source.Vector;
import VectorLayer = ol.layer.Vector;
import LineString = ol.geom.LineString;
import Feature = ol.Feature;


@Component({
  selector: 'app-map',
  providers: [OlService],
  template: `
    <div id="map" class="map"></div>
  `

}) export class OlComponent implements OnInit {

  @Input() map : Map;
  @Output() mapChange:EventEmitter<Map> = new EventEmitter<Map>();

  public layers = [];
  private airportSource;
  private runwaySource;

  constructor(private olService: OlService) {

  }

  createMap = () => {

    this.airportSource = new VectorSource({
      format: new GeoJSON({
        defaultDataProjection: 'EPSG:3857',
        featureProjection: 'EPSG:3857'
      })
    });

    this.runwaySource = new VectorSource({
      format: new GeoJSON({
        defaultDataProjection: 'EPSG:3857',
        featureProjection: 'EPSG:3857'
      })
    });

    // define layers

    let OSM = new Tile({
      source: new ol.source.OSM()
    });

    OSM.set('name', 'Openstreetmap');

    let airportLayer = new VectorLayer({
      source: this.airportSource
    });

    let runwayLayer = new VectorLayer({
      source: this.runwaySource
    });

    this.map = new Map({
      target: 'map',
      layers: [OSM, airportLayer, runwayLayer],

      view: new ol.View({
        center: ol.proj.fromLonLat([0,0]),
        zoom: 7,
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
  };

  public addRunway (geom : LineString, options :{center: boolean, zoom: number}){

    let projectedLine = [];

    for (let coord of geom['coordinates']) {
      projectedLine.push(ol.proj.transform(coord, 'EPSG:4326', 'EPSG:3857'));
    }

    let line = new ol.geom.LineString(projectedLine);

    let feature = new Feature({
      id: 'y',
      name: 'y',
      geometry: line
    });

    this.runwaySource.addFeature(feature);

    if(options.center)
      this.map.getView().setCenter(ol.extent.getCenter(feature.getGeometry().getExtent()));

    if(options.zoom)
      this.map.getView().setZoom(options.zoom);
  }

  public addAirport (coords: [number, number], options :{center: boolean, zoom: number}) {

    let feature = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.transform(coords, 'EPSG:4326', 'EPSG:3857')),
      name: 'xx',
      id: 'xx',
    });

    let iconStyle = new ol.style.Style({
      image: new ol.style.Icon(({
        opacity: 0.75,
        anchor: [0.5, 1],
        src: 'http://icons.iconarchive.com/icons/paomedia/small-n-flat/16/map-marker-icon.png'
      }))
    });

    feature.setStyle(iconStyle);

    this.airportSource.addFeature(feature);

    if(options.center)
      this.map.getView().setCenter(ol.extent.getCenter(feature.getGeometry().getExtent()));

    if(options.zoom)
      this.map.getView().setZoom(options.zoom);
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
    this.createMap();
  }

}
