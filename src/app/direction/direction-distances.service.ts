import {Injectable} from "@angular/core";
import {Subject} from "rxjs/Subject";

@Injectable()
export class DirectionDistancesService {

  // Observable string sources
  private lengthUpdatedSource = new Subject<number>();


  // Observable string streams
  lengthUpdated$ = this.lengthUpdatedSource.asObservable();


  // Service message commands
  updateLength(value : number) {
    this.lengthUpdatedSource.next(value);
  }
}
