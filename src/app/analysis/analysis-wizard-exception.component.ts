import {Component, OnInit} from "@angular/core";
import {BlockUI, NgBlockUI} from "ng-block-ui";
import {BlockTemplateComponent} from "../commons/block-template.component";
import {AnalysisService} from "./analysis.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiError} from "../main/apiError";
import {AppError} from "../main/ierror";
import {STATUS_INDICATOR} from "../commons/status-indicator";
import {AnalysisExceptionService} from "./analysis-exception.service";
import {AnalysisException} from "./analysisException";

@Component({
  template:`
    <h1>
      <ng-container i18n="@@analysis.wizard.object.title">Analysis: Apply exceptions </ng-container>
      <small class="pull-right">Stage 2/4</small>
    </h1>
    <p i18n="@@wizard.object.main_description">
      This section allows users to define which exceptions are going to be applied into the case.
    </p>

    <hr/>

    <div *ngIf="onSubmitError">
      <app-error-indicator [errors]="[onSubmitError]"></app-error-indicator>
    </div>

    <block-ui [template]="blockTemplate" [delayStop]="500">
      <div class="panel panel-default">
        <div class="panel-heading">
          <div class="row">
            <h3 class="panel-title panel-title-with-buttons col-md-6" i18n="@@analysis.wizard.object.section.exceptions.title">
              Exceptions
            </h3>
            <div class="col-md-6 btn-group">
              <a
                routerLink="/exceptions/new"
                class="btn btn-default pull-right"
                i18n="@@commons.button.new">
                New
              </a>
            </div>
            <div class="clearfix"></div>
          </div>
        </div>
        
        <div [ngSwitch]="initStatus" class="panel-body">
          <div *ngSwitchCase="indicator.LOADING" >
            <app-loading-indicator></app-loading-indicator>
          </div>
          <div *ngSwitchCase="indicator.EMPTY" >
            <app-empty-indicator type="relation" entity="exceptions"></app-empty-indicator>
          </div>
          <div *ngSwitchCase="indicator.ERROR">
            <app-error-indicator [errors]="[onInitError]"></app-error-indicator>
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
                  <a [routerLink]="['/exceptions', exception.typeId, exception.id]">
                    {{exception.name}}
                  </a>
                </td>
                <td>{{exceptionTypes[exception.typeId]}}</td>
                <td>
                  <button type="button" class="btn btn-default btn-xs">
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

      <nav>
        <ul class="pager">
          <li class="next">
            <a (click)="onNext()" style="cursor: pointer">
              <ng-container i18n="@@commons.wizard.next">Next </ng-container>
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

export class AnalysisWizardExceptionComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  blockTemplate = BlockTemplateComponent;
  initStatus:number;
  indicator;
  onInitError:ApiError;
  onSubmitError:AppError;
  analysisId:number;
  exceptions:AnalysisException[];
  exceptionTypes;

  constructor(
    private analysisService: AnalysisService,
    private exceptionService: AnalysisExceptionService,
    private route: ActivatedRoute,
    private router: Router
  ){
    this.indicator = STATUS_INDICATOR;
    this.exceptionTypes = this.exceptionService.types();
  }

  ngOnInit(): void {
    this.blockUI.stop();
    this.analysisId = this.route.snapshot.params['analysisId'];
    this.initStatus = STATUS_INDICATOR.LOADING;
    this.onInitError = null;

    this.exceptionService.list(this.analysisId)
      .then(data => {
        this.exceptions=data;
        (this.exceptions.length > 0) ? this.initStatus = STATUS_INDICATOR.ACTIVE : this.initStatus = STATUS_INDICATOR.EMPTY;
      })
      .catch(error =>{
        this.onInitError = error;
        this.initStatus = STATUS_INDICATOR.ERROR;
      })
  }

  onNext(){

  }

  onPrevious(){
    this.analysisService.update(this.analysisId, 0)
      .then( () => this.router.navigate([`/analysis/${this.analysisId}/stages/object`]))
      .catch((error) => this.onSubmitError = error);
  }

}
