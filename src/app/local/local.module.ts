import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocalPageRoutingModule } from './local-routing.module';

import { ComponentsModule } from '../components/components.module';
import { FilterDateLocalComponent } from './filter-date-local/filter-date-local.component';
import { SortLocalComponent } from './sort-local/sort-local.component';

import { LocalPage } from './local.page';
import { HomePage } from '../home/home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocalPageRoutingModule,
    ComponentsModule
  ],
  declarations: [LocalPage, FilterDateLocalComponent, SortLocalComponent],
  entryComponents: [FilterDateLocalComponent, SortLocalComponent],
  providers: [HomePage]
})
export class LocalPageModule {}
