import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MatTabChangeEvent } from '@angular/material';
import { ViewerService } from '../../viewer.service';
import { isNullOrUndefined } from 'util';

interface DataResponse {
  head: String;
  results: String;
}
@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css']
})

export class ViewerComponent implements OnInit {
  displayedColumns: string[] = [];
  ELEMENT_DATA = [];
  dataSource: MatTableDataSource<any>;
  beautified = [];
  disableVal = false;
  disableVal2 = true;
  mainFilterValue = "";
  badgeFlag = false;
  pgSizeOptions = [5, 10, 20, 30, 50, 100, 500];

  constructor( private data: ViewerService ) {}

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  sortingDataAccessor(item, property) {
    return item[property].value;
  }

  toggle() {
    this.disableVal = !this.disableVal;
    this.disableVal2 = !this.disableVal2;
    this.clearFilter();
  }

  ngOnInit() {
    this.data.subsVar = this.data.invokeresult.subscribe(() => {
      this.getjsonresult();
    });
  }
  getjsonresult()
  {
    var JSONdata: DataResponse;
    this.data.getJSON().subscribe(data =>{
      JSONdata=<DataResponse>data; //JSON data stored as defined by the interface
      console.log(JSONdata.head); //JSON header can be accessed like this and can be seen in console
      console.log(JSONdata.results); //JSON result can be accessed like this and can be seen in console
      this.ELEMENT_DATA = JSONdata.results['bindings'];
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      this.displayedColumns = JSONdata.head['vars'];
      if (this.ELEMENT_DATA.length > 50) {
        this.pgSizeOptions.push(this.ELEMENT_DATA.length);
      }
      this.dataSource.paginator = this.paginator;
      this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
      this.dataSource.sort = this.sort;      
    });
  }
  csv() {
    let content = []; let headers = [];
    for (const header of this.displayedColumns) {
      headers.push('"' + header + '"');
    }
    content.push(headers.join(','));
    for (const row of this.ELEMENT_DATA) {
      const values = this.displayedColumns.map(header => {
        return '"' + row[header].value + '"';
      })
      content.push(values.join(','));
    }
    let blob = new Blob([content.join('\n')], { type: 'text/csv' });
    let url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'CSV_' + new Date().toISOString().replace(/[:.TZ-]/g, "") + '.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  json(formattedFlag: number) {
    let data, partFileName;
    if (formattedFlag == 1) {
      data = JSON.stringify(this.ELEMENT_DATA, null, 2);
      partFileName = "FormattedJSON_";
    }
    else {
      data = JSON.stringify(this.ELEMENT_DATA);
      partFileName = "UnformattedJSON_";
    }
    let blob = new Blob([data], { type: 'text/json' });
    let url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', partFileName + new Date().toISOString().replace(/[:.TZ-]/g, "") + '.json');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  html() {
    let ht = "", td = "", tr = "";
    let template = "<html><style type=\"text/css\">.tg  {border-collapse:collapse;border-spacing:0;text-align:left;vertical-align:top}.tg td{font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:black;}.tg th{font-family:Arial, sans-serif;font-size:14px;font-weight:normal;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:black; background-color:aliceblue;}</style><body><table class=\"tg\"><tr>";
    let dataValues = Object.values(this.ELEMENT_DATA);
    for (let th = 0; th < this.displayedColumns.length; th++) {
      ht = ht + ("<th>" + this.displayedColumns[th] + "</th>");
    }
    for (let i = 0; i < dataValues.length; i++) {
      td = "";
      for (let j = 0; j < this.displayedColumns.length; j++) {
        td = td + ("<td>" + (isNullOrUndefined(dataValues[i][this.displayedColumns[j]]) ? "" : dataValues[i][this.displayedColumns[j]].value) + "</td>");
      }
      tr = tr + ("<tr>" + td + "</tr>");
    }
    let htmlText = template +
      ht + "</tr>" + tr + "</table></body></html>";
    let blob = new Blob([htmlText], { type: 'text/html' });
    let url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'HtmlTable_' + new Date().toISOString().replace(/[:.TZ-]/g, "") + '.html');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  clearFilter() {
    this.dataSource.filter = "";
    if (this.mainFilterValue != "") {
      this.mainFilterValue = "";
    }
  }
  mainFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = (data, filter) => {
      let temp = "";  //console.log(data);
      Object.values(data).forEach(element => {// console.log(element);
        if (element["value"] != undefined) {
          temp += element["value"].trim().toLowerCase();
        }
      });
      const dataStr = temp;
      return dataStr.indexOf(filter) != -1;
    }
  }
  colFilter(filterValue: string, placeHolder: string) {
    //console.log("Event");
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = (data, filter) => {
      let temp = "";  //console.log(data[placeHolder]["value"]);
      if (data[placeHolder] != undefined && data[placeHolder]["value"] != undefined) {
        temp += data[placeHolder]["value"].trim().toLowerCase();
      }
      const dataStr = temp;
      return dataStr.indexOf(filter) != -1;
    }
  }
  onJsonRequest(indx: MatTabChangeEvent) {
    if (indx.toString() == "1") {
      this.beautified = this.ELEMENT_DATA;
    }
  }
  toggleBadge() {
    this.badgeFlag = !this.badgeFlag;
  }
}
