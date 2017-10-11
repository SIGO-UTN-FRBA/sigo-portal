import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd, Params, PRIMARY_OUTLET } from "@angular/router";
import "rxjs/add/operator/filter";

interface IBreadcrumb {
  label: string;
  params: Params;
  url: string;
}

@Component({
  selector: "breadcrumb",
  template: `
    <ol class="breadcrumb">
      <li><a routerLink="">Home</a></li>
      <li *ngFor="let breadcrumb of breadcrumbs">
        <a [routerLink]="[breadcrumb.url]" [queryParams]="breadcrumb.params">{{ breadcrumb.label }}</a>
      </li>
    </ol>
  `
})
export class BreadcrumbComponent implements OnInit {

  public breadcrumbs: IBreadcrumb[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.breadcrumbs = [];
  }

  ngOnInit() : void {
    const ROUTE_DATA_BREADCRUMB: string = "breadcrumb";

    /*
    //subscribe to the NavigationEnd event
    this.router.events.filter(event => event instanceof NavigationEnd).subscribe(event => {
      this.initializeBreadcrumbs();
    });
    */
    this.initializeBreadcrumbs();
  }

  private initializeBreadcrumbs(){
    let root: ActivatedRoute = this.activatedRoute.root;
    this.breadcrumbs = this.getBreadcrumbs(root);
  }

  /**
   * Returns array of IBreadcrumb objects that represent the breadcrumb
   *
   * @class DetailComponent
   * @method getBreadcrumbs
   * @param {ActivateRoute} route
   * @param {string} url
   * @param {IBreadcrumb[]} breadcrumbs
   */
  private getBreadcrumbs(route: ActivatedRoute, breadcrumbs: IBreadcrumb[]=[]): IBreadcrumb[] {
    const ROUTE_DATA_BREADCRUMB: string = "breadcrumb";

    //get the child routes
    let children: ActivatedRoute[] = route.children;

    //return if there are no more children
    if (children.length === 0) {
      return breadcrumbs;
    }

    //iterate over each children
    for (let child of children) {
      //verify primary route
      if (child.outlet !== PRIMARY_OUTLET) {
        continue;
      }

      //verify the custom data property "breadcrumb" is specified on the route
      if (!child.snapshot.data.hasOwnProperty(ROUTE_DATA_BREADCRUMB) || !child.snapshot.data[ROUTE_DATA_BREADCRUMB].active) {
        return this.getBreadcrumbs(child, breadcrumbs);
      }

      //add breadcrumb
      let breadcrumb: IBreadcrumb = {
        label: child.snapshot.data[ROUTE_DATA_BREADCRUMB].name,
        params: child.snapshot.queryParams,
        url: child.pathFromRoot.reduce(
                                  function(m,e,i,a){
                                    if(e.snapshot.routeConfig != null && e.snapshot.routeConfig.path != null && e.snapshot.routeConfig.path != '')
                                      return m = m + "/" + e.snapshot.url.map(function(j){return j; }).join("/");
                                    else
                                      return m;
                                  }, ""
            )
      };
      breadcrumbs.push(breadcrumb);

      //recursive
      return this.getBreadcrumbs(child, breadcrumbs);
    }
  }
/*
  go( url : string, params : Params){
    this.router.navigate([url, params]);
  }
*/
}
