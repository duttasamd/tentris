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
  pgSizeOptions: number[] = [5, 10, 50, 100, 500];
  spinnerFlag = false;

  constructor( private data: ViewerService ) {}

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  sortingDataAccessor(item, property) {
    return item[property].value;
  }
  /*
  * This method is to toggle between Table level filter and Column level filter in the viewer
  */
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
      this.spinnerFlag = true;
      JSONdata=<DataResponse>data; //JSON data stored as defined by the interface
      console.log(JSONdata.head); //JSON header can be accessed like this and can be seen in console
      console.log(JSONdata.results); //JSON result can be accessed like this and can be seen in console
      this.ELEMENT_DATA = JSONdata.results['bindings'];
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      this.displayedColumns = JSONdata.head['vars'];
      this.pgSizeOptions = [5, 10, 50, 100, 500]; //Re-initialized to handle a case
      /*
      * This condition checks if the returned output has more rows than 500 or not. If it has, then
      * it adds that to the page size options 'list'. The last child of the list is displayed as 'All'
      */
      if (this.ELEMENT_DATA.length > 500) {
        this.pgSizeOptions.push(this.ELEMENT_DATA.length);
      }
      else {
        this.pgSizeOptions.push(500);
      }
      this.paginator.pageSizeOptions = this.pgSizeOptions;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
      this.dataSource.sort = this.sort;
      this.spinnerFlag = false;
    });
  }
  /*
  * This method generates a CSV file from the output of the query when it is 
  * requested to be downloaded
  */
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
  /*
  * This method generates a JSON file from the output of the query when it is 
  * requested to be downloaded. The JSON file can be in a formatted or unformatted state,
  * depending on the type of request
  */
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
  /*
  * This method generates an HTML file from the output of the query when it is 
  * requested to be downloaded. The HTML file contains the result in a tabular form.
  */
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
  /*
  * This method clears the existing input from the filter when the filter type is changed
  * using the toggle button.
  */
  clearFilter() {
    this.dataSource.filter = "";
    if (this.mainFilterValue != "") {
      this.mainFilterValue = "";
    }
  }
  /*
  * This method takes the input from the table level filter and returns the matched rows from the 
  * whole output dataset.
  */
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
  /*
  * This method takes the input from the column level filter and returns the rows which are  
  * matched in that specific column
  */
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
  /*
  * This method returns the JSON output only when the user clicks on the 'JSON' tab in the viewer.
  * The click event is captured by the parameter of the method. The JSON tab has an index of '1' 
  * in the set of tabs which is what we are checking here.
  */
  onJsonRequest(indx: MatTabChangeEvent) {
    if (indx.toString() == "1") {
      this.beautified = this.ELEMENT_DATA;
    }
  }
  /*
  * This method is used to toggle between showing and not showing the badges in a cell. 
  * These badges represent the 'type' of the data.
  */
  toggleBadge() {
    this.badgeFlag = !this.badgeFlag;
  }
}
