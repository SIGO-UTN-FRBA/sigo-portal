import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {RunwayService} from "./runway.service";
import LineString = ol.geom.LineString;

@Component({
  selector: 'app-runway-geometry-edit',
  template: `
    <div class="panel panel-default">
      <div class="panel-heading">
        <div class="row">
          <h3 class="panel-title panel-title-with-buttons col-md-6" i18n="@@runway.detail.section.spatial.title">
            Spatial
          </h3>
          <div class="clearfix"></div>
        </div>
      </div>

      <div class="panel-body">
        <form  #geometryForm="ngForm" role="form" class="form container-fluid" (ngSubmit)="onSubmit()">
          <div class="row">
            <div class="col-md-12 col-sm-12 form-group">
              <label for="inputGeoJSON" class="control-label" i18n="@@runway.detail.section.spatial.inputGeoJSON">
                LineString
              </label>
              <textarea
                name="inputGeoJSON"
                [(ngModel)]="geomText"
                class="form-control"
                placeholder='{"type":"LineString","coordinates":[[100.0,0.0],[101.0,1.0]]}'
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

export class RunwayDetailGeometryEditComponent implements OnInit{
  geomText : string;
  @Input() airportId : number;
  @Input() runwayId : number;
  @Input() edit : boolean;
  @Output() editChange:EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private runwayService : RunwayService
  ){}

  ngOnInit(): void {

    this.runwayService
      .getGeom(this.airportId, this.runwayId)
      .then( data => this.geomText = JSON.stringify(data))
  }

  onSubmit(){

    let line : LineString = JSON.parse(this.geomText) as LineString;

    this.runwayService
      .saveGeom(this.airportId, this.runwayId, line)
      .then( () => this.disallowEdition() );
  };

  onCancel(){
    this.disallowEdition();
  };

  disallowEdition() {
    this.editChange.emit(false);
  }
}
