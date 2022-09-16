import { Component, Input, OnInit } from '@angular/core';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  @Input()
  count: number = 10;

  constructor(protected readonly loaderService: LoaderService) { }

  ngOnInit(): void {
  }

}
