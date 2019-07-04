import { Component, OnInit } from '@angular/core';
import { ViewerService } from '../../viewer.service';
import {EditorService} from '../../editor.service';
@Component({
  selector: 'app-menusidebar',
  templateUrl: './menusidebar.component.html',
  styleUrls: ['./menusidebar.component.css']
})
export class MenusidebarComponent implements OnInit {

  constructor(private editorSevice: EditorService, private viewerservice : ViewerService) {
  }

  ngOnInit() {
  }

  beautify() {
    this.editorSevice.onBeautifyClick();
  }

  clearCode() {
    this.editorSevice.onClearCode();
  }

  run() {
    this.editorSevice.onRunQuery();   
    console.log('execute');
  }

  getHistory() {
    this.editorSevice.onHistoryClick();
  }

}
