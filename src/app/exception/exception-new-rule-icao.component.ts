import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {RegulationIcaoService} from "../regulation/regulation-icao.service";
import {AppError} from "../main/ierror";
import {STATUS_INDICATOR} from "../commons/status-indicator";
import {RuleICAOAnnex14} from "../regulation/ruleICAO";
import {ListItem} from "../commons/listItem";
import {AnalysisExceptionRule} from "./analysisExceptionRule";
import {RunwayDirection} from "../direction/runwayDirection";
import {AnalysisService} from "../analysis/analysis.service";
import {RunwayService} from "../runway/runway.service";
import {DirectionService} from "../direction/direction.service";
import {Runway} from "../runway/runway";
import {DirectionClassificationService} from "../direction/direction-classification.service";
import {RunwayClassificationICAOAnnex14} from "../direction/runwayClassification";
import {AnalysisExceptionRuleService} from './exception-rule.service';

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
                for="inputDirection"
                class="control-label"
                i18n="@@exception.rule.detail.section.general.inputDirection">
                Direction
              </label>
              <select
                name="inputDirection"
                class="form-control"
                [(ngModel)]="filter.direction"
                (ngModelChange)="updateSurfaces()"
                required>
                <option *ngFor="let direction of directions" [value]="direction.id">
                  {{direction.name}}
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
                  {{rule.propertyName}}
                </option>
              </select>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 col-sm-12 form-group">
              <label
                for="inputDefaultValue"
                class="control-label"
                i18n="@@exception.rule.detail.section.general.inputDefaultValue">
                Value
              </label>
              <input type="number"
                     name="inputDefaultValue"
                     class="form-control"
                     disabled="true"
                     [(ngModel)]="defaultValue"
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
                     [disabled]="!defaultValue"
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
  filter:{direction:number, surface:number, rule:number};
  surfaces:ListItem[];
  rules:RuleICAOAnnex14[];
  properties:string[];
  defaultValue: any;
  overrideValue: any;
  airportId:number;
  runways:Runway[];
  directions:RunwayDirection[];
  private classification: RunwayClassificationICAOAnnex14;

  constructor(
    private analysisService: AnalysisService,
    private runwayService: RunwayService,
    private directionService: DirectionService,
    private classificationService: DirectionClassificationService,
    private exceptionService: AnalysisExceptionRuleService,
    private regulationService: RegulationIcaoService,
    private route: ActivatedRoute,
    private router: Router
  ){
    this.indicator=STATUS_INDICATOR;
  }

  ngOnInit(): void {

    this.initializeFilters();

    this.onInitStatus=STATUS_INDICATOR.LOADING;
    this.onInitError=null;
    this.defaultValue=null;

    this.surfaces = [];
    this.properties = [];

    this.analysisId = this.route.parent.parent.snapshot.params['analysisId'];

    this.analysisService.get(this.analysisId)
      .then(data => {
        this.airportId = data.airportId;
        return this.runwayService.list(this.airportId);
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
      .then(()=>
        this.directions =
          this.runways.map( r => r.directions)
            .reduce((a,b)=> a.concat(b), [])
      )
      .then(()=> this.onInitStatus=STATUS_INDICATOR.ACTIVE)
      .catch(error => {
        this.onInitError=error;
        this.onInitStatus=STATUS_INDICATOR.ERROR;
      })
  }

  private initializeFilters() {
    this.filter={direction: null, surface: null, rule: null};
  }

  updateSurfaces() {
    this.surfaces=[];
    this.filter.surface=null;
    this.updateProperties();

    if(this.filter.direction !== null){
      let direction = this.selectedDirection();

      this.classificationService.get(this.airportId, direction.runwayId, direction.id)
        .then( data => {
          this.classification = data as RunwayClassificationICAOAnnex14;
          return this.regulationService.searchSurfaces(this.classification.runwayClassification, this.classification.runwayCategory, this.classification.runwayTypeNumber);
        })
        .then(data => this.surfaces = data); //TODO handle errors
    }
  }

  updateProperties() {
    this.properties = [];
    this.filter.rule=null;
    this.updateRule();

    if(this.filter.surface != null){
      this.regulationService
        .getRules(this.filter.surface, this.classification.runwayClassification, this.classification.runwayCategory, this.classification.runwayTypeNumber)
        .then(data => this.rules = data) //TODO handle errors
    }
  }

  updateRule(){
      this.defaultValue = null;
      this.overrideValue = null;

      if(this.filter.rule != null){
        this.defaultValue = this.selectedRule().value;
      }
  }

  onCancel(){
    return this.router.navigate([`/analysis/${this.analysisId}/stages/exception`])
  }

  onSubmit(){

    this.onSubmitError=null;

    let rule = this.selectedRule();
    let surface = this.selectedSurface();
    let direction = this.selectedDirection();

    let exception = new AnalysisExceptionRule(
      null,
      this.analysisId,
      `Override "${rule.propertyName}" property in "${surface.value}" surface for runway ${direction.name} (old: ${this.defaultValue}, new: ${this.overrideValue})`,
      rule.id,
      this.overrideValue,
      0,
      direction.id
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

  private selectedDirection() : RunwayDirection {
    return this.directions.filter(d => d.id == this.filter.direction)[0];
  }
}
