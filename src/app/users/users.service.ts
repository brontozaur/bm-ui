import {Subject} from 'rxjs';
import {UserBook} from './user-book.model';

export class UsersService {
    usersChanged = new Subject<UserBook[]>();

    private users: UserBook[] = [
        new UserBook(1, 'Oli', 'Bob', 'ADMIN', 'oli', 'oli', 'oli.bob@gmail.com'),
        new UserBook(2, 'Mary', 'May', 'USER', 'mary', 'oli', 'oli.bob@gmail.com'),
        new UserBook(3, 'Christine', 'Lobowski', 'USER', 'cri', 'oli', 'oli.bob@gmail.com'),
        new UserBook(4, 'Brendon', 'Philips', 'USER', 'brendon', 'oli', 'oli.bob@gmail.com'),
        new UserBook(5, 'Margret', 'Marmajuke', 'USER', 'margret', 'oli', 'oli.bob@gmail.com')
    ];

    //private users: UserBook[] = [];

    setUsers(users: UserBook[]) {
        this.users = users;
        this.usersChanged.next(this.users.slice());
    }

    getUsers() {
        return this.users.slice();
    }

    getUser(id: number) {
        return this.users[id - 1];
    }

    saveUser(user: UserBook) {
        if (user.id) {
            this.users[user.id - 1] = user;
            this.usersChanged.next(this.users.slice());
        } else {
            this.users.push(user);
            this.usersChanged.next(this.users.slice());
        }
    }

    deleteUser(index: number) {
        this.users.splice(index, 1);
        this.usersChanged.next(this.users.slice());
    }
}
