import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BrowserService {

  constructor() { }

  storeDataInLocalStorage(key: string, value: string): void{
    localStorage.setItem(key, value);
  }

  retrieveDataFromLocalStorage(key: string){
    localStorage.getItem(key);
  }

}
