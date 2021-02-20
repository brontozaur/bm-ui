export class UserResourceModel {
    constructor(
        public id: string,
        public name: string,
        public username: string,
        public email: string,
        public role: string,
    ) {
    }
}
