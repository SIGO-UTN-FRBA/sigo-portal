import {Component} from "@angular/core";
import {Params, Router} from "@angular/router";
import {AirportSearchFilter, default as AirportSearchFilters} from "./airportSearchFilters";

@Component({
  template:`
    <h1 i18n="@@airport.search.title">
      Airports
    </h1>
    <p i18n="@@airport.search.main_description">
      This section allows users to manage airports.
    </p>
    <hr/>

    <div class="container-fluid">
      <div class="row">
        <form #searchForm="ngForm" class="form" role="form" (ngSubmit)="onSubmit()">
          <div class="row form-group">
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
                <span class="input-group-btn" role="group">
                  <button type="submit"
                          class="btn btn-lg btn-primary"
                          [disabled]="searchForm.invalid"
                          i18n-title="@@commons.button.search"
                          title="Search"
                  >
                      <span class="glyphicon glyphicon-search"></span>
                  </button>
                  <button type="button"
                          (click)="onFilter()"
                          class="btn btn-lg btn-primary"
                          i18n-title="@@commons.button.filter"
                          title="Filter"
                  >
                    <span class="glyphicon glyphicon-filter"></span>
                  </button>
                </span>
              </div>
            </div>
            <div class="col-md-2">
              <a
                type="button"
                routerLink="/airports/new"
                class="btn btn-primary btn-lg"
                i18n-title="@@commons.button.new"
                title="New">
                <span class="glyphicon glyphicon-plus"></span>
              </a>
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

  searchTypes : AirportSearchFilter[];

  searchType : AirportSearchFilter;

  searchValue : string = "";

  constructor(
    private router : Router
  ){
    this.searchTypes = AirportSearchFilters;
    this.searchType = this.searchTypes[0];
  }

  setSearchType = (type) => {
      this.searchType = type;
      this.searchValue = '';
      this.clearList();
    };

  onSubmit = () => {

    let params = {};

    params[this.searchType.property] = this.searchValue;

    this.router.navigate(
      ['/airports/search/list'],
      {queryParams: params}
    );
  };

  clearList = () =>{
    if(!this.router.isActive('/airports/search', true))
      this.router.navigate(['/airports/search']);
  };

  onFilter = () => {

  }
}
