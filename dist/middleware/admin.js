"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
function isAdmin(req, res, next) {
    try {
        if (!req.user.isAdmin)
            return res.status(403).send("Access denied.");
        next();
    }
    catch (ex) {
        res.status(403).send("Access denied");
    }
}
exports.isAdmin = isAdmin;
//# sourceMappingURL=admin.js.map