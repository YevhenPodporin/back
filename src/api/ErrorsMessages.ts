class errorMessages {
    USER_NOT_FOUND = 'User is not found';
    USER_NOT_AUTH = 'User is not authorized';

    constructor() {
    }

     userNotFound(){
        return this.USER_NOT_FOUND
    }
    userNotAuth(){
        return this.USER_NOT_AUTH
    }
}
export const Errors = new errorMessages();