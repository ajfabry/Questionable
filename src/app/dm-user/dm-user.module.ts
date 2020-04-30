import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DmUserPageRoutingModule } from './dm-user-routing.module';

import { DmUserPage } from './dm-user.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DmUserPageRoutingModule
  ],
  declarations: [DmUserPage]
})
export class DmUserPageModule {}
