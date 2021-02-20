import {UserResourceModel} from "./user.resource.model";

export class User {
    constructor(
        public userResource: UserResourceModel,
        public accessToken: string,
        public expiresIn: number
    ) {
    }

    get token() {
        if (!this.expiresIn || new Date() > new Date(this.expiresIn)) {
            return null;
        }
        return this.accessToken;
    }
}
