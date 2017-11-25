import {Component, OnInit} from "@angular/core";
import {AnalysisExceptionService} from "./analysis-exception.service";
import {RegulationIcaoService} from "../regulation/regulation-icao.service";
import {RegulationFaaService} from "../regulation/regulation-faa.service";
import {STATUS_INDICATOR} from "../commons/status-indicator";
import {AppError} from "../main/ierror";

@Component({
  template:`
    <h1 i18n="@@exception.rule.new.title">
      New analysis exception for regulation rule
    </h1>
    <p i18n="@@exception.rule.new.main_description">
      This section allows users to create an exception on regulation rule.
    </p>
    <hr/>
    <div class="container-fluid">
      <div class="panel panel-default">
        <div class="panel-body" [ngSwitch]="onInitStatus">
          <div *ngSwitchCase="indicator.LOADING">
            <app-loading-indicator></app-loading-indicator>
          </div>
          <div *ngSwitchCase="indicator.ERROR" class="container-fluid">
            <app-error-indicator [errors]="[onInitError]"></app-error-indicator>
          </div>
          <form id="ngForm"
                #exceptionForm="ngForm"
                *ngSwitchCase="indicator.ACTIVE"
                role="form"
                class="form container-fluid"
                (ngSubmit)="onSubmit()">

            <div class="row">
              <div class="col-md-6 col-sm-12 form-group">
                <label
                  for="inputClassification"
                  class="control-label"
                  i18n="@@exception.rule.detail.section.general.inputRegulation">
                  Regulation
                </label>
                <p class="form-control-static">{{filter.regulation}}</p>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 col-sm-12 form-group">
                <label
                  for="inputClassification"
                  class="control-label"
                  i18n="@@exception.rule.detail.section.general.inputClassification">
                  Classification
                </label>
                <select
                  name="inputClassification"
                  class="form-control"
                  [(ngModel)]="filter.classification"
                  required>
                  <option *ngFor="let item of classifications" [value]="item.id">
                    {{item.description}}
                  </option>
                </select>
              </div>
              <div class="col-md-6 col-sm-12 form-group">
                <label
                  for="inputCategory"
                  class="control-label"
                  i18n="@@exception.rule.detail.section.general.inputCategory">
                  Category
                </label>
                <select
                  name="inputCategory"
                  class="form-control"
                  [(ngModel)]="filter.category"
                  required>
                  <option *ngFor="let item of categories" [value]="item.id">
                    {{item.description}}
                  </option>
                </select>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 col-sm-12 form-group">
                <label
                  for="inputNumberCode"
                  class="control-label"
                  i18n="@@exception.rule.detail.section.general.inputNumberCode">
                  Number Code
                </label>
                <select
                  name="inputNumberCode"
                  class="form-control"
                  [(ngModel)]="filter.code"
                  required>
                  <option *ngFor="let item of numberCodes" [value]="item.id">
                    {{item.description}}
                  </option>
                </select>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 col-sm-12 form-group">
                <label
                  for="inputSurface"
                  class="control-label"
                  i18n="@@exception.rule.detail.section.general.inputSurface">
                  Surface
                </label>
                <select
                  name="inputSurface"
                  class="form-control"
                  [(ngModel)]="filter.surface"
                  required>
                  <option *ngFor="let item of surfaces" [value]="item.id">
                    {{item.description}}
                  </option>
                </select>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 col-sm-12 form-group">
                <label
                  for="inputProperty"
                  class="control-label"
                  i18n="@@exception.rule.detail.section.general.inputProperty">
                  Property
                </label>
                <select
                  name="inputProperty"
                  class="form-control"
                  [(ngModel)]="filter.property"
                  required>
                  <option *ngFor="let item of properties" [value]="item.id">
                    {{item.description}}
                  </option>
                </select>
              </div>
            </div>
            <ng-container *ngIf="filter.property">
              <div class="row">
                <div class="col-md-6 col-sm-12 form-group">
                  <label
                    for="inputClassification"
                    class="control-label"
                    i18n="@@exception.rule.detail.section.general.inputCurrentValue">
                    Current Value
                  </label>
                  <p class="form-control-static">{{rule.currentValue}}</p>
                </div>
                <div class="col-md-6 col-sm-12 form-group">
                  <label
                    for="inputOverrideValue"
                    class="control-label"
                    i18n="@@exception.rule.detail.section.general.inputOverrideValue">
                    Override Value
                  </label>
                  <input type="number"
                         name="inputOverrideValue"
                         class="form-control"
                         [(ngModel)]="overrideValue"
                         required
                  >
                </div>
              </div>
            </ng-container>
          </form>
        </div>
      </div>
    </div>
  `
})

export class ExceptionNewRuleComponent implements OnInit {

  onInitStatus:number;
  indicator;
  onInitError:AppError;
  onSubmitStatus:AppError;
  filter;

  constructor(
    private exceptionService:AnalysisExceptionService,
    private icaoService:RegulationIcaoService,
    private faaService:RegulationFaaService
  ){
    this.indicator=STATUS_INDICATOR;
  }

  ngOnInit(): void {
    this.initializeFilters();

    this.onInitStatus=STATUS_INDICATOR.LOADING;
    this.onInitError=null;
    this.onSubmitStatus=null;


  }

  onSubmit(){

  }

  onCancel(){

  }

  private initializeFilters() {

  }
}
