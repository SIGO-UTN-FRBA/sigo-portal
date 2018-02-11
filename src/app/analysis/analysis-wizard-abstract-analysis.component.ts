import {AbstractAnalysisWizardComponent} from './analysis-wizard-abstract.component';
import {OlComponent} from '../olmap/ol.component';
import {ApiError} from '../main/apiError';
import Feature = ol.Feature;
import {RunwayDirection} from '../direction/runwayDirection';
import {Runway} from '../runway/runway';
import {AnalysisObstacle} from './analysisObstacle';
import {BsModalService} from 'ngx-bootstrap';
import {AnalysisService} from './analysis.service';
import {AnalysisWizardService} from './analysis-wizard.service';
import {ElevatedObjectService} from '../object/object.service';
import {RunwayService} from '../runway/runway.service';
import {AnalysisResultService} from './analysis-result.service';
import {DirectionService} from '../direction/direction.service';
import {AirportService} from '../airport/airport.service';
import {AnalysisExceptionSurfaceService} from '../exception/exception-surface.service';
import {AnalysisObstacleService} from './analysis-obstacle.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AnalysisObjectService} from './analysis-object.service';
import {AuthService} from '../auth/auth.service';
import {AnalysisSurfaceService} from './analysis-surface.service';
import {STATUS_INDICATOR} from '../commons/status-indicator';
import {RunwayApproachSection} from '../direction/runwayApproachSection';
import {RunwayTakeoffSection} from '../direction/runwayTakeoffSection';
import {AfterViewInit, ElementRef, OnInit, QueryList, ViewChildren} from '@angular/core';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {BlockTemplateComponent} from '../commons/block-template.component';

