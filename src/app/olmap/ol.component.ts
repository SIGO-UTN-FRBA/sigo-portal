import {Component, OnInit, Input, Output, EventEmitter, Optional} from '@angular/core';
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
import Geometry = ol.geom.Geometry;


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
  layers : {
    airport: VectorLayer,
    runway: VectorLayer,
    direction: VectorLayer,
    threshold: VectorLayer,
    individual: VectorLayer,
    building: VectorLayer,
    wiring: VectorLayer
  };

  constructor() {
    this.layers = {
      airport: null,
      runway: null,
      direction: null,
      threshold: null,
      individual: null,
      building: null,
      wiring: null
    };
  }

  private createVectorSource() {
    return new VectorSource({
      format: new GeoJSON({
        defaultDataProjection: 'EPSG:3857',
        featureProjection: 'EPSG:3857'
      })
    });
  }

  clearAiportLayer() : OlComponent {
    this.getAirportLayer().getSource().clear();

    return this;
  }

  getAirportLayer() : VectorLayer {
    if(this.layers.airport != null)
      return this.layers.airport;

    let airportLayer = new VectorLayer({
      source: this.createVectorSource(),
      style: new Style({
        image: new Circle({
          radius: 7,
          fill: new ol.style.Fill({color: 'lightgreen'}),
          stroke: new ol.style.Stroke({ color: 'green', width:2})
        })
      })
    });

    this.layers.airport = airportLayer;

    this.map.addLayer(airportLayer);

    return airportLayer;
  }

  clearRunwayLayer() : OlComponent {
    this.getRunwayLayer().getSource().clear();

    return this;
  }

  getRunwayLayer() : VectorLayer {

    if(this.layers.runway != null)
      return this.layers.runway;

    let runwayLayer = new VectorLayer({
      source: this.createVectorSource(),
      style: new Style({
        stroke: new ol.style.Stroke({color: 'darkgray', width:1}),
        fill: new ol.style.Fill({color: 'black'})
      })
    });

    this.layers.runway = runwayLayer;

    this.map.addLayer(runwayLayer);

    return runwayLayer;
  }

  clearDirectionLayer() : OlComponent {
    this.getDirectionLayer().getSource().clear();

    return this;
  }

  getDirectionLayer() : VectorLayer {

    if(this.layers.direction != null)
      return this.layers.direction;

    let directionLayer = new VectorLayer({
      source: this.createVectorSource(),
      style: new Style({
        image: new Circle({
          radius: 3,
          fill: new ol.style.Fill({color: 'red'}),
          stroke: new ol.style.Stroke({ color: 'gray', width:2})
        })
      })
    });

    this.layers.direction = directionLayer;

    this.map.addLayer(directionLayer);

    return directionLayer;
  }

  clearDisplacedThresholdLayer() : OlComponent {
    this.getDisplacedThresholdLayer().getSource().clear();

    return this;
  }

  getDisplacedThresholdLayer() : VectorLayer {
    if(this.layers.threshold != null)
      return this.layers.threshold;

    let thresholdLayer = new VectorLayer({
      source: this.createVectorSource(),
      style: new Style({
        stroke: new ol.style.Stroke({color: 'darkgray', width:1}),
        fill: new ol.style.Fill({color: 'rgba(0, 0, 0, 0.75)' })
      }),
      map: this.map
    });

    this.layers.threshold = thresholdLayer;

    this.map.addLayer(thresholdLayer);

    return thresholdLayer;
  }

  clearIndividualObjectLayer() : OlComponent {
    this.getIndividualObjectLayer().getSource().clear();

    return this;
  }

  getIndividualObjectLayer() : VectorLayer {
    if(this.layers.individual != null)
      return this.layers.individual;

    let layer = new VectorLayer({
      source: this.createVectorSource(),
      style: new ol.style.Style({
        image: new ol.style.RegularShape({
          stroke: new ol.style.Stroke({color: 'black', width: 2}),
          points: 4,
          radius: 10,
          radius2: 0,
          angle: Math.PI / 4
        })
      })
    });

    this.layers.individual = layer;

    this.map.addLayer(layer);

    return layer;
  }

  clearBuildingObjectLayer() : OlComponent{
    this.getBuildingObjectLayer().getSource().clear();

    return this;
  }

  getBuildingObjectLayer() : VectorLayer {
    if(this.layers.building != null)
      return this.layers.building;

    let layer = new VectorLayer({
      source: this.createVectorSource(),
      style: new Style({
        stroke: new ol.style.Stroke({color: 'darkgray', width:1}),
        fill: new ol.style.Fill({color: 'rgba(0, 0, 0, 0.85)' })
      }),
    });

    this.layers.building = layer;

    this.map.addLayer(layer);

    return layer;
  }

  clearWiringObjectLayer() : OlComponent {
    this.getWiringObjectLayer().getSource().clear();

    return this;
  }

  getWiringObjectLayer() : VectorLayer {
    if(this.layers.wiring != null)
      return this.layers.wiring;

    let layer = new VectorLayer({
      source: this.createVectorSource(),
      style: new Style({
        stroke: new ol.style.Stroke({color: 'darkgray', width:1})
      }),
    });

    this.layers.wiring = layer;

    this.map.addLayer(layer);

    return layer;
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

  public addRunway (geom : Polygon, options? : {center?: boolean, zoom?: number}){

    //TODO para una feature y no solo una geom

    let tmp = new ol.geom.Polygon(geom['coordinates']);

    let feature = new Feature({
      id: 'y',
      name: 'y',
      geometry: tmp.transform('EPSG:4326', 'EPSG:3857')
    });

    this.addFeature(feature, this.getRunwayLayer(), options);
  }

  public addAirport (geom: Point, options? :{center?: boolean, zoom?: number}) {

    //TODO para una feature y no solo una geom

    let tmp = new ol.geom.Point(geom['coordinates']);

    let feature = new ol.Feature({
      geometry: tmp.transform('EPSG:4326', 'EPSG:3857'),
      name: 'x',
      id: 'x',
    });

    this.addFeature(feature, this.getAirportLayer(), options);
  };

  public addDirection(geom: Point, options :{center?: boolean, zoom?: number}) : OlComponent {

    //TODO para una feature y no solo una geom

    let tmp = new ol.geom.Point(geom['coordinates']);

    let feature = new ol.Feature({
      geometry: tmp.transform('EPSG:4326', 'EPSG:3857'),
      name: 'w',
      id: 'w',
    });

    this.addFeature(feature, this.getDirectionLayer(), options);

    return this;
  }

  public addThreshold(geom: Polygon, options? : {center?: boolean, zoom?: number}){

    //TODO para una feature y no solo una geom

    let tmp = new ol.geom.Polygon(geom['coordinates']);

    let feature = new ol.Feature({
      geometry: tmp.transform('EPSG:4326', 'EPSG:3857'),
      name: 'Displaced Threshold',
      id: 'z',
    });

    this.addFeature(feature, this.getDisplacedThresholdLayer(), options);
  }

  public addIndividualObject(geom: Geometry, options?: { center?: boolean; zoom?: number }) {

    //TODO para una feature y no solo una geom

    let tmp = new ol.geom.Point(geom['coordinates']);

    let feature = new ol.Feature({
      geometry: tmp.transform('EPSG:4326', 'EPSG:3857'),
      name: 'Individual Objects',
      id: 'i',
    });

    this.addFeature(feature, this.getIndividualObjectLayer(), options);
  }

  public addBuildingObject(geom: Geometry, options? : {center?: boolean, zoom?: number}){

    //TODO para una feature y no solo una geom

    let tmp = new ol.geom.MultiPolygon(geom['coordinates']);

    let feature = new ol.Feature({
      geometry: tmp.transform('EPSG:4326', 'EPSG:3857'),
      name: 'Building Objects',
      id: 'b',
    });

    this.addFeature(feature, this.getBuildingObjectLayer(), options);
  }

  public addWiringObject(geom: Geometry, options? : {center?: boolean, zoom?: number}){

    //TODO para una feature y no solo una geom

    let tmp = new ol.geom.LineString(geom['coordinates']);

    let feature = new ol.Feature({
      geometry: tmp.transform('EPSG:4326', 'EPSG:3857'),
      name: 'Wiring Objects',
      id: 'w',
    });

    this.addFeature(feature, this.getWiringObjectLayer(), options);
  }

  private addFeature(feature : Feature, layer : VectorLayer,  options? :{center?: boolean, zoom?: number}){

    layer.getSource().addFeature(feature);

    if(options != null && options.center)
      this.map.getView().setCenter(ol.extent.getCenter(feature.getGeometry().getExtent()));

    if(options != null && options.zoom)
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
