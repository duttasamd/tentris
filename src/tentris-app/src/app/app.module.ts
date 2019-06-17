import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MenusidebarComponent } from './components/menusidebar/menusidebar.component';
import { EditorComponent } from './components/editor/editor.component';
import { ViewerComponent } from './components/viewer/viewer.component';
import {EditorService} from './editor.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// tslint:disable-next-line:max-line-length
import { MatTableModule, MatTabsModule, MatButtonModule, MatListModule, MatPaginatorModule, MatSortModule, MatInputModule, MatProgressSpinnerModule, MatSlideToggleModule, MatCheckboxModule, MatTooltipModule, MatMenuModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {HistoryModalComponent} from './components/history-modal/history-modal.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MenusidebarComponent,
    EditorComponent,
    ViewerComponent,
    HistoryModalComponent
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
    HttpClientModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatMenuModule,
    NgbModule
  ],
  providers: [EditorService],
  bootstrap: [AppComponent],
  entryComponents: [HistoryModalComponent]
})
export class AppModule { }
