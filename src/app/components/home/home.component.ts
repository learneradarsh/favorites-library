import { Component, OnInit } from '@angular/core';
import { finalize, Observable, of, tap } from 'rxjs';
import { EntertainmentData } from 'src/app/models/Entertainment.model';
import { DataService } from 'src/app/services/data.service';
import { LoaderService } from 'src/app/services/loader.service';

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

  onAddToFavorite(item: EntertainmentData): void {
    console.log(item);
    this.dataService.addItemToFav(item);
  }

  searchByCategory(term: string, category: string): void {
    const sanitizedSearchTerm = term.trim().toLowerCase();
    this.entertainmentItems$ = this.dataService.searchBy(sanitizedSearchTerm, category);
  }

}
