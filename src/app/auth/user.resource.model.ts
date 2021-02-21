export class UserResourceModel {
    constructor(
        public id: number,
        public name: string,
        public username: string,
        public email: string,
        public role: string,
    ) {
    }
}