export abstract class AbstractAnalysisWizardAnalysisComponent
  extends AbstractAnalysisWizardComponent
  implements OnInit, AfterViewInit
{

  @BlockUI() blockUI: NgBlockUI;
  blockTemplate = BlockTemplateComponent;
  @ViewChildren('mapAnalysis') mapAnalysis: QueryList<ElementRef>;
  initObstaclesStatus:number;
  initSpatialStatus:number;
  onInitObstaclesError:ApiError;
  onInitSpatialError:ApiError;
  olMap: OlComponent;
  runwayFeatures: Feature[];
  exceptionFeatures: Feature[];
  objectFeatures: Feature[];
  airportFeature:Feature;
  runways:Runway[];
  directions: RunwayDirection[];
  selectedDirection: RunwayDirection;
  obstacles:AnalysisObstacle[];
  filteredObstacles:AnalysisObstacle[];
  centerCoordinates: ol.Coordinate;

  filterName: string;
  filterPenetration: boolean;
  filterDirection: number;
  filterRestriction: number;
  filterPending: boolean;

  constructor(
    wizardService: AnalysisWizardService,
    analysisService: AnalysisService,
    protected runwayService: RunwayService,
    protected directionService: DirectionService,
    protected surfacesService: AnalysisSurfaceService,
    protected airportService: AirportService,
    protected obstacleService: AnalysisObstacleService,
    protected resultService: AnalysisResultService,
    protected objectService: ElevatedObjectService,
    protected analysisObjectService: AnalysisObjectService,
    protected exceptionService: AnalysisExceptionSurfaceService,
    authService: AuthService,
    route: ActivatedRoute,
    router: Router
  ){
    super(analysisService, wizardService, authService, route, router);
  }

  ngOnInit(): void {
    this.blockUI.stop();
    this.analysisId = this.route.snapshot.params['analysisId'];

    this.onInitObstaclesError = null;
    this.onInitSpatialError = null;
    this.onSubmitError = null;

    this.initObstaclesStatus = null;
    this.initSpatialStatus = null;

    this.runwayFeatures = [];
    this.airportFeature = null;
    this.directions = [];
    this.objectFeatures = [];
    this.exceptionFeatures = [];

    this.resolveAnalysis()
      .then(() => this.validateCurrentStage())
      .then(() => this.resolveEdition())
      .catch(error => Promise.reject(this.onInitError = error))
      .then(() => this.initObstaclesStatus = STATUS_INDICATOR.LOADING)
      .then(() => this.resolveObstacles())
      .catch(error => {
        if(!this.onInitError){
          this.onInitObstaclesError = error;
          this.initObstaclesStatus = STATUS_INDICATOR.ERROR;
        }
        return Promise.reject(null);
      })
      .then(() => this.initSpatialStatus = STATUS_INDICATOR.LOADING)
      .then(() => this.resolveObstacleContext())
      .catch(error => {
        if(this.onInitObstaclesError == null && this.onInitError == null){
          this.onInitSpatialError = error;
          this.initSpatialStatus = STATUS_INDICATOR.ERROR;
        }
        return Promise.resolve();
      })
      .then(() => this.onClear());
  }

  ngAfterViewInit(): void {
    this.mapAnalysis.changes.subscribe(item => {

      if(!(this.olMap = item.first) || this.olMap.started)
        return;

      this.recenter()
        .locateAirportFeatures()
        .locateObjectFeatures()
        .locateExceptionFeatures()
        .locateRunwayFeatures();

      this.olMap.started = true; //TODO poque vuelve a entrar vairas veces, ej despues de apretar boton filter

    });
  }

  protected resolveObstacles() {
    return this.obstacleService.list(this.analysisId, false)
      .then(data => {
        this.obstacles = data.sort((a, b) =>
          (a.directionId && b.directionName) ? a.directionName.localeCompare(b.directionName) : -1
        );
        this.initObstaclesStatus = (data.length > 0) ? STATUS_INDICATOR.ACTIVE : STATUS_INDICATOR.EMPTY;

      });
  }

  protected resolveObstacleContext() {
    return this.analysisService.get(this.analysisId)
      .then(data => this.analysis = data)
      .then(()=> this.resolveEdition())
      .then(()=> this.runwayService.list(this.analysis.airportId))
      .then(data => this.runways = data)
      .then(() => this.resolveAirportFeature())
      .then(() => this.resolveRunwayFeatures())
      .then(() => this.resolveExceptionFeatures())
      .then(() => this.resolveObjectFeatures())
      .then(() => this.resolveRunwaysDirections())
      .then(() => this.directions = this.runways.map(r => r.directions).reduce((a, b) => a.concat(b), []))
      .then(() => this.initSpatialStatus = STATUS_INDICATOR.ACTIVE);
  }

  protected resolveAirportFeature(): Promise<any>{
    return this.airportService
      .getFeature(this.analysis.airportId)
      .then(data => this.airportFeature = data)
      .then(()=> this.centerCoordinates = ol.extent.getCenter(this.airportFeature.getGeometry().transform('EPSG:4326', 'EPSG:3857').getExtent()))
      .catch(error => Promise.reject(error));
  }

  protected resolveRunwayFeatures(): Promise<any>{
    return Promise.all(
      this.runways.map(r =>
        this.runwayService.getFeature(r.airportId, r.id)
          .then(data => this.runwayFeatures.push(data))
          .catch(error => Promise.reject(error))
      )
    );
  }

  protected resolveRunwaysDirections(): Promise<any>{
    return Promise.all(
      this.runways.map( r =>
        this.directionService.list(r.airportId,r.id)
          .then( data => {
            r.directions = data;
            r.directions.forEach(d => {
              d.runway = r;
              d.approachSection = new RunwayApproachSection();
              d.takeoffSection = new RunwayTakeoffSection();
            });
          })
          .catch(error => Promise.reject(error))
      )
    )
  }

  protected resolveObjectFeatures(): Promise<any> {

    return this.analysisObjectService
      .list(this.analysisId)
      .then( data =>
        Promise.all(
          data.map(o => this.objectService
            .getFeature(o.objectId, o.objectTypeId)
            .then(data => this.objectFeatures.push(data))
            .catch(error => Promise.reject(error))
          )
        )
      );
  }

  protected resolveExceptionFeatures(): Promise<any> {

    return this.exceptionService
      .list(this.analysisId)
      .then(data =>
        data.map( e =>
          this.exceptionService
            .getFeature(this.analysisId, e.id)
            .then( data => this.exceptionFeatures.push(data))
            .catch(error => Promise.reject(error))
        )
      )
      .catch(error => Promise.reject(error))
  }

  loadDirectionFeatures(direction: RunwayDirection) {

    this.selectedDirection = direction;

    this.clearMapLayers();

    Promise.all([
      this.locateSurfaceFeatures(direction),
      this.locateDirectionFeature(direction),
      this.locateClearwayFeature(direction),
      this.locateStopwayFeature(direction),
      this.locateThresholdFeature(direction)
    ]).then(()=> Promise.resolve(true));
  }

  protected recenter(): any {
    this.olMap.setCenter(this.centerCoordinates);
    this.olMap.setZoom(11);

    return this;
  }

  protected locateAirportFeatures(): any {
    this.olMap.addAirport(this.airportFeature);
    return this;
  }

  protected locateRunwayFeatures(): any {
    this.runwayFeatures.forEach( f => this.olMap.addRunway(f));
    return this;
  }

  protected locateDirectionFeature(direction: RunwayDirection): Promise<any> {
    /*
        if(direction.feature) {
          return Promise.resolve(this.olMap.addDirection(direction.feature));
        }
    */
    return this.directionService
      .getFeature(this.analysis.airportId, direction.runwayId, direction.id)
      .then(data => {
        direction.feature = data;
        this.olMap.addDirection(data);
      })
      .catch(error => Promise.reject(error));
  }

  protected locateClearwayFeature(direction: RunwayDirection) {
    /*
        if(direction.takeoffSection.clearwayFeature){
          return Promise.resolve(this.olMap.addClearway(direction.takeoffSection.clearwayFeature));
        }
    */
    return this.directionService
      .getClearwayFeature(this.analysis.airportId, direction.runwayId, direction.id)
      .then(data => {
        direction.takeoffSection.clearwayFeature = data;
        this.olMap.addClearway(data);
      })
      .catch(error => Promise.reject(error))

  }

  protected locateStopwayFeature(direction: RunwayDirection) {
    /*
        if(direction.takeoffSection.stopwayFeature){
          return Promise.resolve(this.olMap.addStopway(direction.takeoffSection.stopwayFeature));
        }
    */
    return this.directionService
      .getStopwayFeature(this.analysis.airportId, direction.runwayId, direction.id)
      .then(data => {
        direction.takeoffSection.stopwayFeature = data;
        this.olMap.addStopway(data);
      })
      .catch(error => Promise.reject(error));
  }

  protected locateThresholdFeature(direction: RunwayDirection) {
    /*
        if(direction.approachSection.thresholdFeature){
          return Promise.resolve(this.olMap.addThreshold(direction.approachSection.thresholdFeature));
        }
    */
    return this.directionService
      .getDisplacedThresholdFeature(this.analysis.airportId, direction.runwayId, direction.id)
      .then(data => {
        direction.approachSection.thresholdFeature = data;
        this.olMap.addThreshold(data);
      })
      .catch(error => Promise.reject(error))

  }

  protected locateExceptionFeatures(): any{
    this.exceptionFeatures.forEach(f => this.olMap.addException(f));
    return this;
  }

  protected locateObjectFeatures(): any{
    this.objectFeatures.forEach(f => this.olMap.addObject(f));
    return this;
  }

  protected locateSurfaceFeatures(direction: RunwayDirection): Promise<any>{

    return this.surfacesService
      .get(this.analysisId, direction.id)
      .then(data => data.forEach(f => this.olMap.addSurface(f)))
      .catch(error => Promise.reject(error));
  }

  protected clearMapLayers() : any {
    this.olMap
      .clearSurfaceLayers()
      .clearDirectionLayer()
      .clearDisplacedThresholdLayer()
      .clearStopwayLayer()
      .clearClearwayLayer();

    return this;
  }

  onFilter(){
    this.filteredObstacles = Array.from(this.obstacles).filter( o =>
      (this.filterName == null || this.filterName.length == 0 || o.objectName.toLocaleUpperCase().includes(this.filterName.toLocaleUpperCase()))
      && (this.filterRestriction == null || o.restrictionTypeId == this.filterRestriction)
      && (this.filterDirection == null || o.directionId == this.filterDirection)
      && (this.filterPenetration == null || (o.penetration > 0) == this.filterPenetration)
      && ((this.filterPending == null) || (o.allowed == null) == this.filterPending)
    );
  }

  locateObjectOnMap(analysisObstacle: AnalysisObstacle){

    let layer: string;

    switch (analysisObstacle.objectType){
      case 0:
        layer = 'BuildingObject';
        break;
      case 1:
        layer = 'IndividualObject';
        break;
      case 2:
        layer = 'WiringObject';
        break;
      case 3:
        layer = 'Terrain';
        break;
    }

    this.olMap.selectFeature(analysisObstacle.objectId, layer, {center:true, zoom: 15, info: true});
  }

  onClear(){
    this.filterName = null;
    this.filterPenetration = null;
    this.filterDirection = null;
    this.filterRestriction = null;
    this.filterPending = null;
    this.filteredObstacles = Array.from(this.obstacles);
  }
}
