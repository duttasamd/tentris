import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MenusidebarComponent } from './components/menusidebar/menusidebar.component';
import { EditorComponent } from './components/editor/editor.component';
import { ViewerComponent } from './components/viewer/viewer.component';
import {EditorService} from './editor.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule, MatTabsModule, MatButtonModule, MatListModule, MatPaginatorModule, MatSortModule, MatInputModule, MatProgressSpinnerModule, MatSlideToggleModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MenusidebarComponent,
    EditorComponent,
    ViewerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatTabsModule,
    MatButtonModule,
    MatListModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [EditorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
