import {Component, OnInit, Pipe, PipeTransform} from "@angular/core";
import {RegulationIcaoService} from "./regulation-icao.service";
import {ApiError} from "../main/apiError";
import {STATUS_INDICATOR} from "../commons/status-indicator";
import {EnumItem} from "../commons/enumItem";
import {RuleICAOAnnex14} from "./ruleICAO";
import {ListItem} from "../commons/listItem";

@Pipe({name: 'filterBySurface'})
export class FilterRulesBySurface implements PipeTransform {

  transform(rules: RuleICAOAnnex14[], surface: number, classification:number, category: number, code: number) {

    return rules.filter(r => r.surface == surface
                                        && r.runwayCategory == +category
                                        && r.runwayClassification == +classification
                                        && r.runwayCodeNumber == +code);
  }
}

@Component({
  template: `
    <breadcrumb></breadcrumb>
    <h1 i18n="@@regulation.detail.title">
      Regulation detail
    </h1>
    <p i18n="@@regulation.detail.main_description">
      This section allows users to inspect the ICAO Annex 14 regulation's rules.
    </p>
    <hr/>
    <div class="container-fluid">
      <div class="panel panel-default">
        <div class="panel-heading">
          <div class="row">
            <h3 class="panel-title panel-title-with-buttons col-md-6" i18n="@@regulation.detail.section.filter.title">
              Filters
            </h3>
          </div>
        </div>
        <div class="panel-body" [ngSwitch]="onInitStatus">
          <div *ngSwitchCase="indicator.LOADING">
            <app-loading-indicator></app-loading-indicator>
          </div>
          <div *ngSwitchCase="indicator.ERROR" class="container-fluid">
            <app-error-indicator [error]="onInitError"></app-error-indicator>
          </div>
          <form #regulationForm="ngForm"
                *ngSwitchCase="indicator.ACTIVE"
                role="form"
                class="form container-fluid"
                (ngSubmit)="onSubmit()">
            
            <div class="row">
              <div class="col-md-6 col-sm-12 form-group">
                <label
                  for="inputClassification"
                  class="control-label"
                  i18n="@@regulation.detail.section.filter.inputClassification">
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
                  i18n="@@regulation.detail.section.filter.inputCategory">
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
                  i18n="@@regulation.detail.section.filter.inputNumberCode">
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
            <br>
            <div class="row">
              <div class="pull-right">
                <button
                  (click)="onReset()"
                  type="button"
                  class="btn btn-default"
                  i18n="@@commons.button.reset">
                  Reset
                </button>
                <button
                  type="submit"
                  [disabled]="regulationForm.invalid"
                  class="btn btn-success"
                  i18n="@@commons.button.apply">
                  Apply
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    
      <ng-container *ngIf="onSubmitStatus !== null">
        <ng-container class="panel-body" [ngSwitch]="onSubmitStatus">
          <div *ngSwitchCase="indicator.LOADING" class="container-fluid">
            <app-loading-indicator></app-loading-indicator>
          </div>
          <div *ngSwitchCase="indicator.ERROR" class="container-fluid">
            <app-error-indicator [error]="onInitError"></app-error-indicator>
          </div>
          <ul *ngSwitchCase="indicator.ACTIVE" class="list-group">
            <div *ngFor="let surface of surfaces" class="form-horizontal">
              <li class="list-group-item">
                <h4>{{surface.value}}</h4>
                <div  *ngFor="let rule of (rules | filterBySurface: surface.key : filter.classification : filter.category : filter.code )"
                      class="form-group">
                  <label class="col-sm-2 control-label">{{rule.property}}</label>
                  <p class="col-sm-10 form-control-static">{{rule.value}}</p>
                </div>
              </li>
            </div>
          </ul>
        </ng-container>
      </ng-container>
    </div>
  `
})

export class RegulationDetailICAOComponent implements OnInit {

  onInitStatus:number;
  onSubmitStatus:number;
  indicator;
  onInitError:ApiError;
  onSubmitError:ApiError;
  filter:{classification:number, category:number, code:number};
  classifications:EnumItem[];
  categories:EnumItem[];
  numberCodes:EnumItem[];
  surfaces:ListItem[];
  rules:RuleICAOAnnex14[];

  constructor(
    private regulationService:RegulationIcaoService
  ){
    this.indicator=STATUS_INDICATOR;
  }

  ngOnInit(): void {
    this.initializeFilters();

    this.onInitStatus=STATUS_INDICATOR.LOADING;
    this.onInitError=null;
    this.onSubmitStatus=null;

    let p1 = this.regulationService
      .listICAOAnnex14RunwayClassifications()
      .then(data => this.classifications=data)
      .catch(error => Promise.reject(error));

    let p2 = this.regulationService
      .listICAOAnnex14RunwayCategories()
      .then(data => this.categories=data)
      .catch(error => Promise.reject(error));

    let p3 = this.regulationService
      .listICAOAnnex14RunwayCodeNumbers()
      .then(data => this.numberCodes=data)
      .catch(error => Promise.reject(error));

    let p4 = this.regulationService
      .getRules()
      .then(data => this.rules=data)
      .catch(error => Promise.reject(error));

    Promise.all([p1,p2,p3,p4])
      .then(()=>this.onInitStatus=STATUS_INDICATOR.ACTIVE)
      .catch(error => {
        this.onInitError=error;
        this.onInitStatus=STATUS_INDICATOR.ERROR;
      })
  }


  onSubmit(): void {

    this.onSubmitError=null;
    this.onSubmitStatus=STATUS_INDICATOR.LOADING;

    this.regulationService
      .searchSurfaces(this.filter.classification, this.filter.category)
      .then(data => {
        this.surfaces=data;
        this.onSubmitStatus=STATUS_INDICATOR.ACTIVE;
      })
      .catch(error=>{
        this.onSubmitError=error;
        this.onSubmitStatus=STATUS_INDICATOR.ERROR;
      })
  }

  onReset(): void {
      this.initializeFilters();
  }

  private initializeFilters() {
    this.filter={classification:null, category:null, code:null};
  }
}
