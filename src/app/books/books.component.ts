import {Component, OnInit} from '@angular/core';
import {LoggingService} from '../logging.service';
import Tabulator from 'tabulator-tables';
import {ActivatedRoute, Router} from '@angular/router';
import {BooksService} from './books.service';
import {Author} from '../authors/author.model';
import {Book} from "./book.model";
import {NotificationService} from "../notification.service";
import {AuthenticationService} from "../auth/authentication.service";
import {environment} from "../../environments/environment";
import {MatDialog} from "@angular/material";
import {ConfirmDialogComponent} from "../dialog/confirm-dialog.component";

@Component({
    selector: 'app-books',
    templateUrl: './books.component.html',
    styleUrls: ['./books.component.css',
        '../app.component.css']
})
export class BooksComponent implements OnInit {

    private books: Book[] = [];
    private table;
    public searchTerm: string = "";
    public bookSorter: string = "CREATED_AT";
    public onluNotEncrypted: boolean = false;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private loggingService: LoggingService,
                private booksServer: BooksService,
                private notification: NotificationService,
                private authenticationService: AuthenticationService,
                private dialog: MatDialog) {
    }

    ngOnInit() {
        this.authenticationService.testIfHasToken("books");

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
            height: 'calc(100vh - 285px)',
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
            ajaxURL: `${environment.apiUrl}/api/v1/books/filter`,
            ajaxURLGenerator: (url, config, params) => {
                params.searchTerm = this.searchTerm;
                params.sorter = this.bookSorter;
                params.onluNotEncrypted = this.onluNotEncrypted;
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
                    return;
                }
                this.notification.showErrorNotification(xhr)
            },
            paginationSize: 20,
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
                            let authorName = '';
                            if (author.firstName) {
                                authorName += author.firstName;
                            }
                            if (author.lastName) {
                                if (author.firstName) {
                                    authorName += ' ' + author.lastName;
                                } else {
                                    authorName += author.lastName;
                                }
                            }
                            authorsString += authorName;
                            if (index !== ((authors.length - 1) + "")) {
                                authorsString += ", ";
                            }
                        }
                        return authorsString;
                    }
                },
                {title: 'ISBN', field: 'isbn'},
                {title: 'Publisher', field: 'publisher'},
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
                    title: 'Format', field: 'format',
                    formatter: function (cell, formatterParams, onRendered) {
                        if (!cell.getValue()) {
                            return '';
                        }
                        if (cell.getValue().toLowerCase().indexOf('pdf') != -1) {
                            return 'PDF';
                        } else if (cell.getValue().toLowerCase().indexOf('epub') != -1) {
                            return 'EPUB';
                        }
                        return cell.getValue;
                    }
                },
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
                    var bookName = cell.getData().title;
                    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
                        data: {
                            title: 'Confirm remove book',
                            message: 'Are you sure you want to remove the book ' + bookName
                        }
                    });
                    confirmDialog.afterClosed().subscribe(result => {
                        if (result === true) {
                            this.booksServer.deleteBook(cell.getData().id, function () {
                                cell.getRow().delete();
                            });
                        }
                    });

                } else if (cell.getColumn().getDefinition().title == "Dnd encrypted") {
                    if (cell.getData().status == 'GREEN') {
                        this.booksServer.downloadEncryptedBook(cell.getData());
                    }
                } else if (cell.getColumn().getDefinition().title == "Download") {
                    this.booksServer.downloadBook(cell.getData());
                } else {
                    cell.getRow().toggleSelect();
                }
            },
            ajaxResponse: function (url, params, response) {
                var el = document.getElementById("row-count");
                el.innerHTML = "Showing " + response.numberOfElements + " of " + response.totalElements;
                return response;
            }
        });
    }

    onNewBook() {
        this.router.navigate(['edit-books/0']);
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
