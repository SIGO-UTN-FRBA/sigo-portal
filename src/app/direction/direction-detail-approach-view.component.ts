import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {DirectionService} from "./direction.service";
import {STATUS_INDICATOR} from "../commons/status-indicator";
import {RunwayApproachSection} from "./runwayApproachSection";
import {ApiError} from "../main/apiError";

@Component({
  selector: 'app-direction-approach-view',
  template: `
    <div class="panel panel-default">
      <div class="panel-heading">

        <div class="row">
          <h3 class="panel-title panel-title-with-buttons col-md-6" i18n="@@direction.detail.section.approach.title">
            Approach Section
          </h3>
          <div class="col-md-6 btn-group">
            <a
              (click)="allowEdition();"
              class="btn btn-default pull-right"
              i18n="@@commons.button.edit">
              Edit
            </a>
          </div>
          <div class="clearfix"></div>
        </div>
      </div>
      <div class="panel-body" [ngSwitch]="status">

        <div *ngSwitchCase="indicator.LOADING" class="container-fluid">
          <app-loading-indicator></app-loading-indicator>
        </div>
        <div *ngSwitchCase="indicator.ERROR" class="container-fluid">
          <app-error-indicator [errors]="[onInitError]"></app-error-indicator>
        </div>
        <div *ngSwitchCase="indicator.ACTIVE" class="form container-fluid">

          <div class="row">
            <div class="col-md-6 col-sm-12 form-group">
              <label class="control-label" i18n="@@direction.detail.section.approach.enabled">
                Enabled
              </label>
              <p class="form-control-static">{{(section.enabled) ? 'True' : 'False'}}</p>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 col-sm-12 form-group">
              <label class="control-label" i18n="@@direction.detail.section.approach.thresholdLength">
                Threshold length
              </label>
              <p class="form-control-static">{{section.thresholdLength}} [m]</p>
            </div>
            <div class="col-md-6 col-sm-12 form-group">
              <label class="control-label" i18n="@@direction.detail.section.approach.thresholdElevation">
                Threshold elevation
              </label>
              <p class="form-control-static">{{section.thresholdElevation}} [m]</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})


export class DirectionDetailApproachViewComponent implements OnInit {
  @Input() airportId: number;
  @Input() runwayId: number;
  @Input() directionId: number;
  indicator;
  status: number;
  section: RunwayApproachSection;
  @Input() edit: boolean;
  @Output() editChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  onInitError : ApiError;

  constructor(
    private directionService: DirectionService
  ){
    this.indicator = STATUS_INDICATOR;
  }

  ngOnInit(): void {

    this.onInitError = null;

    this.status = STATUS_INDICATOR.LOADING;

    this.directionService
      .getApproachSection(this.airportId, this.runwayId, this.directionId)
      .then(data => {
        this.section = data;
        this.status = STATUS_INDICATOR.ACTIVE;
      })
      .catch(error => {
        this.onInitError = error;
        this.status = STATUS_INDICATOR.ERROR;
      });
  }

  allowEdition() {
    this.editChange.emit(true);
  }
}

