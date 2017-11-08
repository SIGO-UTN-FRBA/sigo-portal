import {
  AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild
} from "@angular/core";
import {STATUS_INDICATOR} from "../commons/status-indicator";
import Point = ol.geom.Point;
import Map = ol.Map;
import {OlComponent} from "../olmap/ol.component";
import {DirectionService} from "./direction.service";
import {ApiError} from "../main/apiError";
import Polygon = ol.geom.Polygon;
import {DirectionDistancesService} from "./direction-distances.service";
import {Subscription} from "rxjs/Subscription";
import {RunwayService} from "../runway/runway.service";

@Component({
  selector: 'app-direction-geometry-view',
  providers: [ OlComponent ],
  template: `
    <div class="panel panel-default">
      <div class="panel-heading">
        <div class="row">
          <h3 class="panel-title panel-title-with-buttons col-md-6" i18n="@@direction.detail.section.spatial.title">
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
        <div *ngSwitchCase="indicator.ERROR" class="container-fluid">
          <app-error-indicator [error]="onInitError"></app-error-indicator>
        </div>
        <div *ngSwitchCase="indicator.ACTIVE">
          <div class="form container-fluid">
            <div class="row">
              <div class="col-md-12 col-sm-12 form-group">
                <label for="inputGeoJSON" class="control-label" i18n="@@direction.detail.section.spatial.inputGeoJSON">
                  Point
                </label>
                <p class="form-control-static">{{geomText}}</p>
              </div>
            </div>
          </div>
          <br>
          <app-map #mapDirection (map)="map"></app-map>
        </div>
        
        <div *ngSwitchCase="indicator.EMPTY" class="container-fluid">
          <app-empty-indicator type="definition" entity="point"></app-empty-indicator>
        </div>
      </div>
      
    </div>
  `
})

export class DirectionDetailGeometryViewComponent implements OnInit, AfterViewInit, OnDestroy{

  @Input() airportId : number;
  @Input() runwayId : number;
  @Input() directionId : number;
  map: Map;
  private olmap: OlComponent;
  onInitError: ApiError;
  @ViewChild('mapDirection') set content(content: OlComponent) {
    this.olmap = content;
  }
  indicator;
  status : number;
  @Input() edit : boolean;
  @Output() editChange:EventEmitter<boolean> = new EventEmitter<boolean>();
  geom  : Point;
  geomText : string;
  thresholdGeom : Polygon;
  stopwayGeom : Polygon;
  clearwayGeom : Polygon;
  runwayGeom : Polygon;
  subscription: Subscription;

  constructor(
    private directionService : DirectionService,
    private distancesService : DirectionDistancesService,
    private runwayService : RunwayService
  ){
    this.geom = null;
    this.indicator = STATUS_INDICATOR;

    this.subscription = this.distancesService.lengthUpdated$.subscribe(
      () => this.loadGeometries()
        .then(()=> this.olmap.clearDirectionLayer())
        .then(()=> this.olmap.clearDisplacedThresholdLayer())
        .then(()=> this.olmap.getStopwayLayer())
        .then(()=> this.olmap.getClearwayLayer())
        .then(()=> this.locateGeometries())
    );
  }

  ngOnInit(): void {
    this.status = STATUS_INDICATOR.LOADING;
    this.geom = null;
    this.onInitError = null;

    this.loadGeometries()
      .then(() => {
        if(this.geom != null)
          this.status = STATUS_INDICATOR.ACTIVE;
        else
          this.status = STATUS_INDICATOR.EMPTY;
      })
      .catch(error => {
        this.onInitError = error;
        this.status = STATUS_INDICATOR.ERROR;
      })
  }

  private loadGeometries() : Promise<any> {

    return this.directionService
      .getGeom(this.airportId, this.runwayId, this.directionId)
      .then(point => {

        if(point != null){
          this.geom = point;
          this.geomText = JSON.stringify(point);
        }

        return point;
      })
      .then(() => {

        if(this.geom != null)
          return this.directionService
            .getDisplacedThresholdGeom(this.airportId, this.runwayId, this.directionId);
        else
          return null;

      })
      .then(polygon => this.thresholdGeom = polygon)
      .then(()=> {
        if(this.geom != null)
          return this.directionService
            .getStopwayGeom(this.airportId, this.runwayId, this.directionId);
        else
          return null;
      })
      .then(polygon => this.stopwayGeom = polygon)
      .then(()=> {
        if(this.geom != null)
          return this.directionService
            .getClearwayGeom(this.airportId, this.runwayId, this.directionId);
        else
          return null;
      })
      .then(polygon => this.clearwayGeom = polygon)
      .then(()=> this.runwayService.getGeom(this.airportId, this.runwayId))
      .then(polygon => this.runwayGeom = polygon)
      .catch(error => Promise.reject(error));
  }

  ngAfterViewInit(): void {
    setTimeout(()=> {if(this.geom) this.locateGeometries()},1500);
  }

  allowEdition() {
    this.editChange.emit(true);
  }

  private locateGeometries(){
      this.olmap
        .addRunway(this.runwayGeom, {id: this.runwayId, name: ""},{center: true, zoom: 14})
        .addThreshold(this.thresholdGeom)
        .addDirection(this.geom)
        .addClearway(this.clearwayGeom)
        .addStopway(this.stopwayGeom);
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }
}
