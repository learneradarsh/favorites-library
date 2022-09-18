import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, forkJoin, map, Observable, of, shareReplay, tap, throwError } from 'rxjs';
import * as uuid from 'uuid';
import { MY_FAV } from '../constants';
import { EntertainmentData } from '../models/Entertainment.model';
import { BrowserService } from './browser.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private readonly basePath: string = 'https://swapi.dev/api';

  private readonly movies$ = this.http.get(`${this.basePath}/films/`).pipe(catchError(() => of({
    count: 0,
    next: null,
    previous: null,
    results: []
  })));
  private readonly planets$ = this.http.get(`${this.basePath}/planets/`).pipe(catchError(() => of({
    count: 0,
    next: null,
    previous: null,
    results: []
  })));

  private myFavoritesSub = new BehaviorSubject<EntertainmentData[]>([]);
  private allEntertainmentDataSub = new BehaviorSubject<EntertainmentData[]>([]);

  constructor(private readonly http: HttpClient,
    private readonly browserService: BrowserService) { 
    this.getCombinedDataFromAPI$().pipe(
      tap((data) => this.allEntertainmentDataSub.next(data))
    ).subscribe();


    // load data of myfavs from localstorage if available
    if(this.browserService.retrieveDataFromLocalStorage(MY_FAV) != undefined
    && this.browserService.retrieveDataFromLocalStorage(MY_FAV) != null) {
      this.myFavoritesSub.next(JSON.parse(this.browserService.retrieveDataFromLocalStorage(MY_FAV)!));
    }
    
  }


  private transformSearchResults<T>(searchResults: T[]): EntertainmentData[] {
    const transformedResults = searchResults.map((searchItem: any) => {
      return {
        id: uuid.v4(),
        title: searchItem.name,
        category: 'planet',
        imageUrl: searchItem['imageUrl'] ? searchItem['url'] : 'https://png.pngtree.com/png-clipart/20190614/original/pngtree-ui-default-page-cartoon-cute-cat-png-image_3806397.jpg',
        isFav: false
      }
    });

    return transformedResults;
  }
  

  private transformData(allData: any): EntertainmentData[] {

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
      map((response) => this.transformData(response)),
      shareReplay()
    );
  }
  
  getAllEntertainmentData$(): Observable<EntertainmentData[]> {
    return this.allEntertainmentDataSub;
  }

  addItemToFav(item: EntertainmentData): void {
    this.myFavoritesSub.next([...this.myFavoritesSub.value, item]);

    // store favorites data to local storage
    this.browserService.storeDataInLocalStorage(MY_FAV, JSON.stringify(this.myFavoritesSub.value));

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
    return this.myFavoritesSub;
  }

  private searchInLocalData(term: string):  EntertainmentData[]{
    const allEntertainmentData = this.allEntertainmentDataSub.value;
    let searchResult = allEntertainmentData.filter((data: EntertainmentData) => data.title.toLocaleLowerCase().includes(term));
    return searchResult;
  }

  private searchInDB(term: string, category: string = 'planets'): Observable<any> {
    return this.http.get(`${this.basePath}/${category}/?search=${term}`).pipe(catchError((e) => of({
      count: 0,
      next: null,
      previous: null,
      results: []
    })));
  }
  
  searchBy(term: string, category?: string): Observable<EntertainmentData[]> {
    let searchResults = this.searchInLocalData(term);
    if(searchResults.length > 0) {
        return of(searchResults);
    } else {
      return this.searchInDB(term, category).pipe(
        map(response => response['results']),
        map(data => this.transformSearchResults(data)),
        tap(console.log)
      );
    }
    }
}
