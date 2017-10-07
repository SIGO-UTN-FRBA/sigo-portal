import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DirectionService} from './direction.service';
import {STATUS_INDICATOR} from '../commons/status-indicator';
import {RunwayDirection} from './runwayDirection';

@Component({
  selector: 'app-direction-general-view',
  template: `
    <div class="panel panel-default">
      <div class="panel-heading">
        <div class="row">
          <h3 class="panel-title panel-title-with-buttons col-md-6" i18n="@@direction.detail.section.general.title">
            General Information
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

      <div [ngSwitch]="status" class="panel-body">
  
        <div *ngSwitchCase="indicator.LOADING">
          <app-loading-indicator></app-loading-indicator>
        </div>
  
        <div *ngSwitchCase="indicator.ACTIVE" class="form container-fluid">
          <div class="row">
            <div class="col-md-6 col-sm-12 form-group">
              <label for="number" class="control-label" i18n="@@direction.detail.section.general.number">
                Direction number
              </label>
              <p class="form-control-static">{{direction.number}}</p>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 col-sm-12 form-group">
              <label for="position" class="control-label" i18n="@@direction.detail.section.general.position">
                Direction position
              </label>
              <p class="form-control-static">{{direction.position}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>      
      
  `
})

export class DirectionDetailGeneralViewComponent implements OnInit {
  @Input() airportId: number;
  @Input() runwayId: number;
  @Input() directionId: number;
  indicator;
  status: number;
  direction: RunwayDirection;
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
      .get(this.airportId, this.runwayId, this.directionId)
      .then(data => {
        this.direction = data;
        this.status = this.indicator.ACTIVE;
      });
  }

  allowEdition() {
    this.editChange.emit(true);
  }
}
