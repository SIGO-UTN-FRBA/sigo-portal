import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {DirectionService} from "./direction.service";
import {STATUS_INDICATOR} from "../commons/status-indicator";
import {RunwayTakeoffSection} from "./runwayTakeoffSection";


@Component({
  selector: 'app-direction-takeoff-view',
  template: `
    <div class="panel panel-default">
      <div class="panel-heading">
        <div class="row">
          <h3 class="panel-title panel-title-with-buttons col-md-6" i18n="@@direction.detail.section.takeoff.title">
            Take-off Section
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

        <div *ngSwitchCase="indicator.LOADING">
          <app-loading-indicator></app-loading-indicator>
        </div>

        <div *ngSwitchCase="indicator.ACTIVE" class="form container-fluid">
          <div class="row">
            <div class="col-md-6 col-sm-12 form-group">
              <label class="control-label" i18n="@@direction.detail.section.takeoff.enabled">
                Enabled
              </label>
              <p class="form-control-static">{{(section.enabled) ? 'True' : 'False'}}</p>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 col-sm-12 form-group">
              <label class="control-label" i18n="@@direction.detail.section.takeoff.clearwayLength">
                Clearway length
              </label>
              <p class="form-control-static">{{section.clearwayLength}} [m]</p>
            </div>
            <div class="col-md-6 col-sm-12 form-group">
              <label class="control-label" i18n="@@direction.detail.section.takeoff.clearwayWidth">
                Clearway width
              </label>
              <p class="form-control-static">{{section.clearwayWidth}} [m]</p>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12 col-sm-12 form-group">
              <label class="control-label" i18n="@@direction.detail.section.takeoff.stopwayLength">
                Stopway length
              </label>
              <p class="form-control-static">{{section.stopwayLength}} [m]</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})


export class DirectionDetailTakeoffViewComponent implements OnInit {
  @Input() airportId: number;
  @Input() runwayId: number;
  @Input() directionId: number;
  indicator;
  status: number;
  section: RunwayTakeoffSection;
  @Input() edit: boolean;
  @Output() editChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private directionService: DirectionService
  ){
    this.indicator = STATUS_INDICATOR;
  }

  ngOnInit(): void {

    this.status = this.indicator.LOADING;

    this.directionService
      .getTakeoffSection(this.airportId, this.runwayId, this.directionId)
      .then(data => {
        this.section = data;
        this.status = this.indicator.ACTIVE;
      });
  }

  allowEdition() {
    this.editChange.emit(true);
  }
}

