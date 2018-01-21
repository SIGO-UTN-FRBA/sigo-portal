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
  @Input() fullScreen:boolean;
  @Input() scale:boolean;
  @Input() layers: string[];
  @Input() rotate: boolean;
  @Input() layerSwitcher: boolean;
  @Input() map : Map;
  @Output() mapChange:EventEmitter<Map> = new EventEmitter<Map>();
  olLayers : OlLayers;
  scaleLineControl;
  fullScreenControl;

  constructor() {
    this.olLayers = {} as OlLayers;
    this.fullScreen=false;
    this.scale=false;
    this.layers=[];
    this.rotate=false;
  }

  private createDefaultVectorSource() {
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
    if(this.olLayers.airport != null)
      return this.olLayers.airport;

    let airportLayer = new VectorLayer({
      source: this.createDefaultVectorSource(),
      style: new Style({
        image: new Circle({
          radius: 7,
          fill: new ol.style.Fill({color: 'lightgreen'}),
          stroke: new ol.style.Stroke({ color: 'green', width:2})
        })
      })
    });

    airportLayer.setProperties({'title':'Airport'});

    this.olLayers.airport = airportLayer;

    return airportLayer;
  }

  clearRunwayLayer() : OlComponent {
    this.getRunwayLayer().getSource().clear();

    return this;
  }

  getRunwayLayer() : VectorLayer {

    if(this.olLayers.runway != null)
      return this.olLayers.runway;

    let runwayLayer = new VectorLayer({
      source: this.createDefaultVectorSource(),
      style: new Style({
        stroke: new ol.style.Stroke({color: 'darkgray', width:1}),
        fill: new ol.style.Fill({color: 'black'})
      })
    });

    runwayLayer.setProperties({'title':'Runway'});

    this.olLayers.runway = runwayLayer;

    return runwayLayer;
  }

  clearDirectionLayer() : OlComponent {
    this.getDirectionLayer().getSource().clear();

    return this;
  }

  getDirectionLayer() : VectorLayer {

    if(this.olLayers.direction != null)
      return this.olLayers.direction;

    let directionLayer = new VectorLayer({
      source: this.createDefaultVectorSource(),
      style: new Style({
        image: new Circle({
          radius: 3,
          fill: new ol.style.Fill({color: 'red'}),
          stroke: new ol.style.Stroke({ color: 'gray', width:2})
        })
      })
    });

    directionLayer.setProperties({'title':'Direction'});

    this.olLayers.direction = directionLayer;

    return directionLayer;
  }

  clearDisplacedThresholdLayer() : OlComponent {
    this.getDisplacedThresholdLayer().getSource().clear();

    return this;
  }

  getDisplacedThresholdLayer() : VectorLayer {
    if(this.olLayers.threshold != null)
      return this.olLayers.threshold;

    let thresholdLayer = new VectorLayer({
      source: this.createDefaultVectorSource(),
      style: new Style({
        stroke: new ol.style.Stroke({color: 'darkred', width:1}),
        fill: new ol.style.Fill({color: 'rgba(255, 0, 0, 0.6)' })
      }),
      map: this.map
    });

    thresholdLayer.setProperties({'title':'Displaced threshold'});

    this.olLayers.threshold = thresholdLayer;

    return thresholdLayer;
  }

  clearStopwayLayer() : OlComponent {
    this.getStopwayLayer().getSource().clear();

    return this;
  }

  getStopwayLayer() : VectorLayer {
    if(this.olLayers.stopway != null)
      return this.olLayers.stopway;

    let layer = new VectorLayer({
      source: this.createDefaultVectorSource(),
      style: new Style({
        stroke: new ol.style.Stroke({color: 'darkblue', width:1}),
        fill: new ol.style.Fill({color: 'rgba(0, 0, 255, 0.75)' })
      })
    });

    layer.setProperties({'title':'Stop-way'});

    this.olLayers.stopway = layer;

    return layer;
  }

  clearClearwayLayer() : OlComponent {
    this.getClearwayLayer().getSource().clear();

    return this;
  }

  getClearwayLayer() : VectorLayer {
    if(this.olLayers.clearway != null)
      return this.olLayers.clearway;

    let layer = new VectorLayer({
      source: this.createDefaultVectorSource(),
      style: new Style({
        stroke: new ol.style.Stroke({color: 'darkgreen', width:1}),
        fill: new ol.style.Fill({color: 'rgba(0, 255, 0, 0.6)' })
      })
    });

    layer.setProperties({'title':'Clear-way'});

    this.olLayers.clearway = layer;

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
    if(this.olLayers.individual != null)
      return this.olLayers.individual;

    let layer = new VectorLayer({
      source: this.createDefaultVectorSource(),
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

    layer.setProperties({'title':'Individual object'});

    this.olLayers.individual = layer;

    return layer;
  }

  clearBuildingObjectLayer() : OlComponent{
    this.getBuildingObjectLayer().getSource().clear();

    return this;
  }

  getBuildingObjectLayer() : VectorLayer {
    if(this.olLayers.building != null)
      return this.olLayers.building;

    let layer = new VectorLayer({
      source: this.createDefaultVectorSource(),
      style: new Style({
        stroke: new ol.style.Stroke({color: 'darkgray', width:1}),
        fill: new ol.style.Fill({color: 'rgba(0, 0, 0, 0.85)' })
      }),
    });

    layer.setProperties({'title':'Building'});

    this.olLayers.building = layer;

    return layer;
  }

  clearWiringObjectLayer() : OlComponent {
    this.getWiringObjectLayer().getSource().clear();

    return this;
  }

  getWiringObjectLayer() : VectorLayer {
    if(this.olLayers.wiring != null)
      return this.olLayers.wiring;

    let layer = new VectorLayer({
      source: this.createDefaultVectorSource(),
      style: new Style({
        stroke: new ol.style.Stroke({color: 'darkgray', width:1})
      }),
    });

    layer.setProperties({'title':'Wire'});

    this.olLayers.wiring = layer;

    return layer;
  }

  clearSurfaceLayers() : OlComponent{
    this.getICAOAnnex14SurfaceInnerHorizontalLayer().getSource().clear();
    this.getICAOAnnex14SurfaceStripLayer().getSource().clear();
    this.getICAOAnnex14SurfaceConicalLayer().getSource().clear();
    this.getICAOAnnex14SurfaceTransitionalLayer().getSource().clear();
    this.getICAOAnnex14SurfaceApproachFirstSectionLayer().getSource().clear();
    this.getICAOAnnex14SurfaceApproachSecondSectionLayer().getSource().clear();
    this.getICAOAnnex14SurfaceTakeoffClimbLayer().getSource().clear();

    return this;
  }

  getICAOAnnex14SurfaceStripLayer() : VectorLayer {

    if(this.olLayers.hasOwnProperty('surfaceStrip'))
      return this.olLayers['surfaceStrip'];

    let layer = new VectorLayer({
      source: this.createDefaultVectorSource(),
      style: new Style({
        stroke: new ol.style.Stroke({color: 'rgb(214, 214, 194)', width:2}),
        fill: new ol.style.Fill({color: 'rgba(214, 214, 194, 0.5)' })
      })
    });

    layer.setProperties({'title':'Strip'});

    this.olLayers['surfaceStrip'] = layer;

    return layer;
  }

  getICAOAnnex14SurfaceInnerHorizontalLayer() : VectorLayer {

    if(this.olLayers.hasOwnProperty('surfaceInnerHorizontal'))
      return this.olLayers['surfaceInnerHorizontal'];

    let layer = new VectorLayer({
      source: this.createDefaultVectorSource(),
      style: new Style({
        stroke: new ol.style.Stroke({color: 'rgb(61, 153, 255)', width:2}),
        fill: new ol.style.Fill({color: 'rgba(61, 153, 255, 0.5)' })
      })
    });

    layer.setProperties({'title':'Inner Horizontal'});

    this.olLayers['surfaceInnerHorizontal'] = layer;

    return layer;
  }

  getICAOAnnex14SurfaceConicalLayer() : VectorLayer {

    if(this.olLayers.hasOwnProperty('surfaceConical'))
      return this.olLayers['surfaceConical'];

    let layer = new VectorLayer({
      source: this.createDefaultVectorSource(),
      style: new Style({
        stroke: new ol.style.Stroke({color: 'rgb(0, 77, 230)', width:2}),
        fill: new ol.style.Fill({color: 'rgba(0, 77, 230, 0.5)' })
      })
    });

    layer.setProperties({'title':'Conical'});

    this.olLayers['surfaceConical'] = layer;

    return layer;
  }

  getICAOAnnex14SurfaceApproachFirstSectionLayer():VectorLayer {

    if(this.olLayers.hasOwnProperty('surfaceApproachFirstSection'))
      return this.olLayers['surfaceApproachFirstSection'];

    let layer = new VectorLayer({
      source: this.createDefaultVectorSource(),
      style: new Style({
        stroke: new ol.style.Stroke({color: 'rgb(255, 77, 77)', width:2}),
        fill: new ol.style.Fill({color: 'rgba(255, 77, 77, 0.5)' })
      })
    });

    layer.setProperties({'title':'Approach First Section'});

    this.olLayers['surfaceApproachFirstSection'] = layer;

    return layer;
  }

  getICAOAnnex14SurfaceApproachSecondSectionLayer():VectorLayer {

    if(this.olLayers.hasOwnProperty('surfaceApproachSecondSection'))
    return this.olLayers['surfaceApproachSecondSection'];

    let layer = new VectorLayer({
      source: this.createDefaultVectorSource(),
      style: new Style({
        stroke: new ol.style.Stroke({color: 'rgb(255, 102, 102)', width:2}),
        fill: new ol.style.Fill({color: 'rgba(255, 102, 102, 0.5)' })
      })
    });

    layer.setProperties({'title':'Approach Second Section'});

    this.olLayers['surfaceApproachSecondSection'] = layer;

    return layer;
  }

  getICAOAnnex14SurfaceTransitionalLayer():VectorLayer {

    if(this.olLayers.hasOwnProperty('surfaceTransitional'))
      return this.olLayers['surfaceTransitional'];

    let layer = new VectorLayer({
      source: this.createDefaultVectorSource(),
      style: new Style({
        stroke: new ol.style.Stroke({color: 'rgb(204, 0, 204)', width:2}),
        fill: new ol.style.Fill({color: 'rgba(204, 0, 204, 0.5)' })
      })
    });

    layer.setProperties({'title':'Transitional'});

    this.olLayers['surfaceTransitional'] = layer;

    return layer;
  }

  getICAOAnnex14SurfaceTakeoffClimbLayer():VectorLayer {

    if(this.olLayers.hasOwnProperty('surfaceTakeoffClimb'))
      return this.olLayers['surfaceTakeoffClimb'];

    let layer = new VectorLayer({
      source: this.createDefaultVectorSource(),
      style: new Style({
        stroke: new ol.style.Stroke({color: 'rgb(255, 204, 0)', width:2}),
        fill: new ol.style.Fill({color: 'rgba(255, 204, 0, 0.5)' })
      })
    });

    layer.setProperties({'title':'Takeoff Climb'});

    this.olLayers['surfaceTakeoffClimb'] = layer;

    return layer;
  }

  clearExceptionLayer(): OlComponent{
    this.getExceptionLayer().getSource().clear();
    return this;
  }

  getExceptionLayer(): VectorLayer{
    if(this.olLayers.hasOwnProperty('exception'))
      return this.olLayers['exception'];

    let layer = new VectorLayer({
      source: this.createDefaultVectorSource(),
      style: new Style({
        stroke: new ol.style.Stroke({color: 'rgb(139,0,0)', width:1}),
        fill: new ol.style.Fill({color: 'rgba(139,0,0, 0.7)' })
      })
    });

    layer.setProperties({'title':'Exception'});

    this.olLayers['exception'] = layer;

    return layer;
  }

  clearTerrainLayer(): OlComponent{
    this.getTerrainLayer().getSource().clear();
    return this;
  }

  getTerrainLayer(): VectorLayer{
    if(this.olLayers.hasOwnProperty('terrain'))
      return this.olLayers['terrain'];

    let layer = new VectorLayer({

      visible: true,
      source: this.createDefaultVectorSource(),
      style: (feature, resolution) => {

        let color: string;
        let height : number = feature.getProperties().height_amls;

        if(height < -100)
          color = '#191970';
        else if(height < -50)
          color = '#0000CD';
        else if(height < -10)
          color = '#1E90FF';
        else if(height > 4000)
          color = '#C71585';
        else if(height > 3500)
          color = '#FF1493';
        else if(height > 3000)
          color = '#FF69B4';
        else if(height > 2500)
          color = '#8B4513';
        else if(height > 2000)
          color = '#A0522D';
        else if(height > 1500)
          color = '#D2691E';
        else if(height > 1200)
          color = '#CD853F';
        else if(height > 1000)
          color = '#F4A460';
        else if(height > 800)
          color = '#DEB887';
        else if(height > 500)
          color = '#BDB76B';
        else if(height > 400)
          color = '#BDB76B';
        else if(height > 300)
          color = '#6B8E23';
        else if(height > 200)
          color = '#ADFF2F';
        else if(height > 100)
          color = '#7FFF00';
        else if(height > 75)
          color = '#32CD32';
        else if(height > 50)
          color = '#228B22';
        else if(height > 25)
          color = '#008000';
        else if(height > 0) {
          color = '#006400';
        }

        return new Style({
          stroke: new ol.style.Stroke({color: color, width:1})
        });
      }
    });

    layer.setProperties({'title':'Terrain Level Curves'});

    this.olLayers['terrain'] = layer;

    return layer;
  }

  getStamenTonerBaseLayer(){

    let OSM = new Tile({
      source: new ol.source.Stamen({
        layer: 'toner'
      })
    });

    OSM.set('name', 'Openstreetmap');
    OSM.set('title', 'Stamen toner');
    OSM.set('type', 'base');

    return OSM;
  }

  createMap = () => {

    this.map = new Map({
      target: 'map',
      layers: this.initializeLayers(),
      controls: this.initializeControls(),
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

        Object.keys(feature.getProperties()).filter(k => { return !(k == 'geometry' || k == 'class'); }).forEach( p => {
          properties += `<p>${p}: <i>${feature.get(p)}</i></p>`;
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

  public addTerrainLevelCurve(feature: Feature, options? : {center?: boolean, zoom?: number}) : OlComponent {

    this.addFeature(feature, this.getTerrainLayer(), options);

    return this;
  }

  public addException(feature: Feature, options? : {center?: boolean, zoom?: number}) : OlComponent {

    this.addFeature(feature, this.getExceptionLayer(), options);

    return this;
  }

  public addObject(feature: Feature, options? : {center?: boolean, zoom?: number}) : OlComponent {

    switch (feature.get('class')){
      case 'Building':
        this.addBuildingObject(feature, options);
        break;
      case 'Individual Object':
        this.addIndividualObject(feature, options);
        break;
      case 'Overhead Wire':
        this.addWiringObject(feature, options);
        break;
      case 'Terrain Level Curve':
        this.addTerrainLevelCurve(feature, options);
        break;
    }

    return this;
  }

  public addSurface(feature: Feature) : OlComponent {

    this[`add${feature.get('class')}`](feature);

    return this;
  }

  private addICAOAnnex14SurfaceStrip(feature:Feature) {
    this.addFeature(feature, this.getICAOAnnex14SurfaceStripLayer());
  }

  private addICAOAnnex14SurfaceInnerHorizontal(feature:Feature) {
    this.addFeature(feature, this.getICAOAnnex14SurfaceInnerHorizontalLayer());
  }

  private addICAOAnnex14SurfaceConical(feature:Feature) {
    this.addFeature(feature, this.getICAOAnnex14SurfaceConicalLayer());
  }

  private addICAOAnnex14SurfaceApproachFirstSection(feature:Feature) {
    this.addFeature(feature, this.getICAOAnnex14SurfaceApproachFirstSectionLayer());
  }

  private addICAOAnnex14SurfaceApproachSecondSection(feature:Feature) {
    this.addFeature(feature, this.getICAOAnnex14SurfaceApproachSecondSectionLayer());
  }

  private addICAOAnnex14SurfaceTransitional(feature:Feature) {
    this.addFeature(feature, this.getICAOAnnex14SurfaceTransitionalLayer());
  }

  private addICAOAnnex14SurfaceTakeoffClimb(feature:Feature) {
    this.addFeature(feature, this.getICAOAnnex14SurfaceTakeoffClimbLayer());
  }

  private addFeature(feature : Feature, layer : VectorLayer,  options? :{center?: boolean, zoom?: number}){

    feature.setGeometry(feature.getGeometry().transform('EPSG:4326', 'EPSG:3857'));

    layer.getSource().addFeature(feature);

    if(options != null && options.center)
      this.setCenter(ol.extent.getCenter(feature.getGeometry().getExtent()));

    if(options != null && options.zoom)
      this.setZoom(options.zoom);
  }

  toggleLayer = (layer, evt) => {
    evt.target.blur();
    if (layer.getVisible()) {
      layer.setVisible(false);

    } else {
      layer.setVisible(true);
    }

  };

  setCenter(coordinate:ol.Coordinate):OlComponent{

    //'EPSG:3857'

    this.map.getView().setCenter(coordinate);

    return this;
  }

  setZoom(level:number):OlComponent{

    this.map.getView().setZoom(level);

    return this;
  }

  ngOnInit() {
    this.createMap();
  }

  private initializeLayers() :(ol.layer.Base[] | ol.Collection<ol.layer.Base>){

    let layerGroups : Array<ol.layer.Group>= [];

    this.setupBaseLayerGroup(layerGroups);
    this.setupTerrainLayerGroup(layerGroups);
    this.setupAirportLayerGroup(layerGroups);
    this.setupSurfaceLayerGroup(layerGroups);
    this.setupExceptionLayerGroup(layerGroups);
    this.setupObjectLayerGroup(layerGroups);

    return layerGroups;
  }

  private setupBaseLayerGroup(layerGroups: Array<ol.layer.Group>) {
    let baseLayersGroup = new ol.layer.Group({
      layers: [this.getStamenTonerBaseLayer()]
    });
    baseLayersGroup.set('title', 'Base maps');

    layerGroups.push(baseLayersGroup);
  }

  private setupTerrainLayerGroup(layerGroups: Array<ol.layer.Group>){
    if(this.layers.includes('terrain')){
      let layers = new ol.Collection<ol.layer.Base>();
      layers.push(this.getTerrainLayer());
      let group = new ol.layer.Group();
      group.setLayers(layers);
      group.set('title','Terrain');
      layerGroups.push(group);
    }
  }

  private setupAirportLayerGroup(layerGroups: Array<ol.layer.Group>) {
    let layers = new ol.Collection<ol.layer.Base>();

    if(this.layers.includes('airport'))
      layers.push(this.getAirportLayer());

    if(this.layers.includes('runway'))
      layers.push(this.getRunwayLayer());

    if(this.layers.includes('direction'))
      layers.push(this.getDirectionLayer());

    if(this.layers.includes('threshold'))
      layers.push(this.getDisplacedThresholdLayer());

    if(this.layers.includes('clearway'))
      layers.push(this.getClearwayLayer());

    if(this.layers.includes('stopway'))
      layers.push(this.getStopwayLayer());

    if(layers.getArray().length > 0){
      let group = new ol.layer.Group();
      group.setLayers(layers);
      group.set('title','Airport');
      layerGroups.push(group);
    }
  }

  private setupExceptionLayerGroup(layerGroups: Array<ol.layer.Group>) {
    if(this.layers.includes('exception')){
      let layers = new ol.Collection<ol.layer.Base>();
      layers.push(this.getExceptionLayer());

      let group = new ol.layer.Group();
      group.setLayers(layers);
      group.set('title','Exceptions');

      layerGroups.push(group);
    }
  }

  private setupSurfaceLayerGroup(layerGroups: Array<ol.layer.Group>) {

    if(this.layers.includes('icaoannex14surfaces')){

      let layers = new ol.Collection<ol.layer.Base>();

      layers.push(this.getICAOAnnex14SurfaceInnerHorizontalLayer());
      layers.push(this.getICAOAnnex14SurfaceStripLayer());
      layers.push(this.getICAOAnnex14SurfaceConicalLayer());
      layers.push(this.getICAOAnnex14SurfaceApproachFirstSectionLayer());
      layers.push(this.getICAOAnnex14SurfaceApproachSecondSectionLayer());
      layers.push(this.getICAOAnnex14SurfaceTransitionalLayer());
      layers.push(this.getICAOAnnex14SurfaceTakeoffClimbLayer());

      let group = new ol.layer.Group();
      group.setLayers(layers);
      group.set('title','OLS');

      layerGroups.push(group);
    }
  }

  private setupObjectLayerGroup(layerGroups: Array<ol.layer.Group>) {
    let layers = new ol.Collection<ol.layer.Base>();

    let all :boolean = this.layers.includes('objects');

    if(all || this.layers.includes('individual'))
      layers.push(this.getIndividualObjectLayer());

    if(all || this.layers.includes('building'))
      layers.push(this.getBuildingObjectLayer());

    if(all || this.layers.includes('wire'))
      layers.push(this.getWiringObjectLayer());

    if(layers.getArray().length > 0){
      let group = new ol.layer.Group();
      group.setLayers(layers);
      group.set('title','Object');
      layerGroups.push(group);
    }
  }

  private initializeControls() : (ol.Collection<ol.control.Control> | ol.control.Control[]){

    let controls = [];

    if(this.fullScreen){
      this.fullScreenControl = new ol.control.FullScreen();
      controls.push(this.fullScreenControl);
    }

    if(this.scale){
      this.scaleLineControl = new ol.control.ScaleLine(); //TODO choose unit
      controls.push(this.scaleLineControl);
    }

    if(this.rotate){
      controls.push(new ol.control.Rotate());
    }

    /*
    if(this.layerSwitcher){
      controls.push(new ol.control['LayerSwitcher']());
    }*/

    return ol.control.defaults().extend(controls);
  }
}

interface OlLayers {
  airport: VectorLayer;
  runway: VectorLayer;
  direction: VectorLayer;
  threshold: VectorLayer;
  individual: VectorLayer;
  building: VectorLayer;
  wiring: VectorLayer;
  stopway:VectorLayer;
  clearway: VectorLayer;
}
