import {Component, OnInit} from '@angular/core';
import {EditorService} from '../../editor.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {isUndefined} from 'util';

@Component({
  selector: 'app-history-modal',
  templateUrl: './history-modal.component.html',
  styleUrls: ['./history-modal.component.css']
})
export class HistoryModalComponent implements OnInit {

  historyList = [];

  constructor(private editorService: EditorService, private modalService: NgbModal) {
  }

  ngOnInit() {
    const history = this.editorService.getData('history');
    this.historyList = history;
    console.log(history);
  }

  pickquery(i) {
    console.log('pick query works!' + i);
    if (isUndefined(i) || i === -1) {
      this.editorService.onHistoryPick();
      this.modalService.dismissAll();
    } else {
      this.editorService.setData('selectedindex', i);
    }
  }

}
