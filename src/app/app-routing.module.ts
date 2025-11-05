import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLibrosComponent } from './admin-libros/admin-libros.component';

const routes: Routes = [
  { path: '', component: AdminLibrosComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
