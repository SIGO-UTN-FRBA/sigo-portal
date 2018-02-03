import {AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren} from '@angular/core';
import {BlockTemplateComponent} from "../commons/block-template.component";
import {BlockUI, NgBlockUI} from "ng-block-ui";
import {AppError} from "../main/ierror";
import {ApiError} from "../main/apiError";
import {ActivatedRoute, Router} from "@angular/router";
import {AnalysisWizardService} from "./analysis-wizard.service";
import {STATUS_INDICATOR} from "../commons/status-indicator";
import {OlComponent} from "../olmap/ol.component";
import {DirectionService} from "../direction/direction.service";
import {RunwayService} from "../runway/runway.service";
import {AnalysisService} from "./analysis.service";
import {Runway} from "../runway/runway";
import {Analysis} from "./analysis";
import {RunwayDirection} from "../direction/runwayDirection";
import {AnalysisSurfaceService} from "./analysis-surface.service";
import {AirportService} from "../airport/airport.service";
import Feature = ol.Feature;
import {AnalysisObstacleService} from "./analysis-obstacle.service";
import {AnalysisObstacle} from "./analysisObstacle";
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {AnalysisModalAnalysisComponent} from './analysis-modal-analysis.component';
import {AnalysisResultService} from './analysis-result.service';
import {AnalysisResult} from './analysisResult';
import {UiError} from '../main/uiError';
import {ElevatedObjectService} from '../object/object.service';
import {AnalysisExceptionSurfaceService} from '../exception/exception-surface.service';
import {AnalysisObjectService} from './analysis-object.service';
import {RunwayApproachSection} from '../direction/runwayApproachSection';
import {RunwayTakeoffSection} from '../direction/runwayTakeoffSection';

