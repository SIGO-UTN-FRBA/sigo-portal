import {Component} from '@angular/core';
import {AnalysisWizardService} from './analysis-wizard.service';
import {ActivatedRoute, Router} from '@angular/router';
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
import {AuthService} from '../auth/auth.service';
import {AbstractAnalysisWizardAnalysisComponent} from './analysis-wizard-abstract-analysis.component';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {AnalysisModalAnalysisComponent} from './analysis-modal-analysis.component';
import {AnalysisResult} from './analysisResult';
import {AnalysisObstacle} from './analysisObstacle';

@Component({
  template:`
    <h1>
      <ng-container i18n="@@analysis.wizard.inform.title">Analysis: Inform</ng-container>
      <small *ngIf="analysis && analysis.statusId <= 1" class="pull-right"><ng-container i18n="@@wizard.commons.stage">Stage</ng-container> 4/4</small>
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
                    <option [ngValue]="null" i18n="@@commons.text.all">All</option>
                    <option [ngValue]="true" i18n="@@commons.text.yes">Yes</option>
                    <option [ngValue]="false" i18n="@@commons.text.no">No</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="inputDirection" i18n="@@analysis.wizard.inform.filter.directions">Directions</label>
                  <select name="inputDirection"
                          [(ngModel)]="filterDirection"
                          class="form-control">
                    <option [ngValue]="null" i18n="@@commons.text.all">All</option>
                    <option *ngFor="let direction of directions" [ngValue]="direction.id">{{direction.name}}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="inputRestriction" i18n="@@analysis.wizard.inform.filter.restriction">Restriction</label>
                  <select name="inputRestriction"
                          [(ngModel)]="filterRestriction"
                          class="form-control">
                    <option [ngValue]="null" i18n="@@commons.text.all">All</option>
                    <option [ngValue]="1" i18n="@@commons.text.exception">Exception</option>
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
                  <th i18n="@@analysis.wizard.inform.section.obstacles.allowed">Allowed</th>
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
                  </td>
                  <td>{{obstacle.objectHeight | number}}</td>
                  <td>{{obstacle.restrictionHeight | number}}</td>
                  <td [ngClass]="{'danger': obstacle.penetration > 0, 'success': obstacle.penetration < 0}">
                    {{obstacle.penetration | number}}
                  </td>
                  <td>{{obstacle.directionId ? obstacle.directionName : "-" }}</td>
                  <td>[{{obstacle.restrictionTypeId == 1 ? "Exception" : "OLS"}}] {{obstacle.restrictionName}}</td>
                  <td [ngClass]="{'warning': obstacle.allowed != undefined && !obstacle.allowed}">
                    <a (click)="showResult(obstacle)" style="cursor: pointer;">{{obstacle.allowed}}</a>
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

      <nav *ngIf="analysis != null && analysis.statusId <= 1 && allowEdit">
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

export class AnalysisWizardInformComponent extends AbstractAnalysisWizardAnalysisComponent {

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
    return 4;
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

  showResult(obstacle: AnalysisObstacle) {

    let modalRef : BsModalRef = this.modalService.show(AnalysisModalAnalysisComponent);

    modalRef.content.readonly = true;

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
