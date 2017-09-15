import {Component} from "@angular/core";
import {Router} from "@angular/router";

@Component({
  template:`
    <h1>Airports</h1>
    <p>This section allows users to manage airports.</p>
    <hr/>

    <div class="container-fluid">
      <div class="row">
        <form #searchForm="ngForm" class="form" role="form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <div class="col-lg-8 col-lg-offset-2">
              <div class="input-group input-group-lg">
                <div class="input-group-btn">
                  <button type="button" class="btn btn-default" tabindex="-1">{{searchType['name']}}</button>
                  <button type="button" tabindex="-1" data-toggle="dropdown" class="btn btn-default dropdown-toggle">
                    <span class="caret"></span>
                    <span class="sr-only">Toggle Dropdown</span>
                  </button>
                  <ul class="dropdown-menu">
                    <li *ngFor="let type of searchTypes">
                      <a (click)="setSearchType(type)" *ngIf="type != searchType">{{type['name']}}</a>
                    </li>
                  </ul>
                </div>
                <input
                  type="search"
                  name="searchText"
                  [(ngModel)]="searchValue"
                  class="form-control input-lg"
                  [placeholder]="searchType['placeHolder']"
                  (ngModelChange)="clearList()"
                  autofocus
                  maxlength="80"
                  required>
                <span class="input-group-btn">
                  <button
                    type="submit"
                    class="btn btn-lg btn-primary"
                    [disabled]="searchForm.invalid">
                  <i class="glyphicon glyphicon-search"></i>
                  </button>
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
    <br>
    <br>
    <router-outlet></router-outlet>
  `

})

export class AirportSearchComponent  {

  searchTypes : object[] = [
    {
      name : "ICAO Code",
      property : "code_fir",
      placeHolder : "ICAO 4-letter code of the location (DOC7910)"
    },
    {
      name : 'IATA Code',
      property : "code_IATA",
      placeHolder : "IATA 3-letter code of the location"
    },
    {
      name : 'Name',
      property : "name_fir",
      placeHolder : "Name of the airport"
    }
  ];

  searchType : object = this.searchTypes[0];

  searchValue : string = "";

  constructor(
    private router : Router
  ){}

  setSearchType = (type) => {
      this.searchType = type;
      this.searchValue = '';
      this.clearList();
    };

  onSubmit = () => {
    this.router.navigate(['/airports/search/list', {property: this.searchType['property'], value: this.searchValue }]);
  };

  clearList = () =>{
    if(!this.router.isActive('/airports/search', true))
      this.router.navigate(['/airports/search']);
  }
}
