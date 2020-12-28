import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, tap} from 'rxjs/operators';
import {AuthService} from '../auth/auth.service';
import {BooksService} from '../books/books.service';
import {Book} from '../books/book.model';

@Injectable({providedIn: 'root'})
export class DataStorageService {
    constructor(
        private http: HttpClient,
        private booksService: BooksService,
        private authService: AuthService
    ) {
    }

    storeRecipes() {
        const recipes = this.booksService.getBooks();
        this.http
            .put(
                'https://recipe-book-50c46.firebaseio.com/recipes.json',
                recipes
            )
            .subscribe(response => {
                console.log(response);
            });
    }

    fetchRecipes() {
        return this.http
            .get<Book[]>(
                'https://recipe-book-50c46.firebaseio.com/recipes.json'
            )
            .pipe(
                map(recipes => {
                    return recipes.map(recipe => {
                        return {
                            ...recipe,
                            // ingredients: recipe.ingredients ? recipe.ingredients : []
                        };
                    });
                }),
                tap(recipes => {
                    this.booksService.setBooks(recipes);
                })
            );
    }

    fetchUsers() {
        return this.http
            .get<Book[]>(
                'https://recipe-book-50c46.firebaseio.com/recipes.json'
            )
            .pipe(
                map(recipes => {
                    return recipes.map(recipe => {
                        return {
                            ...recipe,
                            //    ingredients: recipe.ingredients ? recipe.ingredients : []
                        };
                    });
                }),
                tap(recipes => {
                    this.booksService.setBooks(recipes);
                })
            );
    }
}
