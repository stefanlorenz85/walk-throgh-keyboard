import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { KeyComponent } from './key/key.component';

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [AppComponent, KeyComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
