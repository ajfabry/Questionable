import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

import { Service } from '../../question.service';

@Component({
  selector: 'app-sort-local',
  templateUrl: './sort-local.component.html',
  styleUrls: ['./sort-local.component.scss'],
})
export class SortLocalComponent implements OnInit {

  constructor(
    public popoverController: PopoverController,
    public service: Service
  ) { }

  ngOnInit() {}

  setSort(sortMethod) {
    this.service.publishEvent({
      page: "LocalPage",
      sortMethod: sortMethod
    });
    this.popoverController.dismiss();
  }
}
