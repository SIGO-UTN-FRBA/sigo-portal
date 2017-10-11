import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";


@Component({
  template: `
    <breadcrumb></breadcrumb>
    
    <h1 i18n="@@airport.detail.title">
      Airport detail
    </h1>
    <p i18n="@@airport.detail.main_description">
      This section allows users to inspect an airport.
    </p>
    <hr/>

    <div class="container-fluid">
      <app-airport-general-view *ngIf="!edit_general" [(edit)]="edit_general" [airportId]="airportId"></app-airport-general-view>
      <app-airport-general-edit *ngIf="edit_general" [(edit)]="edit_general" [airportId]="airportId"></app-airport-general-edit>
      
      <br>
      
      <app-airport-geometry-view *ngIf="!edit_geometry" [(edit)]="edit_geometry" [airportId]="airportId"></app-airport-geometry-view>
      <app-airport-geometry-edit *ngIf="edit_geometry" [(edit)]="edit_geometry" [airportId]="airportId"></app-airport-geometry-edit>
      
      <br>
      
      <app-airport-children [airportId]="airportId"></app-airport-children>
    </div>
  `
})


export class AirportDetailComponent implements OnInit{

  edit_general : boolean;
  edit_geometry : boolean;
  airportId: number;

  constructor(
    private route: ActivatedRoute
  ){
    this.edit_general = false;
    this.edit_geometry = false;
  }

  ngOnInit() : void {
    this.airportId = this.route.snapshot.params['airportId'];
  }

}
