import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NEVER, Observable, of } from 'rxjs';
import { DataService } from '../data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  combinedData$: Observable<any> = of(null);

  constructor(private readonly dataService: DataService,
    private readonly router: Router) { }

  ngOnInit(): void {
    // this.dataService.getCombinedData$();
  }

}
