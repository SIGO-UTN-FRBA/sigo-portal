import {Component, Input, OnInit} from "@angular/core";
import {Airport} from "./airport";
import {AirportService} from "./airport.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  template:`
    <div class="panel panel-default">
      <div class="panel-heading">
        <div class="row">
          <h3 class="panel-title panel-title-with-buttons col-md-6" i18n="@@airport.detail.section.general.title">
            General
          </h3>
          <div class="col-md-6 btn-group">
            <a
              routerLink="../edit"
              class="btn btn-default pull-right"
              i18n="@@commons.button.edit">
              Edit
            </a>
          </div>
          <div class="clearfix"></div>
        </div>
      </div>
      
      <div *ngIf="!contentLoaded">
        <img class="center-block" src="../../assets/images/loading.gif">
      </div>
      
      <div *ngIf="contentLoaded" class="panel-body">
        <form #airportForm="ngForm" role="form" class="form container-fluid">
          <div class="row">
            <div class="col-md-12 col-sm-12 form-group">
              <label for="inputNameFir" class="control-label" i18n="@@airport.detail.section.general.inputNameFir">
                Name ICAO
              </label>
              <input
                type="text"
                class="form-control"
                name="inputNameFir"
                [ngModel]="airport.name_fir"
                readonly>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 col-sm-12 form-group">
              <label for="inputCodeFir" class="control-label" i18n="@@airport.detail.section.general.inputCodeFir">
                Code ICAO
              </label>
              <input
                type="text"
                class="form-control"
                name="inputCodeFir"
                [ngModel]="airport.code_fir"
                readonly>
            </div>
            <div class="col-md-6 col-sm-12">
              <label for="inputCodeIATA" class="control-label" i18n="@@airport.detail.section.general.inputCodeIATA">
                Code IATA
              </label>
              <input
                type="text"
                class="form-control"
                name="inputCodeIATA"
                [ngModel]="airport.code_IATA"
                readonly>
            </div>
          </div>
        </form>
      </div>
    </div>
  `
})

export class AirportDetailViewComponent implements OnInit{

  airport : Airport;
  contentLoaded : boolean;

  constructor(
    private airportService : AirportService,
    private route : ActivatedRoute
  ){
    this.airport = new Airport()
  }

  ngOnInit() : void {

    this.contentLoaded = false;

    this.airportService
      .get(this.route.parent.snapshot.params['airportId'])
      .then(data => {
        this.airport = data;
        this.contentLoaded = true;
      })

  }
}
