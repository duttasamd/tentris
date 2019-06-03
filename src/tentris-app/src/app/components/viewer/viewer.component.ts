import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';

let columnList = ["article", "property", "value"]; // Dummy data [ This data comes from "head":{"vars": ____} of the http response
// THe below data comes from "results":{"bindings":[ _______]} part of the http response
const ELEMENT_DATA = [{ "article": { "type": "uri", "value": "http:\/\/localhost\/publications\/articles\/Journal1\/1940\/Article14" }, "property": { "type": "uri", "value": "http:\/\/swrc.ontoware.org\/ontology#pages" }, "value": { "type": "literal", "value": "138", "datatype": "http://www.w3.org/2001/XMLSchema#integer" } }, { "article": { "type": "uri", "value": "http:\/\/localhost\/publications\/articles\/Journal1\/1942\/Article7" }, "property": { "type": "uri", "value": "http:\/\/xmlns.com\/foaf\/0.1\/homepage" }, "value": { "type": "literal", "value": "http:\/\/www.mongoloids.tld\/raunchiness\/perspicuously.html" } }, { "article": { "type": "uri", "value": "http:\/\/localhost\/publications\/articles\/Journal1\/1940\/Article2" }, "property": { "type": "uri", "value": "http:\/\/purl.org\/dc\/elements\/1.1\/creator" }, "value": { "type": "uri", "value": "http:\/\/localhost\/persons\/Paul_Erdoes" } }, { "article": { "type": "uri", "value": "http:\/\/localhost\/publications\/articles\/Journal1\/1941\/Article17" }, "property": { "type": "uri", "value": "http:\/\/www.w3.org\/1999\/02\/22-rdf-syntax-ns#type" }, "value": { "type": "uri", "value": "http:\/\/localhost\/vocabulary\/bench\/Article" } }, { "article": { "type": "uri", "value": "http:\/\/localhost\/publications\/articles\/Journal1\/1942\/Article9" }, "property": { "type": "uri", "value": "http:\/\/swrc.ontoware.org\/ontology#pages" }, "value": { "type": "literal", "value": "80", "datatype": "http://www.w3.org/2001/XMLSchema#integer" } }, { "article": { "type": "uri", "value": "http:\/\/localhost\/publications\/articles\/Journal1\/1940\/Article18" }, "property": { "type": "uri", "value": "http:\/\/www.w3.org\/1999\/02\/22-rdf-syntax-ns#type" }, "value": { "type": "uri", "value": "http:\/\/localhost\/vocabulary\/bench\/Article" } }, { "article": { "type": "uri", "value": "http:\/\/localhost\/publications\/articles\/Journal1\/1940\/Article14" }, "property": { "type": "uri", "value": "http:\/\/swrc.ontoware.org\/ontology#pages" }, "value": { "type": "literal", "value": "138", "datatype": "http://www.w3.org/2001/XMLSchema#integer" } }, { "article": { "type": "uri", "value": "http:\/\/localhost\/publications\/articles\/Journal1\/1942\/Article7" }, "property": { "type": "uri", "value": "http:\/\/xmlns.com\/foaf\/0.1\/homepage" }, "value": { "type": "literal", "value": "http:\/\/www.mongoloids.tld\/raunchiness\/perspicuously.html" } }, { "article": { "type": "uri", "value": "http:\/\/localhost\/publications\/articles\/Journal1\/1940\/Article2" }, "property": { "type": "uri", "value": "http:\/\/purl.org\/dc\/elements\/1.1\/creator" }, "value": { "type": "uri", "value": "http:\/\/localhost\/persons\/Paul_Erdoes" } }, { "article": { "type": "uri", "value": "http:\/\/localhost\/publications\/articles\/Journal1\/1941\/Article17" }, "property": { "type": "uri", "value": "http:\/\/www.w3.org\/1999\/02\/22-rdf-syntax-ns#type" }, "value": { "type": "uri", "value": "http:\/\/localhost\/vocabulary\/bench\/Article" } }, { "article": { "type": "uri", "value": "http:\/\/localhost\/publications\/articles\/Journal1\/1942\/Article9" }, "property": { "type": "uri", "value": "http:\/\/swrc.ontoware.org\/ontology#pages" }, "value": { "type": "literal", "value": "80", "datatype": "http://www.w3.org/2001/XMLSchema#integer" } }, { "article": { "type": "uri", "value": "http:\/\/localhost\/publications\/articles\/Journal1\/1940\/Article18" }, "property": { "type": "uri", "value": "http:\/\/www.w3.org\/1999\/02\/22-rdf-syntax-ns#type" }, "value": { "type": "uri", "value": "http:\/\/localhost\/vocabulary\/bench\/Article" } }, { "article": { "type": "uri", "value": "http:\/\/localhost\/publications\/articles\/Journal1\/1940\/Article14" }, "property": { "type": "uri", "value": "http:\/\/swrc.ontoware.org\/ontology#pages" }, "value": { "type": "literal", "value": "138", "datatype": "http://www.w3.org/2001/XMLSchema#integer" } }, { "article": { "type": "uri", "value": "http:\/\/localhost\/publications\/articles\/Journal1\/1942\/Article7" }, "property": { "type": "uri", "value": "http:\/\/xmlns.com\/foaf\/0.1\/homepage" }, "value": { "type": "literal", "value": "http:\/\/www.mongoloids.tld\/raunchiness\/perspicuously.html" } }, { "article": { "type": "uri", "value": "http:\/\/localhost\/publications\/articles\/Journal1\/1940\/Article2" }, "property": { "type": "uri", "value": "http:\/\/purl.org\/dc\/elements\/1.1\/creator" }, "value": { "type": "uri", "value": "http:\/\/localhost\/persons\/Paul_Erdoes" } }, { "article": { "type": "uri", "value": "http:\/\/localhost\/publications\/articles\/Journal1\/1941\/Article17" }, "property": { "type": "uri", "value": "http:\/\/www.w3.org\/1999\/02\/22-rdf-syntax-ns#type" }, "value": { "type": "uri", "value": "http:\/\/localhost\/vocabulary\/bench\/Article" } }, { "article": { "type": "uri", "value": "http:\/\/localhost\/publications\/articles\/Journal1\/1942\/Article9" }, "property": { "type": "uri", "value": "http:\/\/swrc.ontoware.org\/ontology#pages" }, "value": { "type": "literal", "value": "80", "datatype": "http://www.w3.org/2001/XMLSchema#integer" } }, { "article": { "type": "uri", "value": "http:\/\/localhost\/publications\/articles\/Journal1\/1940\/Article18" }, "property": { "type": "uri", "value": "http:\/\/www.w3.org\/1999\/02\/22-rdf-syntax-ns#type" }, "value": { "type": "uri", "value": "http:\/\/localhost\/vocabulary\/bench\/Article" } }];
const dummy_beautified = "{\n\t\"head\":{\n\t\t\"vars\":[\n\t\t\t\"article\",\n\t\t\t\"property\",\n\t\t\t\"value\"\n\t]\n},\n\t\"results\":{\n\t\t\"bindings\":[\n{\n\t\t\t\"article\":{\n\t\t\t\t\"type\":\"uri\",\n\t\t\t\t\"value\":\"http:\/\/localhost\/publications\/articles\/Journal1\/1940\/Article14\"\n\t\t\t},\n\t\t\t\"property\":{\n\t\t\t\t\"type\":\"uri\",\n\t\t\t\t\"value\":\"http:\/\/swrc.ontoware.org\/ontology#pages\"\n\t\t\t},\n\t\t\t\"value\":{\n\t\t\t\t\"type\":\"literal\",\n\t\t\t\t\"value\":\"138\",\n\t\t\t\t\"datatype\":\"http://www.w3.org/2001/XMLSchema#integer\"\n}\n}\n\t]\n}\n}";
// To test sorting easily
//const ELEMENT_DATA = [{"article":{"type":"uri","value":"A1"}, "property": {"type":"uri","value":"AA1"}, "value": {"type":"literal","value":"AAA1"}}, {"article":{"type":"uri","value":"B1"}, "property": {"type":"uri","value":"BB1"}, "value": {"type":"literal","value":"BBB1"}},{"article":{"type":"uri","value":"C1"}, "property": {"type":"uri","value":"CC1"}, "value": {"type":"literal","value":"CCC1"}},{"article":{"type":"uri","value":"D1"}, "property": {"type":"uri","value":"DD1"}, "value": {"type":"literal","value":"DDD1"}},{"article":{"type":"uri","value":"E1"}, "property": {"type":"uri","value":"EE1"}, "value": {"type":"literal","value":"EEE1"}}];

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css']
})

export class ViewerComponent implements OnInit {
  displayedColumns: string[] = columnList;
  //dataSource = ELEMENT_DATA;
  dataSource = new MatTableDataSource(ELEMENT_DATA); //<any>
  beautified = dummy_beautified;
  disableVal = false;
  disableVal2 = true;
  mainFilterValue = "";

  constructor() { }

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
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
    this.dataSource.sort = this.sort;
  }
  clearFilter() {
    this.dataSource.filter = "";
    if(this.mainFilterValue != "") {
      this.mainFilterValue = "";
    }
  }
  mainFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = (data, filter) => {
    let temp = "";  //console.log(data);
    Object.values(data).forEach(element => {// console.log(element);
      if(element["value"] != undefined) { 
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
      if(data[placeHolder]["value"] != undefined) { 
        temp += data[placeHolder]["value"].trim().toLowerCase();
      }
    const dataStr = temp;
    return dataStr.indexOf(filter) != -1; 
    }
  }
}
