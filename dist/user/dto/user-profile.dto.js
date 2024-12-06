"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IUser = void 0;
class IUser {
    constructor(user) {
        this.id = user.id;
        this.username = user.username;
        this.roles = user.roles.map((role) => role.slug);
        this.isAdmin = this.roles.includes('admin');
        this.lastLogin = user.lastLogin;
        this.isOnline = user.isOnline;
    }
}
exports.IUser = IUser;
//# sourceMappingURL=user-profile.dto.js.map