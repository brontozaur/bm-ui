import {Component, OnDestroy, OnInit} from '@angular/core';
import {LoggingService} from '../logging.service';
import Tabulator from 'tabulator-tables';
import {ActivatedRoute, Router} from '@angular/router';
import {DistributorsService} from './distributors.service';
import {Distributor} from "./distributor.model";

@Component({
    selector: 'app-distributors',
    templateUrl: './distributors.component.html',
    styleUrls: ['./distributors.component.css',
        '../app.component.css']
})
export class DistributorsComponent implements OnInit, OnDestroy {

    private distributors: Distributor[] = [];
    private table;
    searchTerm: string = "";

    constructor(private router: Router,
                private route: ActivatedRoute,
                private loggingService: LoggingService,
                private distributorsServer: DistributorsService
    ){}

    ngOnInit() {
        var editIcon = function (cell, formatterParams, onRendered) {
            return '<i class=\'fas fa-pencil-alt\'></i>';
        };

        var goToFcn = function (id) {
            this.router.navigate(['edit-distributors/' + id]);
        };

        this.table = new Tabulator('#distributors-table', {
            data: this.distributors,
            height: 'calc(100vh - 250px)',
            layout: 'fitColumns',
            addRowPos: 'top',
            ajaxFiltering: true,
            pagination: "remote",
            ajaxConfig: "POST",
            paginationDataSent: { // override the sent params for pagination
                "page": "pageNumber",
                "size": "pageSize"
            },
            paginationDataReceived: { // override the received pagination default properties
                "last_page": "totalPages",
                "current_page": "number",
                "data": "content"
            },
            paginationSizeSelector: [5, 10, 15, 20, 50, 100, 500, 1000],
            ajaxURL: "http://localhost:8080/api/v1/distributors/filter",
            ajaxURLGenerator: (url, config, params) => {
                params.searchTerm = this.searchTerm;
                return url + "?params=" + encodeURI(JSON.stringify(params));
            },
            paginationSize: 20,
            initialSort: [
                {column: 'id', dir: 'desc'},
            ],
            columns: [
                {title: 'Edit', formatter: editIcon, width: 60, align: 'center', headerSort: false},
                {title: 'Id', field: 'id', width: 60},
                {title: 'Uid', field: 'uid'},
                {title: 'Name', field: 'name'},
                {title: 'Distributor URL', field: 'distributorUrl'},
                {title: 'Notify URL', field: 'notifyUrl'},
                {title: 'Country', field: 'country'},
                {title: 'Description', field: 'description'},
                {title: 'Max loan count', field: 'maxLoanCount'},
                {title: 'Delete', formatter: 'buttonCross', align: 'center', width: 100, headerSort: false},
            ],
            rowDblClick: (e, row) => {
                this.router.navigate([`/edit-distributors/${row.getData().id}`]);
            },
            cellClick: (e, cell) => {
                if (cell.getColumn().getDefinition().title == "Edit") {
                    this.router.navigate([`/edit-distributors/${cell.getData().id}`]);
                } else if(cell.getColumn().getDefinition().title == "Delete"){
                    this.distributorsServer.deleteDistributor(cell.getData().id);
                    cell.getRow().delete();
                }
            }
        });
        this.table.setData();
    }

    onNewDistributor() {
        this.router.navigate(['edit-distributors/0']);
    }
    reloadDistributors() {
        this.distributorsServer.reloadDistributors(this.table);
    }

    ngOnDestroy() {}
}
