"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Errors = void 0;
class errorMessages {
    constructor() {
        this.USER_NOT_FOUND = 'User is not found';
        this.USER_NOT_AUTH = 'User is not authorized';
    }
    userNotFound() {
        return this.USER_NOT_FOUND;
    }
    userNotAuth() {
        return this.USER_NOT_AUTH;
    }
}
exports.Errors = new errorMessages();