@Component({
  template:`
    <h1>
      <ng-container i18n="@@analysis.wizard.object.title">Analysis: Analyze obstacles</ng-container>
      <small class="pull-right"><ng-container i18n="@@wizard.commons.stage">Stage</ng-container> 3/4</small>
    </h1>
    <p i18n="@@wizard.object.main_description">
      This section allows users to analyze the obstacles detected as a result of the application of the regulation.
    </p>

    <hr/>

    <div *ngIf="onSubmitError">
      <app-error-indicator [errors]="[onSubmitError]"></app-error-indicator>
    </div>

    <block-ui [template]="blockTemplate" [delayStop]="500">

      <div class="panel panel-default">
        <div class="panel-heading">
          <div class="row">
            <h3 class="panel-title panel-title-with-buttons col-md-6"
                i18n="@@analysis.wizard.analysis.section.obstacles.title">
              Obstacles
            </h3>
          </div>
        </div>
        <div [ngSwitch]="initObstaclesStatus" class="panel-body">
          <div *ngSwitchCase="indicator.LOADING">
            <app-loading-indicator></app-loading-indicator>
          </div>
          <div *ngSwitchCase="indicator.EMPTY">
            <app-empty-indicator type="relation" entity="obstacles"></app-empty-indicator>
          </div>
          <div *ngSwitchCase="indicator.ERROR">
            <app-error-indicator [errors]="[onInitObstaclesError]"></app-error-indicator>
          </div>
          <div *ngSwitchCase="indicator.EMPTY">
            <app-empty-indicator entity="obstacles" type="detected"></app-empty-indicator>
          </div>
          <div *ngSwitchCase="indicator.ACTIVE" class="table-responsive">

            <div class="well well-sm">
              <form class="form-inline">
                <div class="form-group">
                  <label for="inputName" i18n="@@analysis.wizard.inform.filter.name">Object</label>
                  <input type="text"
                         name="inputName"
                         [(ngModel)]="filterName"
                         class="form-control" 
                         placeholder="Type a name..">
                </div>
                <div class="form-group">
                  <label for="inputPenetration" i18n="@@analysis.wizard.inform.filter.penetration">Penetration</label>
                  <select name="inputPenetration"
                          [(ngModel)]="filterPenetration"
                          class="form-control">
                    <option [ngValue]="null">All</option>
                    <option [ngValue]="true">Yes</option>
                    <option [ngValue]="false">No</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="inputDirection" i18n="@@analysis.wizard.inform.filter.directions">Directions</label>
                  <select name="inputDirection"
                          [(ngModel)]="filterDirection"
                          class="form-control">
                    <option [ngValue]="null">All</option>
                    <option *ngFor="let direction of directions" [ngValue]="direction.id">{{direction.name}}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="inputRestriction" i18n="@@analysis.wizard.inform.filter.restriction">Restriction</label>
                  <select name="inputRestriction"
                          [(ngModel)]="filterRestriction"
                          class="form-control">
                    <option [ngValue]="null">All</option>
                    <option [ngValue]="1">Exception</option>
                    <option [ngValue]="0">OLS</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="inputPending" i18n="@@analysis.wizard.inform.filter.pending">Pending</label>
                  <select name="inputPending"
                          [(ngModel)]="filterPending"
                          class="form-control">
                    <option [ngValue]="null">All</option>
                    <option [ngValue]="true">Yes</option>
                    <option [ngValue]="false">No</option>
                  </select>
                </div>
                <button type="button" 
                        class="btn btn-primary" 
                        (click)="onFilter()"
                        i18n="@@commons.button.filter"
                >
                  Filter
                </button>
                <button type="button" 
                        class="btn btn-default"
                        (click)="onClear()"
                        i18n="@@commons.button.clear"
                >
                  Clear
                </button>
              </form>
            </div>
            
            <br>
            <div style="max-height: 45em; overflow: auto;">
              <table class="table table-hover">
                <tr>
                  <th>#</th>
                  <th i18n="@@analysis.wizard.analysis.section.obstacles.name">Name</th>
                  <th i18n="@@analysis.wizard.analysis.section.obstacles.objectHeight">Object Height [m]</th>
                  <th i18n="@@analysis.wizard.analysis.section.obstacles.restrictionHeight">Restriction Height [m]</th>
                  <th i18n="@@analysis.wizard.analysis.section.obstacles.penetration">Penetration [m]</th>
                  <th i18n="@@analysis.wizard.analysis.section.obstacles.direction">Direction</th>
                  <th i18n="@@analysis.wizard.analysis.section.obstacles.surface">Restriction</th>
                  <th i18n="@@analysis.wizard.analysis.section.obstacles.result">Result</th>
                  <th></th>
                </tr>
                <tbody>
                <tr *ngFor="let obstacle of filteredObstacles; index as i;">
                  <td>
                    <a (click)="locateObjectOnMap(obstacle)" style="cursor: pointer">
                      <strong>{{i + 1}}</strong>
                    </a>
                  </td>
                  <td>
                    <a [routerLink]="['/objects', obstacle.objectType, obstacle.objectId]">
                      {{obstacle.objectName}}
                    </a>
                  </td>
                  <td>{{obstacle.objectHeight | number}}</td>
                  <td>{{obstacle.restrictionHeight | number}}</td>
                  <td [ngClass]="{'danger': obstacle.penetration > 0, 'success': obstacle.penetration < 0}">
                    {{obstacle.penetration | number}}
                  </td>
                  <td>{{obstacle.directionId ? obstacle.directionName : "-" }}</td>
                  <td>[{{obstacle.restrictionTypeId == 1 ? "Exception" : "OLS"}}] {{obstacle.restrictionName}}</td>
                  <td [ngClass]="{'warning': obstacle.resultSummary != undefined && !obstacle.resultSummary.startsWith(passiveReason)}">
                    {{obstacle.resultSummary}}
                  </td>
                  <td>
                    <button type="button" class="btn btn-default btn-sm" (click)="editResult(obstacle)">
                      <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                    </button>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="panel panel-default">
        <div class="panel-heading">
          <div class="row">
            <h3 class="panel-title panel-title-with-buttons col-md-6"
                i18n="@@analysis.wizard.analysis.section.spatial.title">
              Spatial
            </h3>
            <div class="clearfix"></div>
          </div>
        </div>
        <div [ngSwitch]="initSpatialStatus" class="panel-body">
          <div *ngSwitchCase="indicator.LOADING">
            <app-loading-indicator></app-loading-indicator>
          </div>
          <div *ngSwitchCase="indicator.ERROR">
            <app-error-indicator [errors]="[onInitSpatialError]"></app-error-indicator>
          </div>
          <ng-container *ngSwitchCase="indicator.ACTIVE">

            <ul class="nav nav-pills">
              <li *ngFor="let direction of directions"
                  [ngClass]="{'active': (selectedDirection != null && direction.id == selectedDirection.id)}"
                  role="presentation"
              >
                <a (click)="loadDirectionFeatures(direction)"
                   style="cursor: pointer"
                >
                  {{direction.name}}
                </a>
              </li>
            </ul>
            <br/>
            <app-map #mapAnalysis
                     [rotate]="true"
                     [fullScreen]="true"
                     [scale]="true"
                     [layerSwitcher]="true"
                     [layers]="['icaoannex14surfaces','terrain', 'airport', 'runway', 'objects', 'exception', 'direction', 'threshold', 'stopway', 'clearway']"
            >
            </app-map>
          </ng-container>
        </div>
      </div>

      <br>

      <nav>
        <ul class="pager">
          <li class="next">
            <a (click)="onNext()" style="cursor: pointer">
              <ng-container i18n="@@commons.wizard.next">Next</ng-container>
              <span aria-hidden="true">&#9658;</span>
            </a>
          </li>
          <li class="previous">
            <a (click)="onPrevious()" style="cursor: pointer">
              <span aria-hidden="true">&#9668;</span>
              <ng-container i18n="@@commons.wizard.previous"> Previous</ng-container>
            </a>
          </li>
        </ul>
      </nav>

    </block-ui>
  `
})

