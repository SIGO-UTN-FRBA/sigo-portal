import {Component, OnInit} from "@angular/core";
import {AnalysisExceptionService} from "./analysis-exception.service";
import {ActivatedRoute, Router} from "@angular/router";
import {RegulationIcaoService} from "../regulation/regulation-icao.service";
import {AppError} from "../main/ierror";
import {STATUS_INDICATOR} from "../commons/status-indicator";
import {RuleICAOAnnex14} from "../regulation/ruleICAO";
import {EnumItem} from "../commons/enumItem";
import {ListItem} from "../commons/listItem";
import {AnalysisExceptionRule} from "./analysisExceptionRule";

@Component({
  template:`
    <div *ngIf="onSubmitError" class="container-fluid">
      <app-error-indicator [errors]="[onSubmitError]"></app-error-indicator>
    </div>
    
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
              (ngSubmit)="onSubmit()"
        >
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
                (ngModelChange)="updateSurfaces()"
                required>
                <option *ngFor="let item of classifications" [value]="item.id">
                  {{item.description}}
                </option>
              </select>
            </div>
          </div>
          <div class="row">
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
                (ngModelChange)="updateSurfaces()"
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
                (ngModelChange)="updateSurfaces()"
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
                (ngModelChange)="updateProperties()"
                required>
                <option *ngFor="let item of surfaces" [value]="item.key">
                  {{item.value}}
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
                [(ngModel)]="filter.rule"
                (ngModelChange)="updateRule()"
                required>
                <option *ngFor="let rule of rules" [value]="rule.id">
                  {{rule.property}}
                </option>
              </select>
            </div>
          </div>
         
          <div class="row">
            <div class="col-md-6 col-sm-12 form-group">
              <label
                for="inputCurrentValue"
                class="control-label"
                i18n="@@exception.rule.detail.section.general.inputCurrentValue">
                Value
              </label>
              <input type="number"
                     name="inputCurrentValue"
                     class="form-control"
                     disabled="true"
                     [(ngModel)]="currentValue"
              >
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
                     [disabled]="!currentValue"
                     required
              >
            </div>
          </div>
          <br>
          <div class="row">
            <div class="pull-right">
              <button
                type="button"
                (click)="onCancel()"
                class="btn btn-default"
                i18n="@@commons.button.cancel">
                Cancel
              </button>
              <button
                type="button"
                (click)="exceptionForm.ngSubmit.emit()"
                [disabled]="exceptionForm.form.invalid"
                class="btn btn-success"
                i18n="@@commons.button.create">
                Create
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  `
})

export class ExceptionNewRuleIcao14Component implements OnInit {
  private analysisId: number;
  onInitStatus:number;
  indicator;
  onInitError:AppError;
  onSubmitError:AppError;
  filter:{classification:number, category:number, code:number, surface:number, rule:number};
  classifications:EnumItem[];
  categories:EnumItem[];
  numberCodes:EnumItem[];
  surfaces:ListItem[];
  rules:RuleICAOAnnex14[];
  properties:string[];
  currentValue: any;
  overrideValue: any;

  constructor(
    private exceptionService:AnalysisExceptionService,
    private regulationService:RegulationIcaoService,
    private route:ActivatedRoute,
    private router:Router
  ){
    this.indicator=STATUS_INDICATOR;
  }

  ngOnInit(): void {

    this.initializeFilters();

    this.onInitStatus=STATUS_INDICATOR.LOADING;
    this.onInitError=null;
    this.currentValue=null;

    this.analysisId = this.route.parent.parent.snapshot.params['analysisId'];

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

    Promise.all([p1,p2,p3])
      .then(()=>this.onInitStatus=STATUS_INDICATOR.ACTIVE)
      .catch(error => {
        this.onInitError=error;
        this.onInitStatus=STATUS_INDICATOR.ERROR;
      })
  }

  private initializeFilters() {
    this.filter={classification:null, category:null, code:null, surface:null, rule: null};
  }

  updateSurfaces() {
    this.surfaces=[];
    this.filter.surface=null;
    this.updateProperties();

    if(this.filter.classification != null && this.filter.code != null && this.filter.category != null){
      this.regulationService
        .searchSurfaces(this.filter.classification, this.filter.category, this.filter.code)
        .then(data => this.surfaces=data); //TODO handle errors
    }
  }

  updateProperties() {
    this.properties = [];
    this.filter.rule=null;
    this.updateRule();

    if(this.filter.surface != null){
      this.regulationService
        .getRules(this.filter.surface, this.filter.classification, this.filter.category, this.filter.code)
        .then(data => this.rules = data) //TODO handle errors
    }
  }

  updateRule(){
      this.currentValue = null;
      this.overrideValue = null;

      if(this.filter.rule != null){
        this.currentValue = this.selectedRule().value;
      }
  }

  onCancel(){
    this.router.navigate([`/analysis/${this.analysisId}/stages/exception`])
  }

  onSubmit(){

    this.onSubmitError=null;

    let rule = this.selectedRule();
    let surface = this.selectedSurface();

    let exception = new AnalysisExceptionRule(
      null,
      this.analysisId,
      `Override "${rule.property}" property in "${surface.value}" surface (old: ${this.currentValue}, new: ${this.overrideValue})`,
      rule.id,
      rule.property,
      this.overrideValue
    );

    this.exceptionService
      .create(this.analysisId, exception)
      .then(()=> this.router.navigate([`/analysis/${this.analysisId}/stages/exception`]))
      .catch(error => this.onSubmitError=error);
  }

  private selectedRule() : RuleICAOAnnex14 {
    return this.rules.filter(r=> r.id== this.filter.rule)[0];
  }

  private selectedSurface() : ListItem{
    return this.surfaces.filter(s => s.key == this.filter.surface)[0];
  }
}
