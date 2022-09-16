import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, combineLatest, concatMap, filter, forkJoin, map, Observable, of, retry, share, shareReplay, tap, throwError } from 'rxjs';
import { EntertainmentData } from '../models/Entertainment.model';
import * as uuid from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private readonly basePath: string = 'https://swapi.dev/api';

  private readonly movies$ = this.http.get(`${this.basePath}/films/`).pipe(catchError(e => of({
    count: 0,
    next: null,
    previous: null,
    results: []
  })));
  private readonly planets$ = this.http.get(`${this.basePath}/planets/`).pipe(catchError(e => of({
    count: 0,
    next: null,
    previous: null,
    results: []
  })));

  private myFavoritesSub = new BehaviorSubject<EntertainmentData[]>([]);
  private allEntertainmentDataSub = new BehaviorSubject<EntertainmentData[]>([]);

  constructor(private readonly http: HttpClient) { 
    this.getCombinedDataFromAPI$().pipe(
      tap((data) => this.allEntertainmentDataSub.next(data))
    ).subscribe();


    // load data of myfavs from localstorage if available
    if(localStorage.getItem('my-fav') != undefined
    && localStorage.getItem('my-fav') != null) {
      this.myFavoritesSub.next(JSON.parse(localStorage.getItem('my-fav')!));
    }
    
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
      shareReplay()
    );
  }
  
  getAllEntertainmentData$(): Observable<EntertainmentData[]> {
    return this.allEntertainmentDataSub;
  }

  addItemToFav(item: EntertainmentData): void {
    this.myFavoritesSub.next([...this.myFavoritesSub.value, item]);

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
    return this.myFavoritesSub
  }

  searchBy(term: string): Observable<EntertainmentData[]> {
    const allEntertainmentData = this.allEntertainmentDataSub.value;
    let searchResult = allEntertainmentData.filter((data: EntertainmentData) => data.title.toLocaleLowerCase().includes(term));
    return of(searchResult);
  }
}
