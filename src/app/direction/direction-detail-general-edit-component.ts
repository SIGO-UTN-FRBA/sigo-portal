///<reference path="direction.service.ts"/>
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DirectionService} from './direction.service';
import {RunwayDirection} from './runwayDirection';
import {STATUS_INDICATOR} from "../commons/status-indicator";
import {RunwayDirectionPosition} from "./runwayDirectionPosition";
import {DirectionCatalogService} from "./direction-catalog.service";

@Component({
  selector: 'app-direction-general-edit',
  template: `    
    <div class="panel panel-default">
    <div class="panel-heading">
      <h3 class="panel-title" i18n="@@direction.detail.section.general.title">
        General Information
      </h3>
    </div>
    <div class="panel-body">
      <form #directionForm="ngForm" role="form" class="form container-fluid" (ngSubmit)="onSubmit()">
        <div class="row">
          <div class="col-md-6 col-sm-12 form-group">
            <label
              for="number"
              class="control-label"
              i18n="@@direction.detail.section.general.number">
              Direction number
            </label>
            <input
              type="number"
              class="form-control"
              name="quantity"
              min="1"
              max="36"
              length="2"
              [(ngModel)]="direction.number"
              required>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 col-sm-12 form-group">
            <label
              for="position"
              class="control-label"
              i18n="@@direction.detail.section.general.position">
              Direction position
            </label>
            <select
              name="inputSurface"
              [(ngModel)]="direction.position"
              class="form-control"
              required>
              <option *ngFor="let position of positions" [value]="position.id">
                {{position.id}} - {{position.code}}
              </option>
            </select>
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
              [disabled]="directionForm.invalid"
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

export class DirectionDetailGeneralEditComponent implements OnInit {

  status: number;
  indicator;
  @Input() airportId: number;
  @Input() runwayId: number;
  @Input() directionId: number;
  direction: RunwayDirection;
  @Input() edit: boolean;
  @Output() editChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  positions : RunwayDirectionPosition[];


  constructor(
    private directionService : DirectionService,
    private catalogService : DirectionCatalogService
  ){
    this.direction = new RunwayDirection();
    this.positions = [];
    this.indicator = STATUS_INDICATOR;
  }

  ngOnInit(): void {

    this.status = this.indicator.LOADING;

    let p1 = this.catalogService
      .listPositions()
      .then(data => this.positions = data);

    let p2 = this.directionService
      .get(this.airportId, this.runwayId, this.directionId)
      .then( data => this.direction = data);

    Promise.all([p1, p2])
      .then(r => this.status = this.indicator.ACTIVE);

  }

  onSubmit(){
    this.directionService
      .update(this.airportId, this.runwayId, this.direction)
      .then( () => this.disallowEdition() );
  };

  onCancel(){
    this.disallowEdition();
  };

  disallowEdition() {
    this.editChange.emit(false);
  }
}
