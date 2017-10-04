import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {AirportService} from "./airport.service";
import {ActivatedRoute} from "@angular/router";
import Point = ol.geom.Point;

@Component({
  selector: 'app-airport-geometry-edit',
  template: `
    <div class="panel panel-default">
      <div class="panel-heading">
        <div class="row">
          <h3 class="panel-title panel-title-with-buttons col-md-6" i18n="@@airport.detail.section.spatial.title">
            Spatial
          </h3>
          <div class="clearfix"></div>
        </div>
      </div>

      <div class="panel-body">
        <form  #geometryForm="ngForm" role="form" class="form container-fluid" (ngSubmit)="onSubmit()">
          <div class="row">
            <div class="col-md-12 col-sm-12 form-group">
              <label for="inputGeoJSON" class="control-label" i18n="@@airport.detail.section.spatial.inputGeoJSON">
                Point
              </label>
              <textarea
                name="inputGeoJSON"
                [(ngModel)]="geomText"
                class="form-control"
                placeholder='{ "type": "Point", "coordinates": [0.0, 0.0] }'
                rows="3"
                required>
              </textarea>
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
                [disabled]="geometryForm.invalid"
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

export class AirportDetailGeometryEditComponent implements OnInit{
  geomText : string;
  airportId : number;
  @Input() edit : boolean;
  @Output() editChange:EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private route : ActivatedRoute,
    private airportService : AirportService
  ){}

  ngOnInit(): void {

    this.airportId = +this.route.snapshot.params['airportId'];

    this.airportService
      .getGeom(this.airportId)
      .then( data => this.geomText = JSON.stringify(data))
  }

  onSubmit(){

    let point : Point = JSON.parse(this.geomText) as Point;

    this.airportService
      .saveGeom(this.airportId, point)
      .then( () => this.disallowEdition() );
  };

  onCancel(){
    this.disallowEdition();
  };

  disallowEdition() {
    this.editChange.emit(false);
  }
}
