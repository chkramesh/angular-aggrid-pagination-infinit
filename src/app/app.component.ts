import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IDatasource, IGetRowsParams, GridOptions, GridApi } from 'ag-grid-community';
@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  gridApi: GridApi;

  gridOptions: GridOptions = {
    // pagination: true,
    rowModelType: 'infinite',
    cacheBlockSize: 20,
    paginationPageSize: 30,
    infiniteInitialRowCount: 2,
    columnDefs: [
      {
        headerName: "ID",
        width: 50,
        valueGetter: "node.id",
        cellRenderer: "loadingCellRenderer",
      },
      {
        headerName: "Name",
        field: "athlete"
      },
      {
        headerName: "Status",
        field: "age"
      },
      {
        headerName: "Country",
        field: "country"
      }
    ],
    components: {
      loadingCellRenderer: (params) =>{
        if (params.value !== undefined) {
          return params.value;
        }else{
          return 'x';
        }
      }
    },
    
  };
 
  dataSource: IDatasource = {
    rowCount: null,
    getRows: (params: IGetRowsParams) => {
      this.apiService().subscribe(data => {
        setTimeout(() => {
          let rowsThisPage = data.slice(params.startRow, params.endRow);
          let lastRow = -1;
          if (data.length <= params.endRow) {
            lastRow = data.length;
          }
          params.successCallback(
            rowsThisPage, lastRow
          );
        }, 500);
      });
    }
  }

  constructor(private http: HttpClient) {}
  apiService() {
    return this.http.get('https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinners.json')
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
    this.gridApi.setDatasource(this.dataSource);
  }
}
