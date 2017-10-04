import {Component, OnInit} from "@angular/core";


@Component({
  template: `
    <h1 i18n="@@airport.detail.title">
      Airport detail
    </h1>
    <p i18n="@@airport.detail.main_description">
      This section allows users to inspect an airport.
    </p>
    <hr/>

    <div class="container-fluid">
      <app-airport-general-view *ngIf="!edit_general" [(edit)]="edit_general"></app-airport-general-view>
      <app-airport-general-edit *ngIf="edit_general" [(edit)]="edit_general"></app-airport-general-edit>
      
      <br>
      
      <app-airport-geometry-view *ngIf="!edit_geometry" [(edit)]="edit_geometry"></app-airport-geometry-view>
      <app-airport-geometry-edit *ngIf="edit_geometry" [(edit)]="edit_geometry"></app-airport-geometry-edit>
      
      <br>
      
      <app-airport-children></app-airport-children>
    </div>
  `
})


export class AirportDetailComponent implements OnInit{

  edit_general : boolean;
  edit_geometry : boolean;

  constructor(){
    this.edit_general = false;
    this.edit_geometry = false;
  }

  ngOnInit() : void {

  }

}
