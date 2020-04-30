import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DmUserPage } from './dm-user.page';

const routes: Routes = [
  {
    path: '',
    component: DmUserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DmUserPageRoutingModule {}
