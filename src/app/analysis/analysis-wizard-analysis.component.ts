import {Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AnalysisWizardService} from "./analysis-wizard.service";
import {DirectionService} from "../direction/direction.service";
import {RunwayService} from "../runway/runway.service";
import {AnalysisService} from "./analysis.service";
import {AnalysisSurfaceService} from "./analysis-surface.service";
import {AirportService} from "../airport/airport.service";
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
import {AuthService} from '../auth/auth.service';
import {AbstractAnalysisWizardAnalysisComponent} from './analysis-wizard-abstract-analysis.component';

@Component({
  template:`
    <h1>
      <ng-container i18n="@@analysis.wizard.analysis.title">
        Analysis: Analyze obstacles
      </ng-container>
      <small class="pull-right">
        <ng-container i18n="@@wizard.commons.stage">Stage</ng-container>
        3/4
      </small>
    </h1>
    <p i18n="@@analysis.wizard.analysis.main_description">
      This section allows users to analyze the obstacles detected as a result of the application of the regulation.
    </p>

    <hr/>

    <div *ngIf="onInitError">
      <app-error-indicator [errors]="[onInitError]"></app-error-indicator>
    </div>

    <div *ngIf="onSubmitError">
      <app-error-indicator [errors]="[onSubmitError]"></app-error-indicator>
    </div>

    <block-ui [template]="blockTemplate" [delayStop]="500">

      <div class="panel panel-default" *ngIf="initObstaclesStatus != null">
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
                  <th i18n="@@analysis.wizard.analysis.section.obstacles.allowed">Allowed</th>
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
                    <a *ngIf="obstacle.objectType != 3" [routerLink]="['/objects', getTypeById(obstacle.objectType), obstacle.objectId]">
                      {{obstacle.objectName}}
                    </a>
                    <ng-container *ngIf="obstacle.objectType == 3">
                      {{obstacle.objectName}}
                    </ng-container>
                  </td>
                  <td>{{obstacle.objectHeight | number}}</td>
                  <td>{{obstacle.restrictionHeight | number}}</td>
                  <td [ngClass]="{'danger': obstacle.penetration > 0, 'success': obstacle.penetration < 0}">
                    {{obstacle.penetration | number}}
                  </td>
                  <td>{{obstacle.directionId ? obstacle.directionName : "-" }}</td>
                  <td>[{{obstacle.restrictionTypeId == 1 ? "Exception" : "OLS"}}] {{obstacle.restrictionName}}</td>
                  <td [ngClass]="{'warning': obstacle.allowed != undefined && !obstacle.allowed}">
                    {{(obstacle.allowed != undefined) ? obstacle.allowed : '[undefined]'}}
                  </td>
                  <td>
                    <button type="button" *ngIf="allowEdit" class="btn btn-default btn-sm" (click)="editResult(obstacle)">
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

      <div class="panel panel-default" *ngIf="initSpatialStatus != null">
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

      <nav *ngIf="allowEdit">
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

export class AnalysisWizardAnalysisComponent extends AbstractAnalysisWizardAnalysisComponent {



  constructor(
    wizardService: AnalysisWizardService,
    analysisService: AnalysisService,
    runwayService: RunwayService,
    directionService: DirectionService,
    surfacesService: AnalysisSurfaceService,
    airportService: AirportService,
    obstacleService: AnalysisObstacleService,
    resultService: AnalysisResultService,
    objectService: ElevatedObjectService,
    analysisObjectService: AnalysisObjectService,
    exceptionService: AnalysisExceptionSurfaceService,
    authService: AuthService,
    route: ActivatedRoute,
    router: Router,
    private modalService: BsModalService
  ){
    super(wizardService, analysisService, runwayService, directionService, surfacesService, airportService, obstacleService, resultService, objectService, analysisObjectService, exceptionService, authService, route, router);
  }

  stageId(): number {
    return 3;
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

  editResult(obstacle: AnalysisObstacle) {

    let modalRef : BsModalRef = this.modalService.show(AnalysisModalAnalysisComponent);

    modalRef.content.readonly = false;

    this.modalService.onHide.subscribe((reason: string) => {
      this.obstacleService
        .get(obstacle.caseId, obstacle.id)
        .then(data => {
          obstacle.allowed = data.allowed;
          obstacle.resultId = data.resultId;
        });
    });

    //TODO onShow load data
    modalRef.content.obstacle = obstacle;

    if(obstacle.resultId)
      this.resultService
        .get(obstacle.caseId, obstacle.id)
        .then(data => modalRef.content.result = data);
    else
      modalRef.content.result = new AnalysisResult().initialize(obstacle);
  }
}
