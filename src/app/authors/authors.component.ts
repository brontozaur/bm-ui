import {Component, OnInit} from '@angular/core';
import {LoggingService} from '../logging.service';
import Tabulator from 'tabulator-tables';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthorsService} from './authors.service';
import {Author} from "./author.model";
import {AuthenticationService} from "../auth/authentication.service";

@Component({
    selector: 'app-users',
    templateUrl: './authors.component.html',
    styleUrls: ['./authors.component.css',
        '../app.component.css']
})
export class AuthorsComponent implements OnInit {

    private authors: Author[] = [];
    private table;
    searchTerm: string = "";

    constructor(private router: Router,
                private route: ActivatedRoute,
                private loggingService: LoggingService,
                private authorsServer: AuthorsService,
                private authenticationService: AuthenticationService
    ) {
    }

    ngOnInit() {
        var editIcon = function (cell, formatterParams, onRendered) {
            return '<i class=\'fas fa-pencil-alt\'></i>';
        };

        var goToFcn = function (id) {
            this.router.navigate(['edit-authors/' + id]);
        };

        this.table = new Tabulator('#authors-table', {
            data: this.authors,
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
            ajaxURL: "http://localhost:8080/api/v1/authors/filter",
            ajaxURLGenerator: (url, config, params) => {
                params.searchTerm = this.searchTerm;
                if (this.authenticationService.currentUserValue) {
                    config.headers = {
                        'Authorization': `Bearer ${this.authenticationService.currentUserValue.accessToken}`
                    };
                }
                return url + "?params=" + encodeURI(JSON.stringify(params));
            },
            paginationSize: 20,
            initialSort: [
                {column: 'id', dir: 'desc'},
            ],
            columns: [
                {title: 'Edit', formatter: editIcon, width: 60, hozAlign: 'center', headerSort: false},
                {title: 'Id', field: 'id', width: 60},
                {title: 'First name', field: 'firstName'},
                {title: 'Last name', field: 'lastName'},
                {title: 'Delete', formatter: 'buttonCross', hozAlign: 'center', width: 100, headerSort: false},
            ],
            rowDblClick: (e, row) => {
                this.router.navigate([`/edit-authors/${row.getData().id}`]);
            },
            cellClick: (e, cell) => {
                if (cell.getColumn().getDefinition().title == "Edit") {
                    this.router.navigate([`/edit-authors/${cell.getData().id}`]);
                } else if (cell.getColumn().getDefinition().title == "Delete") {
                    this.authorsServer.deleteAuthor(cell.getData().id);
                    cell.getRow().delete();
                }
            }
        });
        this.table.setData();
    }

    onNewAuthor() {
        this.router.navigate(['edit-authors/0']);
    }

    onSearch() {
        this.table.setData();
    }

}
