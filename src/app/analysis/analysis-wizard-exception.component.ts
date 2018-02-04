import {Component, OnInit} from "@angular/core";
import {BlockUI, NgBlockUI} from "ng-block-ui";
import {BlockTemplateComponent} from "../commons/block-template.component";
import {AnalysisService} from "./analysis.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiError} from "../main/apiError";
import {AppError} from "../main/ierror";
import {STATUS_INDICATOR} from "../commons/status-indicator";
import {AnalysisExceptionService, ExceptionType} from "../exception/exception.service";
import {AnalysisException} from "../exception/analysisException";
import {RegulationService, RegulationType} from "../regulation/regulation.service";
import {AnalysisWizardService} from "./analysis-wizard.service";
import {ROLE_READONLY, ROLE_WORKER} from '../auth/role';
import {AuthService} from '../auth/auth.service';
import {Analysis} from './analysis';
import {UiError} from '../main/uiError';
import {AbstractAnalysisWizardComponent} from './analysis-wizard-abstract.component';

@Component({
  template:`
    <h1>
      <ng-container i18n="@@analysis.wizard.object.title">Analysis: Apply exceptions </ng-container>
      <small class="pull-right"><ng-container i18n="@@wizard.commons.stage">Stage</ng-container> 2/4</small>
    </h1>
    <p i18n="@@analysis.wizard.object.main_description">
      This section allows users to define which exceptions are going to be applied into the case.
    </p>

    <hr/>

    <div *ngIf="onInitError">
      <app-error-indicator [errors]="[onInitError]"></app-error-indicator>
    </div>
    
    <div *ngIf="onSubmitError">
      <app-error-indicator [errors]="[onSubmitError]"></app-error-indicator>
    </div>

    <block-ui [template]="blockTemplate" [delayStop]="500">
      <div class="panel panel-default" *ngIf="initExceptionsStatus">
        <div class="panel-heading">
          <div class="row">
            <h3 class="panel-title panel-title-with-buttons col-md-6" i18n="@@analysis.wizard.exception.section.exceptions.title">
              Exceptions
            </h3>
            <div class="col-md-6 btn-group" *ngIf="allowEdit">
              <button
                (click)="onCreate()"
                class="btn btn-default pull-right"
                i18n="@@commons.button.new">
                New
              </button>
            </div>
            <div class="clearfix"></div>
          </div>
        </div>
        
        <div [ngSwitch]="initExceptionsStatus" class="panel-body">
          <div *ngSwitchCase="indicator.LOADING" >
            <app-loading-indicator></app-loading-indicator>
          </div>
          <div *ngSwitchCase="indicator.EMPTY" >
            <app-empty-indicator type="relation" entity="exceptions"></app-empty-indicator>
          </div>
          <div *ngSwitchCase="indicator.ERROR">
            <app-error-indicator [errors]="[onInitExceptionsError]"></app-error-indicator>
          </div>
          <div *ngSwitchCase="indicator.ACTIVE" class="table-responsive">
            <table class="table table-hover">
              <tr>
                <th>#</th>
                <th i18n="@@analysis.wizard.object.section.objects.name">Name</th>
                <th i18n="@@analysis.wizard.object.section.objects.type">Type</th>
                <th></th>
              </tr>
              <tbody>
              <tr *ngFor="let exception of exceptions; index as i;">
                <td><strong>{{i+1}}</strong></td>
                <td>
                  <a *ngIf="exception.typeId == 1" [routerLink]="['/analysis', analysisId, 'exceptions', 'rule', 'icao14', exception.id, 'detail']">
                    {{exception.name}}
                  </a>
                  <a *ngIf="exception.typeId == 0" [routerLink]="['/analysis', analysisId, 'exceptions', 'surface', exception.id, 'detail']">
                    {{exception.name}}
                  </a>
                </td>
                <td>{{exceptionTypes[exception.typeId].name}}</td>
                <td>
                  <button type="button" *ngIf="allowEdit" (click)="onDelete(exception.id)" class="btn btn-default btn-xs">
                    <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <br>

      <nav *ngIf="allowEdit">
        <ul class="pager">
          <li class="next">
            <a (click)="onNext()" style="cursor: pointer">
              <ng-container i18n="@@commons.wizard.next">Next </ng-container>
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

export class AnalysisWizardExceptionComponent extends AbstractAnalysisWizardComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  blockTemplate = BlockTemplateComponent;
  exceptions:AnalysisException[];
  exceptionTypes:ExceptionType[];
  regulation:RegulationType;
  initExceptionsStatus: number;
  onInitExceptionsError: ApiError;

  constructor(
    analysisService: AnalysisService,
    private exceptionService: AnalysisExceptionService,
    private regulationService: RegulationService,
    wizardService: AnalysisWizardService,
    authService: AuthService,
    route: ActivatedRoute,
    router: Router
  ){
    super(analysisService, wizardService, authService, route, router);

    this.exceptionTypes = this.exceptionService.types();
  }

  stageId(): number {
    return 1;
  }

  ngOnInit(): void {
    this.blockUI.stop();
    this.initExceptionsStatus = null;
    this.onInitExceptionsError = null;
    this.analysisId = this.route.snapshot.params['analysisId'];

    this.resolveAnalysis()
      .then(() => this.validateCurrentStage())
      .then(()=> this.resolveEdition())
      .catch(error => Promise.reject(this.onInitError = error))
      .then(()=> this.initExceptionsStatus = STATUS_INDICATOR.LOADING)
      .then(() => this.regulation = this.regulationService.types()[this.analysis.regulationId])
      .then(() => this.exceptionService.list(this.analysisId))
      .then(data => {
        this.exceptions=data;
        (this.exceptions.length > 0) ? this.initExceptionsStatus = STATUS_INDICATOR.ACTIVE : this.initExceptionsStatus = STATUS_INDICATOR.EMPTY;
      })
      .catch(error => {
        if(!this.onInitError){
          this.onInitExceptionsError = error;
          this.initExceptionsStatus = STATUS_INDICATOR.ERROR;
        }
      });
  }

  onNext(){

    this.onSubmitError = null;

    this.blockUI.start("Processing...");

    this.wizardService
      .next(this.analysisId)
      .then( () =>{
        this.blockUI.stop();
        return this.router.navigate([`/analysis/${this.analysisId}/stages/analysis`])
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
      .then( () => this.router.navigate([`/analysis/${this.analysisId}/stages/object`]))
      .catch((error) => this.onSubmitError = error);
  }

  onCreate(){
    return this.router.navigate([`/analysis/${this.analysisId}/exceptions/new`])
  }

  onDelete(exceptionId:number){
    this.onSubmitError = null;

    this.exceptionService
      .delete(this.analysisId, exceptionId)
      .then(() => this.exceptionService.list(this.analysisId))
      .then(data => {
        this.exceptions=data;
        (this.exceptions.length > 0) ? this.initExceptionsStatus = STATUS_INDICATOR.ACTIVE : this.initExceptionsStatus = STATUS_INDICATOR.EMPTY;
      })
      .catch((error) => this.onSubmitError = error)

  }
}
