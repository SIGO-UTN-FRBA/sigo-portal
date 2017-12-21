import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {AppError} from "../main/ierror";
import {STATUS_INDICATOR} from "../commons/status-indicator";
import {AnalysisExceptionService} from "./analysis-exception.service";
import {RuleICAOAnnex14} from "../regulation/ruleICAO";
import {AnalysisExceptionRule} from "./analysisExceptionRule";
import {RegulationIcaoService} from "../regulation/regulation-icao.service";
import {RunwayDirection} from "../direction/runwayDirection";
import {DirectionService} from "../direction/direction.service";

@Component({
  selector: 'app-exception-rule-general-view',
  template:`
    <div class="panel panel-default">
      <div class="panel-heading">
        <div class="row">
          <h3 class="panel-title panel-title-with-buttons col-md-6" i18n="@@exception.rule.detail.section.general.title">
            General
          </h3>
          <div class="col-md-6">
            <div class="pull-right">
              <div class="btn-group">
                <button
                  (click)="onDelete();"
                  class="btn btn-default"
                  i18n="@@commons.button.delete">
                  Delete
                </button>
              </div>
              <div class="btn-group">
                <button
                  (click)="allowEdition();"
                  class="btn btn-default"
                  i18n="@@commons.button.edit">
                  Edit
                </button>
              </div>
            </div>
          </div>
          <div class="clearfix"></div>
        </div>
      </div>
      <div [ngSwitch]="onInitStatus" class="panel-body">
        <div *ngSwitchCase="indicator.LOADING">
          <app-loading-indicator></app-loading-indicator>
        </div>
        <div *ngSwitchCase="indicator.ERROR" class="container-fluid">
          <app-error-indicator [errors]="[onInitError]"></app-error-indicator>
        </div>
        <div *ngSwitchCase="indicator.ACTIVE" class="form container-fluid">
          <div class="row">
            <div class="col-md-12 col-sm-12 form-group">
              <label class="control-label" i18n="@@exception.rule.detail.section.general.inputDirection">
                Direction
              </label>
              <p class="form-control-static">{{direction.name}}</p>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12 col-sm-12 form-group">
              <label class="control-label" i18n="@@exception.rule.detail.section.general.inputSurface">
                Surface
              </label>
              <p class="form-control-static">{{surface}}</p>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12 col-sm-12 form-group">
              <label class="control-label" i18n="@@exception.rule.detail.section.general.inputProperty">
                Property
              </label>
              <p class="form-control-static">{{property}}</p>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 col-sm-12 form-group">
              <label class="control-label" i18n="@@exception.rule.detail.section.general.inputCurrentValue">
                Value
              </label>
              <p class="form-control-static">{{defaultValue}}</p>
            </div>
            <div class="col-md-6 col-sm-12 form-group">
              <label class="control-label" i18n="@@exception.rule.detail.section.general.inputOverrideValue">
                Override Value
              </label>
              <p class="form-control-static">{{overrideValue}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>`
})

export class ExceptionDetailRuleIcaoView implements OnInit {
  onInitStatus:number;
  indicator;
  onInitError:AppError;
  @Input() edit:boolean;
  @Output() editChange:EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() exceptionId:number;
  @Input() analysisId:number;
  exception:AnalysisExceptionRule;
  rule:RuleICAOAnnex14;
  defaultValue: number;
  overrideValue: number;
  property: string;
  surface: string;
  direction: RunwayDirection;

  constructor(
    private exceptionService:AnalysisExceptionService,
    private regulationService:RegulationIcaoService,
    private directionService: DirectionService
  ){
    this.indicator=STATUS_INDICATOR;
  }

  ngOnInit(): void {

      this.onInitStatus=STATUS_INDICATOR.LOADING;
      this.onInitError =null;

      this.exceptionService
        .get(this.analysisId, this.exceptionId)
        .then(data => {
          this.exception = data as AnalysisExceptionRule;
          this.overrideValue =  this.exception.value;
        })
        .then( ()=> this.directionService.get(1,1,this.exception.directionId))
        .then(data => this.direction = data)
        .then(()=> this.regulationService.getRule(this.exception.ruleId))
        .then(data => {
          this.rule = data;
          this.defaultValue = this.rule.value;
          this.property = this.rule.propertyName;
        })
        .then(()=> this.regulationService.listICAOAnnex14Surfaces())
        .then(data => this.surface = data[this.rule.surface].value)
        .then(()=> this.onInitStatus=STATUS_INDICATOR.ACTIVE)
        .catch(error => {
          this.onInitError = error;
          this.onInitStatus = STATUS_INDICATOR.ERROR;
        })
  }

  onDelete(){
      //TODO
  }

  allowEdition(){
    this.editChange.emit(true);
  }
}
