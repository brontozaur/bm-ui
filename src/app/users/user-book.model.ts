export class UserBook {
    public id: number;
    public firstName: string;
    public lastName: string;
    public role: string;
    public username: string;
    public password: string;
    public email: string;

    constructor(id: number,
                firstName: string,
                lastName: string,
                role: string,
                username: string,
                password: string,
                email: string) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.username = username;
        this.password = password;
        this.email = email;
    }
}
