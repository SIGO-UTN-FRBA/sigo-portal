import {Component, OnInit, ViewChild} from '@angular/core';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {BlockTemplateComponent} from '../commons/block-template.component';
import {ApiError} from '../main/apiError';
import {AppError} from '../main/ierror';
import {OlComponent} from '../olmap/ol.component';
import Map = ol.Map;
import {AnalysisWizardService} from './analysis-wizard.service';
import {ActivatedRoute, Router} from '@angular/router';
import {STATUS_INDICATOR} from '../commons/status-indicator';
import {RunwayDirection} from '../direction/runwayDirection';
import {AnalysisObstacle} from './analysisObstacle';
import {RunwayService} from '../runway/runway.service';
import {DirectionService} from '../direction/direction.service';
import {AnalysisExceptionSurfaceService} from '../exception/exception-surface.service';
import {AnalysisSurfaceService} from './analysis-surface.service';
import {AnalysisObstacleService} from './analysis-obstacle.service';
import {AnalysisObjectService} from './analysis-object.service';
import {AnalysisResultService} from './analysis-result.service';
import {AirportService} from '../airport/airport.service';
import {ElevatedObjectService} from '../object/object.service';
import {AnalysisService} from './analysis.service';
import {Runway} from '../runway/runway';
import {Analysis} from './analysis';
import Feature = ol.Feature;

@Component({
  template:`
    <h1>
      <ng-container i18n="@@analysis.wizard.inform.title">Analysis: Inform</ng-container>
      <small *ngIf="analysis.statusId <= 1" class="pull-right"><ng-container i18n="@@wizard.commons.stage">Stage</ng-container> 4/4</small>
    </h1>
    <p i18n="@@analysis.wizard.inform.main_description">
      This section allows users to study the final results of analysis.
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
                i18n="@@analysis.wizard.inform.section.obstacles.title">
              Obstacles
            </h3>
          </div>
        </div>
        
        <div [ngSwitch]="initObstaclesStatus" class="panel-body">
          <div *ngSwitchCase="indicator.LOADING">
            <apgip-loading-indicator></apgip-loading-indicator>
          </div>
          <div *ngSwitchCase="indicator.EMPTY">
            <app-empty-indicator type="relation" entity="obstacles"></app-empty-indicator>
          </div>
          <div *ngSwitchCase="indicator.ERROR">
            <app-error-indicator [errors]="[onInitObstaclesError]"></app-error-indicator>
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
                  <th i18n="@@analysis.wizard.inform.section.obstacles.name">Name</th>
                  <th i18n="@@analysis.wizard.inform.section.obstacles.objectHeight">Object Height [m]</th>
                  <th i18n="@@analysis.wizard.inform.section.obstacles.restrictionHeight">Restriction Height [m]</th>
                  <th i18n="@@analysis.wizard.inform.section.obstacles.penetration">Penetration [m]</th>
                  <th i18n="@@analysis.wizard.inform.section.obstacles.direction">Direction</th>
                  <th i18n="@@analysis.wizard.inform.section.obstacles.surface">Restriction</th>
                  <th i18n="@@analysis.wizard.inform.section.obstacles.result">Result</th>
                </tr>
                <tbody>
                <tr *ngFor="let obstacle of filteredObstacles; index as i;">
                  <td><strong>{{i + 1}}</strong></td>
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
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <br>

      <nav *ngIf="analysis.statusId <= 1">
        <ul class="pager">
          <li class="next">
            <a (click)="onFinish()" style="cursor: pointer">
              <ng-container i18n="@@commons.wizard.finalize">Finalize </ng-container>
              <span aria-hidden="true">&#9673;</span>
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

export class AnalysisWizardInformComponent implements OnInit {

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
  @ViewChild('mapObjects') set content(content: OlComponent) {this.olMap = content;}
  map:Map;
  airportFeature:Feature;
  runways:Runway[];
  analysis:Analysis;
  directions: RunwayDirection[];
  selectedDirection: RunwayDirection;
  obstacles:AnalysisObstacle[];
  filteredObstacles:AnalysisObstacle[];
  passiveReason: string = "Obstacle: 'false'. Keep: 'true'";

  filterName: string;
  filterPenetration: boolean;
  filterDirection: number;
  filterRestriction: number;

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
    private router: Router
  ){
    this.indicator = STATUS_INDICATOR;
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
      .then(data => {
        this.runways = data;
      })
      .then(() => this.resolveRunways())
      .then(() => this.resolveAirportFeature())
      .then(() => this.resolveRunwayFeatures())
      .then(() => this.resolveExceptionFeatures())
      .then(() => this.resolveObjectFeatures())
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

  private resolveRunways(): Promise<any>{
    return Promise.all(
      this.runways.map( r =>
        this.directionService.list(r.airportId,r.id)
          .then( data => {
            r.directions = data;
            r.directions.forEach((d => d.runway = r));
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

  onFinish(){

    this.onSubmitError = null;

    this.blockUI.start("Processing...");


    this.wizardService
      .finish(this.analysisId)
      .then( () =>{
        this.blockUI.stop();
        return this.router.navigateByUrl(`/analysis/search/list?id=${this.analysis.airportId}`)
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
      .then( () => this.router.navigate([`/analysis/${this.analysisId}/stages/analysis`]))
      .catch((error) => this.onSubmitError = error);
  }

  onFilter(){
    this.filteredObstacles = this.obstacles.filter( o =>
      (this.filterName == null || this.filterName.length == 0 || o.objectName.toLocaleUpperCase().includes(this.filterName.toLocaleUpperCase()))
        && (this.filterRestriction == null || o.restrictionTypeId == this.filterRestriction)
          && (this.filterDirection == null || o.directionId == this.filterDirection)
            && (this.filterPenetration == null || (o.penetration > 0) == this.filterPenetration)
    );
  }

  onClear(){
    this.filterName = null;
    this.filterPenetration = null;
    this.filterDirection = null;
    this.filterRestriction = null;
    this.filteredObstacles = this.obstacles;
  }
}
