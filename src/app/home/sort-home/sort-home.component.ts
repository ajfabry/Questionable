import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

import { Service } from '../../question.service';

@Component({
  selector: 'app-sort-home',
  templateUrl: './sort-home.component.html',
  styleUrls: ['./sort-home.component.scss'],
})
export class SortHomeComponent implements OnInit {

  constructor(
    public popoverController: PopoverController,
    public service: Service
  ) { }

  ngOnInit() {}

  setSort(sortMethod) {
    this.service.publishEvent({
      page: "HomePage",
      sortMethod: sortMethod
    });
    this.popoverController.dismiss();
  }
}
