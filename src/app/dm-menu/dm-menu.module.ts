import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DmMenuPageRoutingModule } from './dm-menu-routing.module';

import { DmMenuPage } from './dm-menu.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DmMenuPageRoutingModule
  ],
  declarations: [DmMenuPage]
})
export class DmMenuPageModule {}
