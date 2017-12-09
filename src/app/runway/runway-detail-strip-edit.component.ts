import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {RunwayStrip} from "./runwayStrip";
import {RunwayService} from "./runway.service";
import {ApiError} from "../main/apiError";
import {STATUS_INDICATOR} from "../commons/status-indicator";

@Component({
  selector: 'app-runway-strip-edit',
  template: `
    <div class="panel panel-default">
      <div class="panel-heading">
        <div class="row">
          <h3 class="panel-title panel-title-with-buttons col-md-6" i18n="@@runway.detail.section.strip.title">
            Strip
          </h3>
          <div class="clearfix"></div>
        </div>
      </div>
      <div class="panel-body" [ngSwitch]="status">
        <div *ngSwitchCase="indicator.LOADING">
          <app-loading-indicator></app-loading-indicator>
        </div>
        <div *ngSwitchCase="indicator.ERROR" class="container-fluid">
          <app-error-indicator [errors]="[onInitError]"></app-error-indicator>
        </div>
        <form  #stripForm="ngForm"
               *ngSwitchCase="indicator.ACTIVE"
               role="form"
               class="form container-fluid"
               (ngSubmit)="onSubmit()">
          
          <app-error-indicator [errors]="[onSubmitError]" *ngIf="onSubmitError"></app-error-indicator>

          <div class="row">
            <div class="col-md-6 col-sm-12 form-group">
              <label
                for="inputWidth"
                class="control-label"
                i18n="@@runway.detail.section.strip.inputWidth">
                Width
              </label>
              <div class="input-group">
                <input
                  type="number"
                  min="0"
                  step="1"
                  name="inputWidth"
                  [(ngModel)]="strip.width"
                  class="form-control"
                  placeholder="000.0"
                  required>
                <div class="input-group-addon">[m]</div>
              </div>
            </div>
            <div class="col-md-6 col-sm-12 form-group">
              <label
                for="inputLength"
                class="control-label"
                i18n="@@runway.detail.section.strip.inputLength">
                Length
              </label>
              <div class="input-group">
                <input
                  type="number"
                  min="0"
                  step="1"
                  name="inputLength"
                  class="form-control"
                  [(ngModel)]="strip.length"
                  placeholder="0000.0"
                  required>
                <div class="input-group-addon">[m]</div>
              </div>
            </div>
          </div>
          <hr>
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
                type="submit"
                [disabled]="stripForm.invalid"
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

export class RunwayDetailStripEditComponent implements OnInit {

  @Input() airportId : number;
  @Input() runwayId : number;
  @Input() edit : boolean;
  @Output() editChange:EventEmitter<boolean> = new EventEmitter<boolean>();
  indicator;
  status: number;
  onInitError: ApiError;
  onSubmitError : ApiError;
  strip:RunwayStrip;

  constructor(
    private runwayService:RunwayService
  ){
    this.indicator = STATUS_INDICATOR;
  }

  ngOnInit(): void {
    this.onInitError = null;
    this.status = STATUS_INDICATOR.LOADING;

    this.runwayService
      .getStrip(this.airportId,this.runwayId)
      .then(data => {
        this.strip = data;
        this.status = STATUS_INDICATOR.ACTIVE;
      })
      .catch(error => {
        this.onInitError = error;
        this.status = STATUS_INDICATOR.ERROR;
      })
  }

  onSubmit(){

    this.onSubmitError = null;

    this.runwayService
      .updateStrip(this.airportId, this.runwayId, this.strip)
      .then( () => this.disallowEdition() )
      .catch(error => this.onSubmitError = error);
  };

  onCancel(){
    this.disallowEdition();
  };

  disallowEdition() {
    this.editChange.emit(false);
  }

}
