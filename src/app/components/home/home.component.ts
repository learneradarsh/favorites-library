import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EntertainmentData } from 'src/app/models/Entertainment.model';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  entertainmentItems$: Observable<EntertainmentData[]> = of([]);

  constructor(private readonly dataService: DataService) { }

  ngOnInit(): void {
    this.entertainmentItems$ = this.dataService.getAllEntertainmentData$();
  }

  onAddToFavorite(item: EntertainmentData) {
    console.log('data coming', item);
    this.dataService.addItemToFav(item);
  }

}
