import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EntertainmentData } from 'src/app/models/Entertainment.model';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-my-favorites',
  templateUrl: './my-favorites.component.html',
  styleUrls: ['./my-favorites.component.scss']
})
export class MyFavoritesComponent implements OnInit {

  myFavList$: Observable<EntertainmentData[]> = of([]);

  constructor(private readonly dataService: DataService) { }

  ngOnInit(): void {
    this.myFavList$ = this.dataService.getFavItems$();
  }

}
