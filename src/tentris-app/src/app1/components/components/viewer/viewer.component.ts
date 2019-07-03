import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MatTabChangeEvent } from '@angular/material';
import { ViewerService } from '../../viewer.service';
import { isNullOrUndefined } from 'util';

let columnList = ["article", "property", "value"]; // Dummy data [ This data comes from "head":{"vars": ____} of the http response
// THe below data comes from "results":{"bindings":[ _______]} part of the http response
const ELEMENT_DATA = [{ "article": { "type": "uri", "value": "http:\/\/localhost\/publications\/articles\/Journal1\/1940\/Article14" }, "property": { "type": "uri", "value": "http:\/\/swrc.ontoware.org\/ontology#pages" }, "value": { "type": "literal", "value": "138", "datatype": "http://www.w3.org/2001/XMLSchema#integer" } }, { "article": { "type": "uri", "value": "http:\/\/localhost\/publications\/articles\/Journal1\/1942\/Article7" }, "property": { "type": "uri", "value": "http:\/\/xmlns.com\/foaf\/0.1\/homepage" }, "value": { "type": "literal", "value": "http:\/\/www.mongoloids.tld\/raunchiness\/perspicuously.html" } }, { "article": { "type": "uri", "value": "http:\/\/localhost\/publications\/articles\/Journal1\/1940\/Article2" }, "property": { "type": "uri", "value": "http:\/\/purl.org\/dc\/elements\/1.1\/creator" }, "value": { "type": "uri", "value": "http:\/\/localhost\/persons\/Paul_Erdoes" } }, { "article": { "type": "uri", "value": "http:\/\/localhost\/publications\/articles\/Journal1\/1941\/Article17" }, "property": { "type": "uri", "value": "http:\/\/www.w3.org\/1999\/02\/22-rdf-syntax-ns#type" }, "value": { "type": "uri", "value": "http:\/\/localhost\/vocabulary\/bench\/Article" } }, { "article": { "type": "uri", "value": "http:\/\/localhost\/publications\/articles\/Journal1\/1942\/Article9" }, "property": { "type": "uri", "value": "http:\/\/swrc.ontoware.org\/ontology#pages" }, "value": { "type": "literal", "value": "80", "datatype": "http://www.w3.org/2001/XMLSchema#integer" } }, { "article": { "type": "uri", "value": "http:\/\/localhost\/publications\/articles\/Journal1\/1940\/Article18" }, "property": { "type": "uri", "value": "http:\/\/www.w3.org\/1999\/02\/22-rdf-syntax-ns#type" }, "value": { "type": "uri", "value": "http:\/\/localhost\/vocabulary\/bench\/Article" } }, { "article": { "type": "uri", "value": "http:\/\/localhost\/publications\/articles\/Journal1\/1940\/Article14" }, "property": { "type": "uri", "value": "http:\/\/swrc.ontoware.org\/ontology#pages" }, "value": { "type": "literal", "value": "138", "datatype": "http://www.w3.org/2001/XMLSchema#integer" } }, { "article": { "type": "uri", "value": "http:\/\/localhost\/publications\/articles\/Journal1\/1942\/Article7" }, "property": { "type": "uri", "value": "http:\/\/xmlns.com\/foaf\/0.1\/homepage" }, "value": { "type": "literal", "value": "http:\/\/www.mongoloids.tld\/raunchiness\/perspicuously.html" } }, { "article": { "type": "uri", "value": "http:\/\/localhost\/publications\/articles\/Journal1\/1940\/Article2" }, "property": { "type": "uri", "value": "http:\/\/purl.org\/dc\/elements\/1.1\/creator" }, "value": { "type": "uri", "value": "http:\/\/localhost\/persons\/Paul_Erdoes" } }, { "article": { "type": "uri", "value": "http:\/\/localhost\/publications\/articles\/Journal1\/1941\/Article17" }, "property": { "type": "uri", "value": "http:\/\/www.w3.org\/1999\/02\/22-rdf-syntax-ns#type" }, "value": { "type": "uri", "value": "http:\/\/localhost\/vocabulary\/bench\/Article" } }, { "article": { "type": "uri", "value": "http:\/\/localhost\/publications\/articles\/Journal1\/1942\/Article9" }, "property": { "type": "uri", "value": "http:\/\/swrc.ontoware.org\/ontology#pages" }, "value": { "type": "literal", "value": "80", "datatype": "http://www.w3.org/2001/XMLSchema#integer" } }, { "article": { "type": "uri", "value": "http:\/\/localhost\/publications\/articles\/Journal1\/1940\/Article18" }, "property": { "type": "uri", "value": "http:\/\/www.w3.org\/1999\/02\/22-rdf-syntax-ns#type" }, "value": { "type": "uri", "value": "http:\/\/localhost\/vocabulary\/bench\/Article" } }, { "article": { "type": "uri", "value": "http:\/\/localhost\/publications\/articles\/Journal1\/1940\/Article14" }, "property": { "type": "uri", "value": "http:\/\/swrc.ontoware.org\/ontology#pages" }, "value": { "type": "literal", "value": "138", "datatype": "http://www.w3.org/2001/XMLSchema#integer" } }, { "article": { "type": "uri", "value": "http:\/\/localhost\/publications\/articles\/Journal1\/1942\/Article7" }, "property": { "type": "uri", "value": "http:\/\/xmlns.com\/foaf\/0.1\/homepage" }, "value": { "type": "literal", "value": "http:\/\/www.mongoloids.tld\/raunchiness\/perspicuously.html" } }, { "article": { "type": "uri", "value": "http:\/\/localhost\/publications\/articles\/Journal1\/1940\/Article2" }, "property": { "type": "uri", "value": "http:\/\/purl.org\/dc\/elements\/1.1\/creator" }, "value": { "type": "uri", "value": "http:\/\/localhost\/persons\/Paul_Erdoes" } }, { "article": { "type": "uri", "value": "http:\/\/localhost\/publications\/articles\/Journal1\/1941\/Article17" }, "property": { "type": "uri", "value": "http:\/\/www.w3.org\/1999\/02\/22-rdf-syntax-ns#type" }, "value": { "type": "uri", "value": "http:\/\/localhost\/vocabulary\/bench\/Article" } }, { "article": { "type": "uri", "value": "http:\/\/localhost\/publications\/articles\/Journal1\/1942\/Article9" }, "property": { "type": "uri", "value": "http:\/\/swrc.ontoware.org\/ontology#pages" }, "value": { "type": "literal", "value": "80", "datatype": "http://www.w3.org/2001/XMLSchema#integer" } }, { "article": { "type": "uri", "value": "http:\/\/localhost\/publications\/articles\/Journal1\/1940\/Article18" }, "property": { "type": "uri", "value": "http:\/\/www.w3.org\/1999\/02\/22-rdf-syntax-ns#type" }, "value": { "type": "uri", "value": "http:\/\/localhost\/vocabulary\/bench\/Article" } }];
// ["x", "hpage", "name", "mbox", "age", "blurb", "friend"];
// [{ "x": { "type": "bnode", "value": "r1" }, "hpage": { "type": "uri", "value": "http://work.example.org/alice/" }, "name": { "type": "literal", "value": "Alice" }, "mbox": { "type": "literal", "value": "" }, "blurb": { "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral", "type": "literal", "value": "<p xmlns=\"http://www.w3.org/1999/xhtml\">My name is <b>alice</b></p>" }, "friend": { "type": "bnode", "value": "r2" } }, { "x": { "type": "bnode", "value": "r2" }, "hpage": { "type": "uri", "value": "http://work.example.org/bob/" }, "name": { "type": "literal", "value": "Bob", "xml:lang": "en" }, "mbox": { "type": "uri", "value": "mailto:bob@work.example.org" }, "friend": { "type": "bnode", "value": "r1" } }];
const dummy_beautified = "{\n\t\"head\":{\n\t\t\"vars\":[\n\t\t\t\"article\",\n\t\t\t\"property\",\n\t\t\t\"value\"\n\t]\n},\n\t\"results\":{\n\t\t\"bindings\":[\n{\n\t\t\t\"article\":{\n\t\t\t\t\"type\":\"uri\",\n\t\t\t\t\"value\":\"http:\/\/localhost\/publications\/articles\/Journal1\/1940\/Article14\"\n\t\t\t},\n\t\t\t\"property\":{\n\t\t\t\t\"type\":\"uri\",\n\t\t\t\t\"value\":\"http:\/\/swrc.ontoware.org\/ontology#pages\"\n\t\t\t},\n\t\t\t\"value\":{\n\t\t\t\t\"type\":\"literal\",\n\t\t\t\t\"value\":\"138\",\n\t\t\t\t\"datatype\":\"http://www.w3.org/2001/XMLSchema#integer\"\n}\n}\n\t]\n}\n}";
// To test sorting easily
//const ELEMENT_DATA = [{"article":{"type":"uri","value":"A1"}, "property": {"type":"uri","value":"AA1"}, "value": {"type":"literal","value":"AAA1"}}, {"article":{"type":"uri","value":"B1"}, "property": {"type":"uri","value":"BB1"}, "value": {"type":"literal","value":"BBB1"}},{"article":{"type":"uri","value":"C1"}, "property": {"type":"uri","value":"CC1"}, "value": {"type":"literal","value":"CCC1"}},{"article":{"type":"uri","value":"D1"}, "property": {"type":"uri","value":"DD1"}, "value": {"type":"literal","value":"DDD1"}},{"article":{"type":"uri","value":"E1"}, "property": {"type":"uri","value":"EE1"}, "value": {"type":"literal","value":"EEE1"}}];
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
  displayedColumns: string[] = columnList;
  //dataSource = ELEMENT_DATA;
  dataSource = new MatTableDataSource(ELEMENT_DATA); //<any>
  beautified = [];
  disableVal = false;
  disableVal2 = true;
  mainFilterValue = "";
  badgeFlag = false;
  pgSizeOptions = [5, 10, 20, 30, 50, 100, 500];

  constructor( private viewerservice : ViewerService ) {}

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
    if (ELEMENT_DATA.length > 500) {
      this.pgSizeOptions.push(ELEMENT_DATA.length);
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
    this.dataSource.sort = this.sort;

    this.viewerservice.subsVar = this.viewerservice.invokeresult.subscribe(() => {
      this.onrunclick();
    });

    /*var JSONdata: DataResponse;
    this.viewerservice.getJSON().subscribe(data =>{
      JSONdata=<DataResponse>data; //JSON data stored as defined by the interface
      console.log(JSONdata.head); //JSON header can be accessed like this and can be seen in console
      console.log(JSONdata.results); //JSON result can be accessed like this and can be seen in console
    });*/
  }
  onrunclick()
  {
    var JSONdata: DataResponse;
    this.viewerservice.getJSON().subscribe(data =>{
      JSONdata=<DataResponse>data; //JSON data stored as defined by the interface
      console.log(JSONdata.head); //JSON header can be accessed like this and can be seen in console
      console.log(JSONdata.results); //JSON result can be accessed like this and can be seen in console
    });
  }
  csv() {
    let content = []; let headers = [];
    for (const header of columnList) {
      headers.push('"' + header + '"');
    }
    content.push(headers.join(','));
    for (const row of ELEMENT_DATA) {
      const values = columnList.map(header => {
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
      data = JSON.stringify(ELEMENT_DATA, null, 2);
      partFileName = "FormattedJSON_";
    }
    else {
      data = JSON.stringify(ELEMENT_DATA);
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
    let dataValues = Object.values(ELEMENT_DATA);
    for (let th = 0; th < columnList.length; th++) {
      ht = ht + ("<th>" + columnList[th] + "</th>");
    }
    for (let i = 0; i < dataValues.length; i++) {
      td = "";
      for (let j = 0; j < columnList.length; j++) {
        td = td + ("<td>" + (isNullOrUndefined(dataValues[i][columnList[j]]) ? "" : dataValues[i][columnList[j]].value) + "</td>");
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
      this.beautified = ELEMENT_DATA;
    }
  }
  toggleBadge() {
    this.badgeFlag = !this.badgeFlag;
  }
}
