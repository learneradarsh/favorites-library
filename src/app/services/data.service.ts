import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, combineLatest, concatMap, forkJoin, map, Observable, of, retry, share, shareReplay, tap } from 'rxjs';
import { EntertainmentData } from '../models/Entertainment.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  basePath: string = 'https://swapi.dev/api';

  movies$ = this.http.get(`${this.basePath}/films/`).pipe(
    retry(1),
    );
  planets$ = this.http.get(`${this.basePath}/planets/`).pipe(
    retry(1)
  );

  constructor(private readonly http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    let errorMessage;
    if(error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `${error.status} ${error.message}`
    }

    window.alert(errorMessage);

    throw new Error(errorMessage);
  }

  private transformData$(allData: any): EntertainmentData[] {

    const transformedPlanets = allData[0].results.map((planet: any)  => {
      return {
        id: planet.created,
        title: planet.name,
        category: 'planet'
      }
    });
    const transformedMovies = allData[1].results.map((movie: any)  => {
      return {
        id: movie.created,
        title: movie.title,
        category: 'movie'
      }
    });
    return [...transformedPlanets, ...transformedMovies];
  }

   getEntertainmentLibData$() {
    return forkJoin([this.planets$, this.movies$]).pipe(
      map((response) => this.transformData$(response)),
      tap(console.log),
      shareReplay()
    );
  }
}