export class AnalysisWizardAnalysisComponent implements OnInit, AfterViewInit {

  @BlockUI() blockUI: NgBlockUI;
  blockTemplate = BlockTemplateComponent;
  initObstaclesStatus:number;
  initSpatialStatus:number;
  indicator;
  onInitObstaclesError:ApiError;
  onInitSpatialError:ApiError;
  onSubmitError:AppError;
  analysisId:number;
  private olMap: OlComponent;
  private runwayFeatures: Feature[];
  private exceptionFeatures: Feature[];
  private objectFeatures: Feature[];
  @ViewChildren('mapAnalysis') mapAnalysis: QueryList<ElementRef>;
  airportFeature:Feature;
  runways:Runway[];
  analysis:Analysis;
  directions: RunwayDirection[];
  selectedDirection: RunwayDirection;
  obstacles:AnalysisObstacle[];
  filteredObstacles:AnalysisObstacle[];
  passiveReason: string = "Obstacle: 'false'. Keep: 'true'";
  centerCoordinates: ol.Coordinate;
  flag: boolean;

  filterName: string;
  filterPenetration: boolean;
  filterDirection: number;
  filterRestriction: number;
  filterPending: boolean;

  constructor(
    private wizardService: AnalysisWizardService,
    private analysisService: AnalysisService,
    private runwayService: RunwayService,
    private directionService: DirectionService,
    private surfacesService: AnalysisSurfaceService,
    private airportService: AirportService,
    private obstacleService: AnalysisObstacleService,
    private resultService: AnalysisResultService,
    private objectService: ElevatedObjectService,
    private analysisObjectService: AnalysisObjectService,
    private exceptionService: AnalysisExceptionSurfaceService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService
  ){
    this.indicator = STATUS_INDICATOR;
    this.flag= false;
  }

  ngOnInit(): void {
    this.blockUI.stop();
    this.analysisId = this.route.snapshot.params['analysisId'];

    this.onInitObstaclesError = null;
    this.onInitSpatialError = null;
    this.onSubmitError = null;

    this.initObstaclesStatus = STATUS_INDICATOR.LOADING;
    this.initSpatialStatus = STATUS_INDICATOR.LOADING;

    this.runwayFeatures = [];
    this.airportFeature = null;
    this.directions = [];
    this.objectFeatures = [];
    this.exceptionFeatures = [];

    Promise.all([
      this.resolveObstacles(),
      this.resolveObstacleContext()
    ])
      .then(()=> this.onClear());
  }

  private resolveObstacles() {
    return this.obstacleService.list(this.analysisId, false)
      .then(data => {
        this.obstacles = data.sort((a, b) =>
          (a.directionId && b.directionName) ? a.directionName.localeCompare(b.directionName) : -1
        );
        this.initObstaclesStatus = (data.length > 0) ? STATUS_INDICATOR.ACTIVE : STATUS_INDICATOR.EMPTY;

      })
      .catch(error => {
        this.onInitObstaclesError = error;
        this.initObstaclesStatus = STATUS_INDICATOR.ERROR;
      });
  }

  private resolveObstacleContext() {
    return this.analysisService.get(this.analysisId)
      .then(data => {
        this.analysis = data;
        return this.runwayService.list(data.airportId)
      })
      .then(data => this.runways = data)
      .then(() => this.resolveAirportFeature())
      .then(() => this.resolveRunwayFeatures())
      .then(() => this.resolveExceptionFeatures())
      .then(() => this.resolveObjectFeatures())
      .then(() => this.resolveRunwaysDirections())
      .then(() => this.directions = this.runways.map(r => r.directions).reduce((a, b) => a.concat(b), []))
      .then(() => this.initSpatialStatus = STATUS_INDICATOR.ACTIVE)
      .catch(error => {
        this.onInitSpatialError = error;
        this.initSpatialStatus = STATUS_INDICATOR.ERROR;
      });
  }

  private resolveAirportFeature(): Promise<any>{
    return this.airportService
      .getFeature(this.analysis.airportId)
      .then(data => this.airportFeature = data)
      .then(()=> this.centerCoordinates = ol.extent.getCenter(this.airportFeature.getGeometry().transform('EPSG:4326', 'EPSG:3857').getExtent()))
      .catch(error => Promise.reject(error));
  }

