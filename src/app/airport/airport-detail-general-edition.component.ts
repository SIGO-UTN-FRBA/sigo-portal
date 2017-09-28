import {Component, OnInit} from "@angular/core";
import {AirportService} from "./airport.service";
import {Airport} from "./airport";
import {Location} from "@angular/common";
import {ActivatedRoute} from "@angular/router";

@Component({
  template: `
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
                  for="inputNameFir" 
                  class="control-label" 
                  i18n="@@airport.detail.section.general.inputNameFir">
                  Name ICAO
                </label>
                <input
                  type="text"
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
                  class="form-control"
                  name="inputCodeFir"
                  [ngModel]="airport.codeFIR"
                  disabled
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
                  class="form-control"
                  name="inputCodeIATA"
                  [(ngModel)]="airport.codeIATA"
                  required>
              </div>
            </div>
            <br>
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
                  [disabled]="airportForm.invalid || airportForm.untouched"
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


export class AirportDetailGeneralEditionComponent implements OnInit{

  airport : Airport;

  constructor(
    private location : Location,
    private route : ActivatedRoute,
    private airportService : AirportService
  ){
    this.airport = new Airport();
  }

  ngOnInit(): void {
      this.airportService
        .get(this.route.parent.snapshot.params['airportId'])
        .then( data => this.airport = data)
  }

  onSubmit = () => {
    this.airportService
      .save(this.airport)
      .then( () => this.location.back());
  };

  onCancel = () => {
    this.location.back();
  }
}
