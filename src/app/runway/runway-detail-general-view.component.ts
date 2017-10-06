import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {RunwayService} from "./runway.service";
import {Runway} from "./runway";
import {RunwaySurface} from "./runwaySurface";
import {RunwayCatalogService} from "./runway-catalog.service";
import {STATUS_INDICATOR} from "../commons/status-indicator";

@Component({
  selector: 'app-runway-general-view',
  template:`
    <div class="panel panel-default">
      <div class="panel-heading">
        <div class="row">
          <h3 class="panel-title panel-title-with-buttons col-md-6" i18n="@@runway.detail.section.general.title">
            General
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
            <div class="col-md-12 col-sm-12 form-group">
              <label
                for="inputName"
                class="control-label"
                i18n="@@ruwnay.detail.section.general.inputName">
                Name
              </label>
              <p class="form-control-static">{{runway.name}}</p>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 col-sm-12 form-group">
              <label
                for="inputWidth"
                class="control-label"
                i18n="@@runway.detail.section.general.inputWidth">
                Width
              </label>
              <p class="form-control-static">{{runway.width}} [m]</p>
            </div>
            <div class="col-md-6 col-sm-12 form-group">
              <label
                for="inputLength"
                class="control-label"
                i18n="@@runway.detail.section.general.inputLength">
                Length
              </label>
              <p class="form-control-static">{{runway.length}} [m]</p>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12 col-sm-12 form-group">
              <label
                for="inputSurface"
                class="control-label"
                i18n="@@ruwnay.detail.section.general.inputSurface">
                Surface
              </label>
              <p class="form-control-static">{{surfaces[runway.surfaceId - 1].code + ' - ' + surfaces[runway.surfaceId -1].name}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})

export class RunwayDetailGeneralViewComponent implements OnInit{
  @Input() airportId : number;
  @Input() runwayId: number;
  @Input() edit : boolean;
  @Output() editChange : EventEmitter<boolean> = new EventEmitter<boolean>();
  runway : Runway;
  surfaces : RunwaySurface[];
  indicator;
  status : number;

  constructor(
    private runwayService : RunwayService,
    private catalogService : RunwayCatalogService
  ){
    this.runway = new Runway();
    this.surfaces = [];
    this.indicator = STATUS_INDICATOR;
  }

  ngOnInit(): void {

    this.status = this.indicator.LOADING;

    let p1 = this.catalogService
      .listSurfaces()
      .then(data => this.surfaces = data);

    let p2 = this.runwayService
      .get(this.airportId, this.runwayId)
      .then(data => {
        this.runway = data;
      });

    Promise.all([p1, p2])
      .then(r => this.status = this.indicator.ACTIVE);
  }

  allowEdition(){
    this.editChange.emit(true);
  }
}
