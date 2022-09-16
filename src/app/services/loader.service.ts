import { Injectable } from '@angular/core';
import { BehaviorSubject, concatMap, finalize, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private loaderSub = new BehaviorSubject<boolean>(true);
  loading$ = this.loaderSub.asObservable();
  constructor() { }

  loaderOn() {
    this.loaderSub.next(true);
  }

  loaderOff() {
    console.log('loader off');
    this.loaderSub.next(false);
  }
}
