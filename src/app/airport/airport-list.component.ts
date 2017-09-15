import {Component, OnInit} from "@angular/core";
import {AirportService} from "./airport.service";
import {Airport} from "./airport";
import {ActivatedRoute} from "@angular/router";
import "rxjs/add/observable/of";
import "rxjs/add/operator/catch";

@Component({
  template:`
    <div class="container-fluid">
      <ul class="media-list">
        <li *ngFor="let airport of results" class="media media-border">
          <div class="media-left">
            <a href="#">
              <img class="media-object" src="" alt="...">
            </a>
          </div>
          <div class="media-body">
            <h4 class="media-heading">{{airport.code_fir}}</h4>
            <p>{{airport.name_fir}}</p>
          </div>
        </li>
      </ul>
    </div>
  `
})

export class AirportListComponent implements OnInit {

  results : Airport[];


  constructor(
    private airportService : AirportService,
    private route: ActivatedRoute
  ){}

  ngOnInit() : void {

    this.airportService
      .search(
        this.route.snapshot.paramMap.get('property'),
        this.route.snapshot.paramMap.get('value')
      )
      .then( data => {this.results = data;})
  }

}
