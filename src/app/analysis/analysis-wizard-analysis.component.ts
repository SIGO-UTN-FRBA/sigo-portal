import {AfterViewInit, Component, OnInit, ViewChild} from "@angular/core";
import {BlockTemplateComponent} from "../commons/block-template.component";
import {BlockUI, NgBlockUI} from "ng-block-ui";
import {AppError} from "../main/ierror";
import {ApiError} from "../main/apiError";
import {ActivatedRoute, Router} from "@angular/router";
import {AnalysisWizardService} from "./analysis-wizard.service";
import {STATUS_INDICATOR} from "../commons/status-indicator";
import {OlComponent} from "../olmap/ol.component";
import Map = ol.Map;
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

@Component({
  template:`
    <h1>
      <ng-container i18n="@@analysis.wizard.object.title">Analysis: Analyze obstacles</ng-container>
      <small class="pull-right">Stage 3/4</small>
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
            <div class="clearfix"></div>
          </div>
        </div>
        <div [ngSwitch]="initObstaclesStatus" class="panel-body" style="max-height: 40em; overflow: auto;">
          <div *ngSwitchCase="indicator.LOADING">
            <app-loading-indicator></app-loading-indicator>
          </div>
          <div *ngSwitchCase="indicator.EMPTY">
            <app-empty-indicator type="relation" entity="obstacles"></app-empty-indicator>
          </div>
          <div *ngSwitchCase="indicator.ERROR">
            <app-error-indicator [errors]="[onInitObstaclesError]"></app-error-indicator>
          </div>
          <div *ngSwitchCase="indicator.ACTIVE" class="table-responsive">
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
              <tr *ngFor="let obstacle of obstacles; index as i;">
                <td><strong>{{i + 1}}</strong></td>
                <td>
                  <a [routerLink]="['/objects', obstacle.objectType, obstacle.objectId]">
                    {{obstacle.objectName}}
                  </a>
                </td>
                <td>{{obstacle.objectHeight | number}}</td>
                <td>{{obstacle.restrictionHeight | number}}</td>
                <td>{{obstacle.penetration | number}}</td>
                <td>{{obstacle.directionId ? obstacle.directionName : "-" }}</td>
                <td>[{{obstacle.restrictionTypeId == 1 ? "Exception" : "OLS"}}] {{obstacle.restrictionName}}</td>
                <td>{{obstacle.resultSummary}}</td>
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
            <app-map #mapObjects
                     (map)="map"
                     [rotate]="true"
                     [fullScreen]="true"
                     [scale]="true"
                     [layers]="['icaoannex14surfaces','terrain', 'airport', 'runway', 'objects']"
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
              <span aria-hidden="true">&rarr;</span>
            </a>
          </li>
          <li class="previous">
            <a (click)="onPrevious()" style="cursor: pointer">
              <span aria-hidden="true">&larr;</span>
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
  private olmap: OlComponent;
  @ViewChild('mapObjects') set content(content: OlComponent) {
    this.olmap = content;
  }
  map:Map;
  airportFeature:Feature;
  runways:Runway[];
  analysis:Analysis;
  directions: RunwayDirection[];
  selectedDirection: RunwayDirection;
  obstacles:AnalysisObstacle[];

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
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService
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

    this.obstacleService.list(this.analysisId)
      .then(data => {
        this.obstacles = data.sort((a,b) =>
          (a.directionId && b.directionName) ? a.directionName.localeCompare(b.directionName) : -1
        );
        this.initObstaclesStatus = STATUS_INDICATOR.ACTIVE;
      })
      .catch(error => {
        this.onInitObstaclesError = error;
        this.initObstaclesStatus = STATUS_INDICATOR.ERROR;
      });

    this.analysisService.get(this.analysisId)
      .then(data => {
        this.analysis = data;
        return this.runwayService.list(data.airportId)
      })
      .then(data => {
        this.runways = data;
        return Promise.all(
          this.runways.map( r =>
            this.directionService.list(r.airportId,r.id)
              .then( data => {
                r.directions = data;
                r.directions.forEach((d => d.runway = r));
              })
          )
        )
      })
      .then(()=> this.airportService.getFeature(this.analysis.airportId))
      .then(data => this.airportFeature = data)
      .then(()=>
        this.directions =
          this.runways.map( r => r.directions)
            .reduce((a,b)=> a.concat(b), [])
      )
      .then( () => this.initSpatialStatus = STATUS_INDICATOR.ACTIVE)
      .catch(error => {
        this.onInitSpatialError = error;
        this.initSpatialStatus = STATUS_INDICATOR.ERROR;
      })
  }

  ngAfterViewInit(): void {
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

  loadDirectionFeatures(direction: RunwayDirection): Promise<any> {
    this.selectedDirection = direction;

    this.clearMapLayers();

    this.olmap.setCenter(this.airportFeature.getGeometry().transform('EPSG:4326', 'EPSG:3857')['getCoordinates']());
    this.olmap.setZoom(11);

    let p1 = this.resolveSurfaceFeatures(direction);

    let p2 = this.resolveObjectFeatures();

    return Promise.all([p1,p2]);
  }

  private resolveObjectFeatures() {
    return this.obstacles.map(o =>
      this.objectService
        .getFeature(o.objectId, o.objectType)
        .then(data => this.olmap.addObject(data))
        .catch(error => Promise.reject(error))
    );
  }

  private resolveSurfaceFeatures(direction: RunwayDirection) :Promise<any>{
    return this.surfacesService
      .get(this.analysisId, direction.id)
      .then(data => data.forEach(f => this.olmap.addSurface(f)))
      .catch(error => Promise.reject(error));
  }

  private clearMapLayers() : OlComponent {
    return this.olmap
      .clearTerrainLayer()
      .clearObjectLayers()
      .clearAirportLayer()
      .clearRunwayLayer();
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
}
