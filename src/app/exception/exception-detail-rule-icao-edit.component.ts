import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AppError} from '../main/ierror';
import {AnalysisExceptionRule} from './analysisExceptionRule';
import {RuleICAOAnnex14} from '../regulation/ruleICAO';
import {RunwayDirection} from '../direction/runwayDirection';
import {AnalysisExceptionRuleService} from './exception-rule.service';
import {RegulationIcaoService} from '../regulation/regulation-icao.service';
import {STATUS_INDICATOR} from '../commons/status-indicator';
import {DirectionService} from '../direction/direction.service';

@Component({
  selector: 'app-exception-rule-general-edit',
  template:`
    <div class="panel panel-default">
      <div class="panel-heading">
        <h3 class="panel-title" 
            i18n="@@exception.rule.detail.section.general.title"
        >
          General
        </h3>
      </div>
      
      <div [ngSwitch]="onInitStatus" class="panel-body">
        <div *ngSwitchCase="indicator.LOADING">
          <app-loading-indicator></app-loading-indicator>
        </div>
        <div *ngSwitchCase="indicator.ERROR" class="container-fluid">
          <app-error-indicator [errors]="[onInitError]"></app-error-indicator>
        </div>
        <form #exceptionForm="ngForm"
              *ngSwitchCase="indicator.ACTIVE"
              role="form"
              class="form container-fluid"
              (ngSubmit)="onSubmit()"
        >
          <app-error-indicator [errors]="[onSubmitError]" *ngIf="onSubmitError"></app-error-indicator>

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
              <label class="control-label"
                     for="inputOverrideValue"
                     i18n="@@exception.rule.detail.section.general.inputOverrideValue">
                Override Value
              </label>
              <input type="number"
                     name="inputOverrideValue"
                     [(ngModel)]="exception.value"
                     class="form-control"
                     required
              />
            </div>
          </div>
          <hr>
          <div class="row">
            <div class="pull-right">
              <button
                (click)="onCancel()"
                type="button"
                class="btn btn-default"
                i18n="@@commons.button.cancel">
                Cancel
              </button>
              <button
                type="submit"
                [disabled]="exceptionForm.invalid"
                class="btn btn-success"
                i18n="@@commons.button.save">
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  `
})

export class ExceptionDetailRuleIcaoEditComponent implements OnInit {
  onInitStatus:number;
  indicator;
  onInitError: AppError;
  onSubmitError: AppError;
  exception:AnalysisExceptionRule;
  rule:RuleICAOAnnex14;
  defaultValue: number;
  property: string;
  surface: string;
  direction: RunwayDirection;
  @Input() edit:boolean;
  @Output() editChange:EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() exceptionId:number;
  @Input() analysisId:number;

  constructor(
    private exceptionService: AnalysisExceptionRuleService,
    private regulationService: RegulationIcaoService,
    private directionService: DirectionService
  ){
    this.indicator=STATUS_INDICATOR;
  }


  ngOnInit(): void {
    this.onInitStatus=STATUS_INDICATOR.LOADING;
    this.onInitError =null;

    this.exceptionService
      .get(this.analysisId, this.exceptionId)
      .then(data => this.exception = data as AnalysisExceptionRule)
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

  onSubmit(){
    this.exceptionService
      .update(this.analysisId, this.exception)
      .then( () => this.disallowEdition() )
      .catch(error => this.onSubmitError = error);
  }

  onCancel(){
    this.disallowEdition();
  };

  disallowEdition() {
    this.editChange.emit(false);
  }
}
