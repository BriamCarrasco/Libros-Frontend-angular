import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { AdminLibrosComponent } from './admin-libros/admin-libros.component';
import { TopbarComponent } from './topbar/topbar.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    AdminLibrosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TopbarComponent,
    HttpClientModule,
    FormsModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }