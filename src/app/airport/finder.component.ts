import {Component} from "@angular/core";

@Component({
  selector:'airport-finder',
  template:`
    <div class="container-fluid">
      <div class="row">
        <form #searchForm="ngForm" class="form" role="form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <div class="col-lg-8 col-lg-offset-2">
              <div class="input-group input-group-lg">
                <div class = "input-group-btn">
                  <button type = "button" class = "btn btn-default" tabindex = "-1">{{searchType}}</button>
                  <button type="button" tabindex="-1" data-toggle="dropdown" class="btn btn-default dropdown-toggle">
                    <span class="caret"></span>
                    <span class="sr-only">Toggle Dropdown</span>
                  </button>
                  <ul class="dropdown-menu">
                    <li *ngFor="let type of searchTypes">
                      <a (click)="setSearchType(type)" *ngIf="type != searchType">{{type}}</a>
                    </li>
                  </ul>
                </div>
                <input 
                  type="search" 
                  name="searchText"
                  [(ngModel)]="searchText"
                  class="form-control input-lg"
                  [placeholder]=""
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
  `

})

export class AirportFinderComponent  {

  searchTypes : String[] = [ 'ICAO Code', 'IATA Code', 'Name'];

  searchPlaceholders = [];

  searchType : String = this.searchTypes[0];

  searchText : String = "";

  setSearchType = (type) => { this.searchType = type };

  onSubmit = () => {
    console.log("searchType -> " + this.searchType );
    console.log("searchText -> " + this.searchText );
  }

}