  private resolveRunwayFeatures(): Promise<any>{
    return Promise.all(
      this.runways.map(r =>
        this.runwayService.getFeature(r.airportId, r.id)
          .then(data => this.runwayFeatures.push(data))
          .catch(error => Promise.reject(error))
      )
    );
  }

  private resolveRunwaysDirections(): Promise<any>{
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

  private resolveObjectFeatures(): Promise<any> {

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

  private resolveExceptionFeatures(): Promise<any> {

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

  ngAfterViewInit(): void {
    this.mapAnalysis.changes.subscribe(item => {

      if(!(this.olMap = item.first))
        return;

      this.recenter()
        .locateAirportFeatures()
        .locateObjectFeatures()
        .locateExceptionFeatures()
        .locateRunwayFeatures()
    });
  }

  onNext(){

    this.onSubmitError = null;

    this.blockUI.start("Processing...");

    //1. validate
    if(!this.obstacles.every(o => o.hasOwnProperty("resultId") && o.resultId !== null)){
      this.onSubmitError = new UiError("All obstacles must be analysed, there are some registers without a result.", "Error");
      this.blockUI.stop();
      return;
    }

    //2. perform

    this.wizardService
      .next(this.analysisId)
      .then( () =>{
        this.blockUI.stop();
        return this.router.navigate([`/analysis/${this.analysisId}/stages/inform`])
      })
      .catch((error) => {
        this.onSubmitError = error;
        this.blockUI.stop();
      });
  }

  onPrevious(){
    this.onSubmitError = null;

    this.wizardService
      .previous(this.analysisId)
      .then( () => this.router.navigate([`/analysis/${this.analysisId}/stages/exception`]))
      .catch((error) => this.onSubmitError = error);
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

  private recenter(): any {
    this.olMap.setCenter(this.centerCoordinates);
    this.olMap.setZoom(11);

    return this;
  }

  private locateAirportFeatures(): any {
    this.olMap.addAirport(this.airportFeature);
    return this;
  }

  private locateRunwayFeatures(): any {
    this.runwayFeatures.forEach( f => this.olMap.addRunway(f));
    return this;
  }

  private locateDirectionFeature(direction: RunwayDirection): Promise<any> {
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

  private locateClearwayFeature(direction: RunwayDirection) {
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

  private locateStopwayFeature(direction: RunwayDirection) {
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

  private locateThresholdFeature(direction: RunwayDirection) {
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

  locateExceptionFeatures(): any{
    this.exceptionFeatures.forEach(f => this.olMap.addException(f));
    return this;
  }

  locateObjectFeatures(): any{
    this.objectFeatures.forEach(f => this.olMap.addObject(f));
    return this;
  }

  private locateSurfaceFeatures(direction: RunwayDirection): Promise<any>{

    return this.surfacesService
      .get(this.analysisId, direction.id)
      .then(data => data.forEach(f => this.olMap.addSurface(f)))
      .catch(error => Promise.reject(error));
  }

  private clearMapLayers() : any {
    this.olMap
      .clearSurfaceLayers()
      .clearDirectionLayer()
      .clearDisplacedThresholdLayer()
      .clearStopwayLayer()
      .clearClearwayLayer();

    return this;
  }

  editResult(obstacle: AnalysisObstacle) {

    let modalRef : BsModalRef = this.modalService.show(AnalysisModalAnalysisComponent);

    this.modalService.onHide.subscribe((reason: string) => {
      this.obstacleService
        .get(obstacle.caseId, obstacle.id)
        .then(data => {
          obstacle.resultSummary = data.resultSummary;
          obstacle.resultId = data.resultId;
        });
    });

    //TODO onShow load data
    modalRef.content.obstacle = obstacle;

    if(obstacle.resultId)
      this.resultService
        .get(obstacle.caseId, obstacle.id)
        .then(data => modalRef.content.result = data)
        .then(() => modalRef.content.updateFilteredReasons());
    else
      modalRef.content.result = new AnalysisResult().initialize(obstacle);
  }

  onFilter(){
    this.filteredObstacles = this.obstacles.filter( o =>
      (this.filterName == null || this.filterName.length == 0 || o.objectName.toLocaleUpperCase().includes(this.filterName.toLocaleUpperCase()))
        && (this.filterRestriction == null || o.restrictionTypeId == this.filterRestriction)
          && (this.filterDirection == null || o.directionId == this.filterDirection)
            && (this.filterPenetration == null || (o.penetration > 0) == this.filterPenetration)
              && ((this.filterPending == null) || (o.resultSummary == null) == this.filterPending)
    );
  }

  onClear(){
    this.filterName = null;
    this.filterPenetration = null;
    this.filterDirection = null;
    this.filterRestriction = null;
    this.filterPending = null;
    this.filteredObstacles = this.obstacles;
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
}
