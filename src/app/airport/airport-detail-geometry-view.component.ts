import {
  AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from "@angular/core";
import {STATUS_INDICATOR} from "../commons/status-indicator";
import {AirportService} from "./airport.service";
import {ActivatedRoute} from "@angular/router";
import Point = ol.geom.Point;
import Map = ol.Map;
import {OlComponent} from "../olmap/ol.component";

@Component({
  selector: 'app-airport-geometry-view',
  providers: [ OlComponent ],
  template: `
    <div class="panel panel-default">
      <div class="panel-heading">
        <div class="row">
          <h3 class="panel-title panel-title-with-buttons col-md-6" i18n="@@airport.detail.section.spatial.title">
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
                <label for="inputGeoJSON" class="control-label" i18n="@@airport.detail.section.spatial.inputGeoJSON">
                  Point
                </label>
                <textarea 
                  name="inputGeoJSON"
                  [ngModel]="geomText"
                  class="form-control"
                  placeholder='{ "type": "Point", "coordinates": [0.0, 0.0] }'
                  rows="3"
                  readonly>
                </textarea>
              </div>
            </div>
          </form>
          <br>
          <app-map #mapAirport (map)="map"></app-map>
        </div>
        
        <div *ngSwitchCase="indicator.EMPTY" class="container-fluid">
          <app-empty-indicator type="definition" entity="point"></app-empty-indicator>
        </div>
      </div>
      
    </div>
  `
})

export class AirportDetailGeometryViewComponent implements OnInit, AfterViewInit{

  map: Map;
  private olmap: OlComponent;

  @ViewChild('mapAirport') set content(content: OlComponent) {
    this.olmap = content;
  }
  indicator;
  status : number;
  @Input() edit : boolean;
  @Output() editChange:EventEmitter<boolean> = new EventEmitter<boolean>();
  geom  : Point;
  geomText : string;

  constructor(
    private airportService : AirportService,
    private route : ActivatedRoute
  ){

    this.indicator = STATUS_INDICATOR;
  }

  ngOnInit(): void {
    this.status = this.indicator.LOADING;

    let airportId : number = +this.route.snapshot.params['airportId'];

    this.airportService
      .getGeom(airportId)
      .then(point => {

        if(!point){
          this.status = this.indicator.EMPTY;

        } else {

          this.status = this.indicator.ACTIVE;
          this.geom = point;
          this.geomText = JSON.stringify(point);
        }
      });
  }

  ngAfterViewInit(): void {

      setTimeout(()=> {
        this.locateGeom();
      },
      500
      );

  }

  allowEdition() {
    this.editChange.emit(true);
  }

  locateGeom(){

    this.olmap.addAirport(this.geom['coordinates'], {center: true, zoom: 12});
  }
}
