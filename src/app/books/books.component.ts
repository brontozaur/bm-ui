import {Component, OnInit} from '@angular/core';
import {LoggingService} from '../logging.service';
import Tabulator from 'tabulator-tables';
import {ActivatedRoute, Router} from '@angular/router';
import {BooksService} from './books.service';
import {Author} from '../authors/author.model';
import {Book} from "./book.model";

@Component({
    selector: 'app-books',
    templateUrl: './books.component.html',
    styleUrls: ['./books.component.css',
        '../app.component.css']
})
export class BooksComponent implements OnInit {

    private books: Book[] = [];
    private table;
    searchTerm: string = "";

    constructor(private router: Router,
                private route: ActivatedRoute,
                private loggingService: LoggingService,
                private booksServer: BooksService
    ) {
    }

    ngOnInit() {

        var editIcon = function (cell, formatterParams, onRendered) {
            return '<i class=\'fas fa-pencil-alt\'></i>';
        };

        var goToFcn = function (id) {
            this.router.navigate(['edit-books/' + id]);
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
                return url + "?params=" + encodeURI(JSON.stringify(params));
            },
            paginationSize: 20,
            initialSort: [
                {column: 'id', dir: 'desc'},
            ],
            columns: [
                {formatter: "rowSelection", width: 60, titleFormatter: "rowSelection", hozAlign: "center", headerSort: false},
                {title: 'Edit', formatter: editIcon, width: 60, align: 'center', headerSort: false},
                {title: 'Delete', formatter: 'buttonCross', align: 'center', width: 100, headerSort: false},
                {title: 'Id', field: 'id', width: 60},
                {title: 'Title', field: 'title'},
                {title: 'Author', field: 'authors', formatter: function (cell, formatterParams) {
                        let authorsString = '';
                        let authors = cell.getValue();
                        for (var index in authors) {
                            var author = authors[index];
                            authorsString += author.firstName + ' ' + author.lastName;
                            if(index !== ((authors.length - 1)+"")) {
                                authorsString += ", ";
                            }
                        }
                        return authorsString;
                    }
                },
                {title: 'ISBN', field: 'isbn'},
                {title: 'Status', field: 'status', formatter: statusFormatter, width: 100, align: 'center', headerSort: false},
                {title: 'Updated at', field: 'updatedAt'},
                {title: 'Updated by', field: 'updatedBy'}
            ],
            rowDblClick: (e, row) => {
                this.router.navigate([`/edit-books/${row.getData().id}`]);
            },
            cellClick: (e, cell) => {
                if (cell.getColumn().getDefinition().title == "Edit") {
                    this.router.navigate([`/edit-books/${cell.getData().id}`]);
                } else if(cell.getColumn().getDefinition().title == "Delete"){
                    this.booksServer.deleteBook(cell.getData().id);
                    cell.getRow().delete();
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
        alert("encryptionDRM file");
    }

    publish() {
        alert("publish");
    }

    onSearch() {
        this.table.setData();
    }

}
