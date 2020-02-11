import * as http from "http";
import {System} from "./System";
import {LoginEndpointController} from "../controllers/endpoints/LoginController";
import {UserEndpointController} from "../controllers/endpoints/UsersController";
import {TransactionsEndpointController} from "../controllers/endpoints/TransactionController";
import {LoginController} from "../controllers/frontend/LoginController";
import {TransactionController} from "../controllers/frontend/TransactionController";
import {ItemsEndpointController} from "../controllers/endpoints/ItemController";
import {StocksEndpointController} from "../controllers/endpoints/StocksController";
import {AdminController} from "../controllers/frontend/AdminController";

const PORT = process.env.PORT || 3000;
const eventManager = require('./GlobalEvents');

let isTest:boolean = false;

let server:http.Server = null;

module.exports = {

    bootstrap : (express)=>{
        const app = express();
        const loader = System.loader(app);
        require("./DBConnection");

        app.set('views', require("path").resolve(__dirname,"../views") );
        app.set('view engine', 'ejs');

        app.use(express.json());                                    // to support JSON-encoded bodies
        app.use(express.urlencoded({ extended: true }));    // to support URL-encoded bodies
        app.use('/public',express.static("public"));    // makes public folder directly accessible

        // Cookies
        app.use(System.Middlewares.CookieHandler());

        // Log request
        app.use(System.Middlewares.LogRequest());

        // CSRF tokens
        app.use(System.Middlewares.SecurityMiddleware());

        app.use(System.Middlewares.FileUploadHandler());

        // Routes
        loader.registerEndpointControllers(
            LoginEndpointController,
            UserEndpointController,
            TransactionsEndpointController,
            ItemsEndpointController,
            StocksEndpointController
        );

        loader.registerBaseControllers(
            LoginController,
            TransactionController,
            AdminController
        );

        server =  app.listen(PORT, () => {
            eventManager.trigger("APP_READY", PORT);
            System.log('Status',`App is running on port ${PORT}`);

            eventManager.listen("DB_READY", ()=>{
                eventManager.trigger("STACK_READY",server);
                System.log('Status',`DB is running on port 3306`);

                if (!System.isProduction() && !isTest) require("./seeder");
            },{singleUse:true,autoTriggerIfMissed:true});
        });

        System.attachTerminateListeners(server);

        return server;
    },

    setStoragePath : (p:string)=>{
        System.storagePath = p;
    },

    enableTestMode: ()=>{
        isTest = true;
        System.haltOutput();
    },

    getServer: async ()=>{
        return new Promise<http.Server>(resolve => {
            if (server === null){
                eventManager.listen("STACK_READY", function(serv){
                    resolve(serv);
                });
            }
            else resolve(server);
        });
    }

};