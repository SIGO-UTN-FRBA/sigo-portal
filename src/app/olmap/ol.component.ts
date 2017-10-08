import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { OlService } from './ol.service';
import Map = ol.Map;
import GeoJSON = ol.format.GeoJSON;
import Tile = ol.layer.Tile;
import VectorSource = ol.source.Vector;
import VectorLayer = ol.layer.Vector;
import Feature = ol.Feature;
import Style = ol.style.Style;
import Circle = ol.style.Circle;
import Polygon = ol.geom.Polygon;
import Point = ol.geom.Point;


@Component({
  selector: 'app-map',
  providers: [OlService],
  template: `
    <div id="map" class="map"></div>
    <div id="ol-popup">
      <div id="ol-popup-content"></div>
    </div>
  `

}) export class OlComponent implements OnInit {

  @Input() map : Map;
  @Output() mapChange:EventEmitter<Map> = new EventEmitter<Map>();
  layers = { airport: null, runway: null, direction: null };

  constructor(private olService: OlService) {

  }

  getAirportLayer() : VectorLayer {
    if(this.layers.airport != null)
      return this.layers.airport;

    let airportSource = new VectorSource({
      format: new GeoJSON({
        defaultDataProjection: 'EPSG:3857',
        featureProjection: 'EPSG:3857'
      })
    });

    let airportLayer = new VectorLayer({
      source: airportSource,
      style: new Style({
        image: new Circle({
          radius: 7,
          fill: new ol.style.Fill({color: 'lightgreen'}),
          stroke: new ol.style.Stroke({ color: 'green', width:2})
        })
      })
    });

    this.map.addLayer(airportLayer);

    return airportLayer;
  }

  getRunwayLayer() : VectorLayer {

    if(this.layers.runway != null)
      return this.layers.runway;

    let runwaySource = new VectorSource({
      format: new GeoJSON({
        defaultDataProjection: 'EPSG:3857',
        featureProjection: 'EPSG:3857'
      })
    });

    let runwayLayer = new VectorLayer({
      source: runwaySource,
      style: new Style({
        stroke: new ol.style.Stroke({color: 'darkgray', width:1}),
        fill: new ol.style.Fill({color: 'black'})
      })
    });

    this.map.addLayer(runwayLayer);

    return runwayLayer;
  }

  getDirectionLayer() : VectorLayer {

    if(this.layers.direction != null)
      return this.layers.direction;

    let directionSource = new VectorSource({
      format: new GeoJSON({
        defaultDataProjection: 'EPSG:3857',
        featureProjection: 'EPSG:3857'
      })
    });

    let directionLayer = new VectorLayer({
      source: directionSource,
      style: new ol.style.Style({
        image: new ol.style.RegularShape({
          fill: new ol.style.Fill({color: 'red'}),
          stroke: new ol.style.Stroke({color: 'black', width: 1}),
          points: 5,
          radius: 7
        })
      })
    });

    this.map.addLayer(directionLayer);

    return directionLayer;
  }

  getOMS(){

    let OSM = new Tile({
      source: new ol.source.OSM()
    });

    OSM.set('name', 'Openstreetmap');

    return OSM;
  }

  createMap = () => {

    this.map = new Map({
      target: 'map',
      layers: [this.getOMS()],
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

  public addRunway (geom : Polygon, options : {center: boolean, zoom: number}){

    //TODO pasar una geometry con sus propiedades y no una coordinada.

    let tmp = new ol.geom.Polygon(geom['coordinates']);

    let feature = new Feature({
      id: 'y',
      name: 'y',
      geometry: tmp.transform('EPSG:4326', 'EPSG:3857')
    });

    this.addFeature(feature, this.getRunwayLayer(), options);
  }

  public addAirport (geom: Point, options :{center: boolean, zoom: number}) {

    //TODO pasar una geometry con sus propiedades y no una coordinada.

    let tmp = new ol.geom.Point(geom['coordinates']);

    let feature = new ol.Feature({
      geometry: tmp.transform('EPSG:4326', 'EPSG:3857'),
      name: 'xx',
      id: 'xx',
    });

    this.addFeature(feature, this.getAirportLayer(), options);
  };

  public addDirection(geom: Point, options :{center: boolean, zoom: number}) {

    let tmp = new ol.geom.Point(geom['coordinates']);

    let feature = new ol.Feature({
      geometry: tmp.transform('EPSG:4326', 'EPSG:3857'),
      name: 'xx',
      id: 'xx',
    });

    this.addFeature(feature, this.getDirectionLayer(), options);
  }

  private addFeature(feature : Feature, layer : VectorLayer,  options :{center: boolean, zoom: number}){

    layer.getSource().addFeature(feature);

    if(options.center)
      this.map.getView().setCenter(ol.extent.getCenter(feature.getGeometry().getExtent()));

    if(options.zoom)
      this.map.getView().setZoom(options.zoom);
  }

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
