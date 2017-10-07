import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {AirportService} from "./airport.service";
import {Airport} from "./airport";
import {Router} from "@angular/router";
import {AirportCatalogService} from "./airport-catalog.service";
import {AirportRegulation} from "./airportRegulation";
import {Region} from "../region/region";
import {RegionService} from "../region/region.service";

@Component({
  template: `
    <h1 i18n="@@airport.new.title">
      New Airport
    </h1>
    <p i18n="@@airport.new.main_description">
      This section allows users to create an airport.
    </p>
    <hr/>
    
      <div class="panel panel-default">
        <div class="panel-heading">
          <h3 class="panel-title" i18n="@@airport.detail.section.general.title">
            General
          </h3>
        </div>
        <div class="panel-body">
          <form #airportForm="ngForm" role="form" class="form container-fluid" (ngSubmit)="onSubmit()">
            <div class="row">
              <div class="col-md-12 col-sm-12 form-group">
                <label
                  for="inputRegion"
                  class="control-label"
                  i18n="@@airport.detail.section.general.region">
                  Region
                </label>
                <select
                  class="form-control"
                  name="inputRegion"
                  [(ngModel)]="airport.regionId"
                  required>
                  <option *ngFor="let region of regions" [value]="region.id"> {{region.codeFIR}} - {{region.name}}</option>
                </select>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12 col-sm-12 form-group">
                <label 
                  for="inputNameFir" 
                  class="control-label" 
                  i18n="@@airport.detail.section.general.inputNameFir">
                  Name ICAO
                </label>
                <input
                  type="text"
                  maxlength="140"
                  class="form-control"
                  name="inputNameFir"
                  [(ngModel)]="airport.nameFIR"
                  required>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 col-sm-12 form-group">
                <label 
                  for="inputCodeFir" 
                  class="control-label" 
                  i18n="@@airport.detail.section.general.inputCodeFir">
                  Code ICAO
                </label>
                <input
                  type="text"
                  maxlength="4"
                  minlength="4"
                  class="form-control"
                  name="inputCodeFir"
                  [(ngModel)]="airport.codeFIR"
                  required>
              </div>
              <div class="col-md-6 col-sm-12">
                <label 
                  for="inputCodeIATA" 
                  class="control-label" 
                  i18n="@@airport.detail.section.general.inputCodeIATA">
                  Code IATA
                </label>
                <input
                  type="text"
                  maxlength="3"
                  minlength="3"
                  class="form-control"
                  name="inputCodeIATA"
                  [(ngModel)]="airport.codeIATA"
                  required>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12 col-sm-12 form-group">
                <label
                  for="inputRegulation"
                  class="control-label"
                  i18n="@@airport.detail.section.general.inputRegulation">
                  Regulation
                </label>
                <select class="form-control"
                        name="inputRegulation"
                        [(ngModel)]="airport.regulationId"
                        required
                >
                  <option *ngFor="let regulation of regulations" [value]="regulation.id">
                    {{regulation.name}} - {{regulation.description}}
                  </option>
                </select>
              </div>
            </div>
          </form> 
        </div>
        <br>
      </div>  
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
                  (click)="airportForm.ngSubmit.emit()"
                  [disabled]="airportForm.form.invalid"
                  class="btn btn-success"
                  i18n="@@commons.button.create">
                  Create
                </button>
              </div>
            </div>            
    
  `
})


export class AirportNewComponent implements OnInit{

  airport : Airport;
  @Input() edit : boolean;
  @Output() editChange:EventEmitter<boolean> = new EventEmitter<boolean>();
  regulations: AirportRegulation[];
  regions : Region[];

  constructor(
    private router : Router,
    private airportService : AirportService,
    private catalogService : AirportCatalogService,
    private regionService : RegionService
  ){
    this.airport = new Airport();
  }

  ngOnInit(): void {

    this.catalogService
      .listRegulations()
      .then(data => this.regulations = data);

    this.regionService
      .list()
      .then(data => this.regions = data)
  }

  onSubmit(){
    this.airportService
        .save(this.airport)
        .then( (data) => this.router.navigate([`/airports/${data.id}/detail`]) );
  };

  onCancel(){
    this.router.navigate([`/airports/search`])
  };

}
