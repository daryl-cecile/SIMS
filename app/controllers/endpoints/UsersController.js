"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserService_1 = require("../../Services/UserService");
const RouterSet_1 = require("../../config/RouterSet");
exports.UserEndpointController = new RouterSet_1.RouterSet(route => {
    route.get('/list/users', async function (req, res) {
        let term = (req.query['hint'] || "=").toLowerCase();
        if (term.length < 1) {
            res.end();
            return;
        }
        let finalList = (await UserService_1.UserService.getAllCustomers()).filter((user) => {
            return (user.email.toLowerCase().startsWith(term) || user.identifier.toLowerCase().indexOf(term) > -1);
        }).map(user => user.toJSON());
        res.json(finalList);
        res.end();
    });
    return route;
});
//# sourceMappingURL=UsersController.js.map