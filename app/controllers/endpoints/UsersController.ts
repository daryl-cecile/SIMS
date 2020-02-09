import {UserService} from "../../Services/UserService";
import {RouterSet} from "../../config/RouterSet";
import {UserModel} from "../../models/UserModel";
import {JSONResponse} from "../../config/JSONResponse";
import {UserRepository} from "../../Repository/UserRepository";

export const UserEndpointController = new RouterSet(router => {

    router.get('/user/list', async function(req, res){

        let term = (req.query['hint'] || "=").toLowerCase();

        if (term.length < 1) {
            res.end();
            return;
        }

        let finalList = (await UserService.getAllCustomers()).filter((user) => {
            return ( user.email.toLowerCase().startsWith(term) || user.identifier.toLowerCase().indexOf(term) > -1 )
        }).map(user => user.toJSON());

        res.json(finalList);
        res.end();
    });

    router.post('/user/register', async function (req, res) {
        if (await UserService.createUser(req)) {
            res.json(JSONResponse(true, "User Created Successfully"));
        } else {
            res.json(JSONResponse(false, "User already exists"));
        }
    });

    /**
     * Used to manage the permissions of a user
     */
    router.post('/user/permissions', async function (req, res) {
        let tempUser = await UserRepository.getUserByIdentifier(req.body['identifier']);
        await UserService.editPermissions(tempUser, req);

    });

    return router;
});


