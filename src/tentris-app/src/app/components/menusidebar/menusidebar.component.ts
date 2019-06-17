import { Component, OnInit } from '@angular/core';
import {HistoryModalComponent} from '../history-modal/history-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {EditorService} from '../../editor.service';

@Component({
  selector: 'app-menusidebar',
  templateUrl: './menusidebar.component.html',
  styleUrls: ['./menusidebar.component.css']
})
export class MenusidebarComponent implements OnInit {

  constructor(private editorSevice: EditorService, private modalService: NgbModal) {
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

  openHistoryModal() {
    this.modalService.open(HistoryModalComponent, {windowClass: 'historyModal', size: 'lg'});
    // modalRef.componentInstance.user = this.user;
  }

}
