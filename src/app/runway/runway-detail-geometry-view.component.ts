import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {OlComponent} from '../olmap/ol.component';
import {STATUS_INDICATOR} from "../commons/status-indicator";
import {RunwayService} from "./runway.service";
import LineString = ol.geom.LineString;
import Map = ol.Map;

@Component({
  selector: 'app-runway-geometry-view',
  providers: [ OlComponent ],
  template: `
    <div class="panel panel-default">
      <div class="panel-heading">
        <div class="row">
          <h3 class="panel-title panel-title-with-buttons col-md-6" i18n="@@runway.detail.section.spatial.title">
            Spatial
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
        <div *ngSwitchCase="indicator.LOADING" class="container-fluid">
          <app-loading-indicator></app-loading-indicator>
        </div>

        <div *ngSwitchCase="indicator.ACTIVE">
          <form  #geometryForm="ngForm" role="form" class="form container-fluid">
            <div class="row">
              <div class="col-md-12 col-sm-12 form-group">
                <label for="inputGeoJSON" class="control-label" i18n="@@runway.detail.section.spatial.inputGeoJSON">
                  LineString
                </label>
                <textarea
                  name="inputGeoJSON"
                  [ngModel]="geomText"
                  class="form-control"
                  placeholder='{ "type": "LineString", "coordinates": [ [102.0, 0.0], ... , [104.0, 0.0] ] }'
                  rows="3"
                  readonly>
                </textarea>
              </div>
            </div>
          </form>
          <br>
          <app-map #mapRunway (map)="map"></app-map>
        </div>

        <div *ngSwitchCase="indicator.EMPTY" class="container-fluid">
          <app-empty-indicator type="definition" entity="geometry"></app-empty-indicator>
        </div>
      </div>

    </div>
  `
})

export class RunwayDetailGeometryViewComponent implements OnInit, AfterViewInit {
  map: Map;
  @Input() airportId : number;
  @Input() runwayId: number;
  private olmap: OlComponent;

  @ViewChild('mapRunway') set content(content: OlComponent) {
    this.olmap = content;
  }
  indicator;
  status : number;
  @Input() edit : boolean;
  @Output() editChange:EventEmitter<boolean> = new EventEmitter<boolean>();
  geom  : LineString;
  geomText : string;

  constructor(
    private runwayService : RunwayService
  ){

    this.indicator = STATUS_INDICATOR;
  }

  ngOnInit(): void {
    this.status = this.indicator.LOADING;

    this.runwayService
      .getGeom(this.airportId, this.runwayId)
      .then(line => {

        if(!line){
          this.status = this.indicator.EMPTY;

        } else {

          this.status = this.indicator.ACTIVE;
          this.geom = line;
          this.geomText = JSON.stringify(line);
        }
      });
  }

  ngAfterViewInit(): void {

    setTimeout(()=> this.locateGeom(),500);
  }

  allowEdition() {
    this.editChange.emit(true);
  }

  locateGeom(){

    this.olmap.addRunway(this.geom as LineString,{center: true, zoom: 15});
  }
}
