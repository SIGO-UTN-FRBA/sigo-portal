import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {ApiError} from "../main/apiError";
import {STATUS_INDICATOR} from "../commons/status-indicator";
import {RunwayStrip} from "./runwayStrip";
import {DirectionService} from "./direction.service";

@Component({
  selector: 'app-runway-strip-view',
  template: `
    <div class="panel panel-default">
      <div class="panel-heading">
        <div class="row">
          <h3 class="panel-title panel-title-with-buttons col-md-6" i18n="@@runway.detail.section.strip.title">
            Strip
          </h3>
          <div class="col-md-6">
            <div class="pull-right">
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

      <div [ngSwitch]="status" class="panel-body">
        <div *ngSwitchCase="indicator.LOADING">
          <app-loading-indicator></app-loading-indicator>
        </div>
        <div *ngSwitchCase="indicator.ERROR">
          <app-error-indicator [errors]="[onInitError]"></app-error-indicator>
        </div>
        <div *ngSwitchCase="indicator.ACTIVE" class="form container-fluid">
          <div class="row">
            <div class="col-md-6 col-sm-12 form-group">
              <label
                for="inputWidth"
                class="control-label"
                i18n="@@ruwnay.detail.section.strip.inputWidth">
                Width
              </label>
              <p class="form-control-static">{{strip.width}} [m]</p>
            </div>
            <div class="col-md-6 col-sm-12 form-group">
              <label
                for="inputLength"
                class="control-label"
                i18n="@@ruwnay.detail.section.strip.inputLength">
                Length
              </label>
              <p class="form-control-static">{{strip.length}} [m]</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})

export class DirectionDetailStripViewComponent implements OnInit {

  @Input() airportId : number;
  @Input() runwayId: number;
  @Input() directionId: number;
  @Input() edit : boolean;
  @Output() editChange : EventEmitter<boolean> = new EventEmitter<boolean>();
  indicator;
  status : number;
  onInitError : ApiError;
  strip:RunwayStrip;

  constructor(
    private directionService:DirectionService
  ){
    this.indicator = STATUS_INDICATOR;
  }

  ngOnInit(): void {
    this.onInitError = null;
    this.status = STATUS_INDICATOR.LOADING;

    this.directionService
      .getStrip(this.airportId,this.runwayId, this.directionId)
      .then(data => {
        this.strip = data;
        this.status = STATUS_INDICATOR.ACTIVE;
      })
      .catch(error => {
        this.onInitError = error;
        this.status = STATUS_INDICATOR.ERROR;
      })
  }

  allowEdition(){
    this.editChange.emit(true);
  }

}
