import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DmMenuPage } from './dm-menu.page';

const routes: Routes = [
  {
    path: '',
    component: DmMenuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DmMenuPageRoutingModule {}
