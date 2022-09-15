import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, combineLatest, concatMap, forkJoin, map, Observable, of, retry, share, shareReplay, tap, throwError } from 'rxjs';
import { EntertainmentData } from '../models/Entertainment.model';
import * as uuid from 'uuid';

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

  private myFavoritesSub = new BehaviorSubject<EntertainmentData[]>([]);
  private allEntertainmentDataSub = new BehaviorSubject<EntertainmentData[]>([]);

  constructor(private readonly http: HttpClient) { 
    this.getCombinedDataFromAPI$().pipe(
      tap((data) => this.allEntertainmentDataSub.next(data))
    ).subscribe();

    if(localStorage.getItem('my-fav') !== undefined
    || localStorage.getItem('my-fav') !== null) {
      this.myFavoritesSub.next(JSON.parse(localStorage.getItem('my-fav')!));
    }
    
  }

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
        id: uuid.v4(),
        title: planet.name,
        category: 'planet',
        imageUrl: planet['imageUrl'] ? planet['url'] : 'https://png.pngtree.com/png-clipart/20190614/original/pngtree-ui-default-page-cartoon-cute-cat-png-image_3806397.jpg',
        isFav: false
      }
    });
    const transformedMovies = allData[1].results.map((movie: any)  => {
      return {
        id: uuid.v4(),
        title: movie.title,
        category: 'movie',
        imageUrl: movie['imageUrl'] ? movie['url'] : 'https://png.pngtree.com/png-clipart/20190614/original/pngtree-ui-default-page-cartoon-cute-cat-png-image_3806397.jpg',
        isFav: false
      }
    });
    return [...transformedPlanets, ...transformedMovies];
  }

   private getCombinedDataFromAPI$(): Observable<EntertainmentData[]> {
    return forkJoin([this.planets$, this.movies$]).pipe(
      map((response) => this.transformData$(response)),
      tap(console.log),
      shareReplay()
    );
  }
  
  getAllEntertainmentData$(): Observable<EntertainmentData[]> {
    return this.allEntertainmentDataSub;
  }

  addItemToFav(item: EntertainmentData): void {
    this.myFavoritesSub.next([item, ...this.myFavoritesSub.value]);

    // store favorites data to local storage
    localStorage.setItem('my-fav', JSON.stringify(this.myFavoritesSub.value));

    // update global entertainment data
    let allEntertainmentData = this.allEntertainmentDataSub.value;
    allEntertainmentData = allEntertainmentData.map(data => {
      if(data.id === item.id) {
        data = {
          ...item
        }
      }
      return data;
    })
    this.allEntertainmentDataSub.next(allEntertainmentData);
  }

  getFavItems$(): Observable<EntertainmentData[]>{
    return this.myFavoritesSub.pipe(
      tap(console.log)
    )
  }
}
