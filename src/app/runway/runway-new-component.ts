import {Component, OnInit} from "@angular/core";
import {Runway} from "./runway";
import {RunwayService} from "./runway.service";
import {ActivatedRoute, Router} from "@angular/router";
import {RunwaySurface} from "./runwaySurface";
import {RunwayCatalogService} from "./runway-catalog.service";

@Component({
  template: `
    <h1 i18n="@@runway.new.title">
      New runway
    </h1>
    <p i18n="@@runway.new.main_description">
      This section allows users to create a runway.
    </p>
    <hr/>

    <div class="container-fluid">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h3 class="panel-title" i18n="@@runway.detail.section.general.title">
            General
          </h3>
        </div>
        <div class="panel-body">
          <form #generalForm="ngForm" role="form" class="form container-fluid" (ngSubmit)="onSubmit()">
            <div class="row">
              <div class="col-md-12 col-sm-12 form-group">
                <label
                  for="inputName"
                  class="control-label"
                  i18n="@@runway.detail.section.general.inputName">
                  Name
                </label>
                <input
                  type="text"
                  class="form-control"
                  name="inputName"
                  [ngModel]="runway.name"
                  readonly>
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
                <div class="input-group">
                  <input
                    type="number"
                    min="1"
                    step="0.5" 
                    name="inputWidth"
                    [(ngModel)]="runway.width"
                    class="form-control"
                    placeholder="0000.0"
                    required>
                  <div class="input-group-addon">[m]</div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 form-group">
                <label
                  for="inputLength"
                  class="control-label"
                  i18n="@@runway.detail.section.general.inputLength">
                  Length
                </label>
                <div class="input-group">
                  <input 
                    type="number"
                    min="1" 
                    step="0.1" 
                    name="inputLength"
                    class="form-control" 
                    [(ngModel)]="runway.length" 
                    placeholder="0000.0" 
                    required>
                  <div class="input-group-addon">[m]</div>
                </div>
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
                <select 
                  name="inputSurface" 
                  [(ngModel)]="runway.surfaceId"
                  class="form-control"
                  required>
                  <option *ngFor="let surface of surfaces" [value]="surface.id">
                    {{surface.code}} - {{surface.name}}
                  </option>
                </select>
              </div>
            </div>
          </form>
        </div>
      </div>

      <br>

      <hr>

      <div class="row">
        <div class="pull-right">
          <button
            type="button"
            (click)="onCancel()"
            class="btn btn-default"
            i18n="@@commons.button.cancel">
            Cancel
          </button>
          <button
            type="button"
            (click)="generalForm.ngSubmit.emit()"
            [disabled]="generalForm.form.invalid"
            class="btn btn-success"
            i18n="@@commons.button.create">
            Create
          </button>
        </div>
      </div>
      
    </div>
  `
})

export class RunwayNewComponent implements OnInit{

  runway : Runway;
  surfaces : RunwaySurface[];

  constructor(
    private router : Router,
    private route : ActivatedRoute,
    private runwayService : RunwayService,
    private catalogService : RunwayCatalogService
  ){
    this.runway = new Runway();
    this.surfaces = [];
  }

  ngOnInit(): void {

    this.runway.airportId = +this.route.parent.snapshot.params['airportId'];

    this.runway.name = "RNW XX/XX";

    this.catalogService
      .listSurfaces()
      .then(data => this.surfaces = data);
  }

  onSubmit(){
    this.runwayService.save(this.runway.airportId, this.runway)
      .then(data => this.router.navigate([`/airports/${this.runway.airportId}/runways/${data.id}/detail`]));
  }

  onCancel(){
    this.router.navigate([`/airports/${this.runway.airportId}/detail`])
  }
}
