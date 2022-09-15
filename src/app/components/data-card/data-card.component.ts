import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EntertainmentData } from 'src/app/models/Entertainment.model';

@Component({
  selector: 'app-data-card',
  templateUrl: './data-card.component.html',
  styleUrls: ['./data-card.component.scss']
})
export class DataCardComponent implements OnInit {
  @Input()
  cardData: any;

  @Input()
  showButton: boolean = true;

  @Output()
  addToFavorite: EventEmitter<EntertainmentData> = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  addToFav(favItem: EntertainmentData) {
    console.log(favItem);
    this.addToFavorite.emit({
      ...favItem,
      isFav: true,
    });
  }

}
