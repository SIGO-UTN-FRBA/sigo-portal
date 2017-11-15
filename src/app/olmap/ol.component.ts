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
import {OlLayers} from "./olLayers";


@Component({
  selector: 'app-map',
  providers: [OlService],
  template: `
    <div id="map" class="map"></div>
    <div id="ol-popup" class="ol-popup">
      <a href="#" id="popup-closer" class="ol-popup-closer"></a>
      <div id="popup-content"></div>
    </div>
  `

}) export class OlComponent implements OnInit {

  @Input() map : Map;
  @Output() mapChange:EventEmitter<Map> = new EventEmitter<Map>();
  layers : OlLayers;
  scaleLineControl;
  fullScreenControl;

  constructor() {
    this.layers = new OlLayers();
  }

  private createVectorSource() {
    return new VectorSource({
      format: new GeoJSON({
        defaultDataProjection: 'EPSG:3857',
        featureProjection: 'EPSG:3857'
      })
    });
  }

  clearAirportLayer() : OlComponent {
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
        stroke: new ol.style.Stroke({color: 'darkred', width:1}),
        fill: new ol.style.Fill({color: 'rgba(255, 0, 0, 0.6)' })
      }),
      map: this.map
    });

    this.layers.threshold = thresholdLayer;

    this.map.addLayer(thresholdLayer);

    return thresholdLayer;
  }

  clearStopwayLayer() : OlComponent {
    this.getStopwayLayer().getSource().clear();

    return this;
  }

  getStopwayLayer() : VectorLayer {
    if(this.layers.stopway != null)
      return this.layers.stopway;

    let layer = new VectorLayer({
      source: this.createVectorSource(),
      style: new Style({
        stroke: new ol.style.Stroke({color: 'darkblue', width:1}),
        fill: new ol.style.Fill({color: 'rgba(0, 0, 255, 0.75)' })
      })
    });

    this.layers.stopway = layer;

    this.map.addLayer(layer);

    return layer;
  }

  clearClearwayLayer() : OlComponent {
    this.getClearwayLayer().getSource().clear();

    return this;
  }

  getClearwayLayer() : VectorLayer {
    if(this.layers.clearway != null)
      return this.layers.clearway;

    let layer = new VectorLayer({
      source: this.createVectorSource(),
      style: new Style({
        stroke: new ol.style.Stroke({color: 'darkgreen', width:1}),
        fill: new ol.style.Fill({color: 'rgba(0, 255, 0, 0.6)' })
      })
    });

    this.layers.clearway = layer;

    this.map.addLayer(layer);

    return layer;
  }

  clearObjectLayers() : OlComponent {

    this.getIndividualObjectLayer().getSource().clear();
    this.getBuildingObjectLayer().getSource().clear();
    this.getWiringObjectLayer().getSource().clear();

    return this;
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

    /**
     * Create map controls
     */

    this.fullScreenControl = new ol.control.FullScreen();
    this.scaleLineControl = new ol.control.ScaleLine(); //TODO choose unit

    /**
     * Create the map.
     */

    this.map = new Map({
      target: 'map',
      layers: [this.getOMS()],
      controls: ol.control.defaults().extend([
            this.scaleLineControl,
            this.fullScreenControl
        ]),
      view: new ol.View({
        center: ol.proj.fromLonLat([0,0]),
        zoom: 7,
        projection: ol.proj.get('EPSG:3857')
      })
    });

    let select_interaction = new ol.interaction.Select();

    this.map.addInteraction(select_interaction);

    /**
     * Elements that make up the popup.
     */
    let container = document.getElementById('ol-popup');
    let content = document.getElementById('popup-content');
    let closer = document.getElementById('popup-closer');


    /**
     * Create an overlay to anchor the popup to the map.
     */
    let overlay = new ol.Overlay({
      element: container,
      autoPan: true,
      positioning: 'bottom-center',
      stopEvent: false,
      offset: [0, -5]
    });

    this.map.addOverlay(overlay);

    /**
     * Add a click handler to hide the popup.
     * @return {boolean} Don't follow the href.
     */
    closer.onclick = function() {
      overlay.setPosition(undefined);
      closer.blur();
      return false;
    };

    /**
     * Add a click handler to the map to render the popup.
     */

    this.map.on('singleclick', (evt) => {

      let feature = this.map.forEachFeatureAtPixel(evt.pixel, (feat) => {
        return feat;
      });

      if (feature) {

        let properties = '';

        Object.keys(feature.getProperties()).filter(k => { return !(k == 'geometry' || k == 'class') }).forEach( p => {
          properties += `<p>${p}: <i>${feature.get(p)}</i></p>`
        });

        content.innerHTML = `<p><strong>${feature.get('class')}</strong></p> ${properties}`;

        overlay.setPosition(evt.coordinate);
      }
    });
  };

  public addRunway (feature: Feature, options? : {center?: boolean, zoom?: number}) : OlComponent {

    this.addFeature(feature, this.getRunwayLayer(), options);

    return this;
  }

  public addAirport (feature: Feature, options? :{center?: boolean, zoom?: number}) : OlComponent {

    this.addFeature(feature, this.getAirportLayer(), options);

    return this;
  };

  public addDirection(feature: Feature, options? :{center?: boolean, zoom?: number}) : OlComponent {

    this.addFeature(feature, this.getDirectionLayer(), options);

    return this;
  }

  public addThreshold(feature: Feature, options? : {center?: boolean, zoom?: number}) : OlComponent {

    this.addFeature(feature, this.getDisplacedThresholdLayer(), options);

    return this;
  }

  public addStopway(feature: Feature, options? : {center?: boolean, zoom?: number}) : OlComponent {

    this.addFeature(feature, this.getStopwayLayer(), options);

    return this;
  }

  public addClearway(feature: Feature, options? : {center?: boolean, zoom?: number}) : OlComponent {

    this.addFeature(feature, this.getClearwayLayer(), options);

    return this;
  }

  public addIndividualObject(feature: Feature, options?: { center?: boolean; zoom?: number }) : OlComponent {

    this.addFeature(feature, this.getIndividualObjectLayer(), options);

    return this;
  }

  public addBuildingObject(feature: Feature, options? : {center?: boolean, zoom?: number}) : OlComponent {

    this.addFeature(feature, this.getBuildingObjectLayer(), options);

    return this;
  }

  public addWiringObject(feature: Feature, options? : {center?: boolean, zoom?: number}) : OlComponent {

    this.addFeature(feature, this.getWiringObjectLayer(), options);

    return this;
  }

  public addObject(feature: Feature, options? : {center?: boolean, zoom?: number}) : OlComponent {

    switch (feature.get("class")){
      case "Building":
        this.addBuildingObject(feature, options);
        break;
      case "Individual Object":
        this.addIndividualObject(feature, options);
        break;
      case "Overhead Wire":
        this.addWiringObject(feature, options);
        break;
    }

    return this;
  }

  private addFeature(feature : Feature, layer : VectorLayer,  options? :{center?: boolean, zoom?: number}){

    feature.setGeometry(feature.getGeometry().transform('EPSG:4326', 'EPSG:3857'));

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
