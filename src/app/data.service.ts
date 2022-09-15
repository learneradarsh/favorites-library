import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { combineLatest, concatMap, forkJoin, share, shareReplay, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private readonly http: HttpClient) { }

  basePath: string = 'https://swapi.dev/api';


  movies = this.http.get(`${this.basePath}/films/`);
  planets = this.http.get(`${this.basePath}/planets/`);

  getCombinedData$() {
    forkJoin([this.planets, this.movies]).pipe(
      tap(console.log),
      share()
    ).subscribe();
  }
}
