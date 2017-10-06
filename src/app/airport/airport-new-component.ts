import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {AirportService} from "./airport.service";
import {Airport} from "./airport";
import {ActivatedRoute} from "@angular/router";

@Component({
  template: `
    <h1 i18n="@@airport.new.title">
      New Airport
    </h1>
    <p i18n="@@airport.new.main_description">
      This section allows users to create an airport.
    </p>
    <hr/>
    
      <div class="panel panel-primary">
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
            <div class="row">
              <div class="col-md-12 col-sm-12 form-group">
                <label
                  for="selectRegulations"
                  class="control-label"
                  i18n="@@airport.detail.section.general.selectRegulations">
                  Regulations
                </label>
                <select class="form-control"
                        type="text">
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

  constructor(
    private route : ActivatedRoute,
    private airportService : AirportService
  ){
    this.airport = new Airport();
  }

  ngOnInit(): void {

    let airportId : number = +this.route.snapshot.params['airportId'];

    this.airportService
      .get(airportId)
      .then( data => this.airport = data)
  }

  onSubmit(){
    this.airportService
        .save(this.airport)
        .then( () => this.disallowEdition() );
  };

  onCancel(){
    this.disallowEdition();
  };

  disallowEdition() {
    this.editChange.emit(false);
  }
}
