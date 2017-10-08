import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import Point = ol.geom.Point;
import {DirectionService} from "./direction.service";

@Component({
  selector: 'app-direction-geometry-edit',
  template: `
    <div class="panel panel-default">
      <div class="panel-heading">
        <div class="row">
          <h3 class="panel-title panel-title-with-buttons col-md-6" i18n="@@direction.detail.section.spatial.title">
            Spatial
          </h3>
          <div class="clearfix"></div>
        </div>
      </div>

      <div class="panel-body">
        <form  #geometryForm="ngForm" role="form" class="form container-fluid" (ngSubmit)="onSubmit()">
          <div class="row">
            <div class="col-md-12 col-sm-12 form-group">
              <label for="inputGeoJSON" class="control-label" i18n="@@direction.detail.section.spatial.inputGeoJSON">
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

export class DirectionDetailGeometryEditComponent implements OnInit{
  geomText : string;
  @Input() airportId: number;
  @Input() runwayId: number;
  @Input() directionId: number;
  @Input() edit : boolean;
  @Output() editChange:EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private directionService : DirectionService
  ){}

  ngOnInit(): void {

    this.directionService
      .getGeom(this.airportId, this.runwayId, this.directionId)
      .then( data => this.geomText = JSON.stringify(data))
  }

  onSubmit(){

    let point : Point = JSON.parse(this.geomText) as Point;

    this.directionService
      .saveGeom(this.airportId, this.runwayId, this.directionId, point)
      .then( () => this.disallowEdition() );
  };

  onCancel(){
    this.disallowEdition();
  };

  disallowEdition() {
    this.editChange.emit(false);
  }
}
