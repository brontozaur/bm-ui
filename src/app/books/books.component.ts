import {Component, OnInit} from '@angular/core';
import {LoggingService} from '../logging.service';
import Tabulator from 'tabulator-tables';
import {ActivatedRoute, Router} from '@angular/router';
import {BooksService} from './books.service';
import {Author} from '../authors/author.model';
import {Book} from "./book.model";
import {NotificationService} from "../notification.service";
import {AuthenticationService} from "../auth/authentication.service";

@Component({
    selector: 'app-books',
    templateUrl: './books.component.html',
    styleUrls: ['./books.component.css',
        '../app.component.css']
})
export class BooksComponent implements OnInit {

    private books: Book[] = [];
    private table;
    private searchTerm: string = "";

    constructor(private router: Router,
                private route: ActivatedRoute,
                private loggingService: LoggingService,
                private booksServer: BooksService,
                private notification: NotificationService,
                private authenticationService: AuthenticationService
    ) {
    }

    ngOnInit() {

        var editIcon = function (cell, formatterParams, onRendered) {
            return '<i class=\'fas fa-pencil-alt\'></i>';
        };

        var statusFormatter = function (cell, formatterParams, onRendered) {
            if (cell.getValue() === 'GREEN') {
                return '<span class=\'status green\'></span>';
            } else if (cell.getValue() === 'RED') {
                return '<span class=\'status red\'></span>';
            } else if (cell.getValue() === 'YELLOW') {
                return '<span class=\'status yellow\'></span>';
            }
        };

        this.table = new Tabulator('#books-table', {
            data: this.books,
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
            ajaxURL: "http://localhost:8080/api/v1/books/filter",
            ajaxURLGenerator: (url, config, params) => {
                params.searchTerm = this.searchTerm;
                if (this.authenticationService.currentUserValue) {
                    config.headers = {
                        'Authorization': `Bearer ${this.authenticationService.currentUserValue.accessToken}`
                    };
                }
                return url + "?params=" + encodeURI(JSON.stringify(params));
            },
            ajaxError: (xhr, textStatus, errorThrown) => {
                if (xhr.status == 401) {
                    this.authenticationService.logout();
                    this.router.navigate(['/login'], {queryParams: {returnUrl: "books"}});
                }
            },
            paginationSize: 20,
            initialSort: [
                {column: 'id', dir: 'desc'},
            ],
            columns: [
                {
                    formatter: "rowSelection",
                    width: 60,
                    titleFormatter: "rowSelection",
                    hozAlign: "center",
                    headerSort: false
                },
                {title: 'Edit', formatter: editIcon, width: 60, hozAlign: 'center', headerSort: false},
                {title: 'Delete', formatter: 'buttonCross', hozAlign: 'center', width: 100, headerSort: false},
                {title: 'Id', field: 'id', width: 60},
                {title: 'Title', field: 'title'},
                {
                    title: 'Author', field: 'authors', formatter: function (cell, formatterParams) {
                        let authorsString = '';
                        let authors = cell.getValue();
                        for (var index in authors) {
                            var author = authors[index];
                            authorsString += author.firstName + ' ' + author.lastName;
                            if (index !== ((authors.length - 1) + "")) {
                                authorsString += ", ";
                            }
                        }
                        return authorsString;
                    }
                },
                {title: 'ISBN', field: 'isbn'},
                {
                    title: 'Status',
                    field: 'status',
                    formatter: statusFormatter,
                    width: 100,
                    hozAlign: 'center',
                    headerSort: false
                },
                {title: 'Updated at', field: 'updatedAt'},
                {title: 'Updated by', field: 'updatedBy'},
                {
                    title: 'Download', width: 100, hozAlign: 'center', headerSort: false,
                    formatter: function (cell, formatterParams, onRendered) {
                        return '<i class="fas fa-download"></i>';
                    }
                },
                {
                    title: 'Dnd encrypted', width: 135, hozAlign: 'center', headerSort: false,
                    formatter: function (cell, formatterParams, onRendered) {
                        if (cell.getRow()._row.data.status == 'GREEN') {
                            return '<i class="fas fa-download"></i>';
                        }
                    }
                }
            ],
            rowDblClick: (e, row) => {
                this.router.navigate([`/edit-books/${row.getData().id}`]);
            },
            cellClick: (e, cell) => {
                if (cell.getColumn().getDefinition().title == "Edit") {
                    this.router.navigate([`/edit-books/${cell.getData().id}`]);
                } else if (cell.getColumn().getDefinition().title == "Delete") {
                    this.booksServer.deleteBook(cell.getData().id);
                    cell.getRow().delete();
                } else if (cell.getColumn().getDefinition().title == "Dnd encrypted") {
                    if (cell.getData().status == 'GREEN') {
                        this.booksServer.downloadEncryptedBook(cell.getData());
                    }
                } else if (cell.getColumn().getDefinition().title == "Download") {
                    this.booksServer.downloadBook(cell.getData());
                } else {
                    cell.getRow().toggleSelect();
                }
            }
        });
        this.table.setData();
    }

    upload() {
        this.router.navigate(['/upload-books']);
    }

    encryptionDRM() {
        var selectedRows = this.table.getSelectedRows();
        if (selectedRows.length == 0) {
            this.notification.showErrorNotification("Please select rows that will be encrypted!");
            return;
        }
        this.booksServer.encryptBooks(selectedRows, this.table);
    }

    onSearch() {
        this.table.setData();
    }

}
