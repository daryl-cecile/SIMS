"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const System_1 = require("./System");
const LoginController_1 = require("../controllers/endpoints/LoginController");
const UsersController_1 = require("../controllers/endpoints/UsersController");
const TransactionController_1 = require("../controllers/endpoints/TransactionController");
const LoginController_2 = require("../controllers/frontend/LoginController");
const TransactionController_2 = require("../controllers/frontend/TransactionController");
const ItemController_1 = require("../controllers/endpoints/ItemController");
const StocksController_1 = require("../controllers/endpoints/StocksController");
const AdminController_1 = require("../controllers/frontend/AdminController");
const PORT = process.env.PORT || 3000;
const eventManager = require('./GlobalEvents');
let isTest = false;
let server = null;
module.exports = {
    bootstrap: (express) => {
        const app = express();
        const loader = System_1.System.loader(app);
        require("./DBConnection");
        app.set('views', require("path").resolve(__dirname, "../views"));
        app.set('view engine', 'ejs');
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use('/public', express.static("public"));
        app.use(System_1.System.Middlewares.CookieHandler());
        app.use(System_1.System.Middlewares.LogRequest());
        app.use(System_1.System.Middlewares.SecurityMiddleware());
        app.use(System_1.System.Middlewares.FileUploadHandler());
        loader.registerEndpointControllers(LoginController_1.LoginEndpointController, UsersController_1.UserEndpointController, TransactionController_1.TransactionsEndpointController, ItemController_1.ItemsEndpointController, StocksController_1.StocksEndpointController);
        loader.registerBaseControllers(LoginController_2.LoginController, TransactionController_2.TransactionController, AdminController_1.AdminController);
        server = app.listen(PORT, () => {
            eventManager.trigger("APP_READY", PORT);
            System_1.System.log('Status', `App is running on port ${PORT}`);
            eventManager.listen("DB_READY", () => {
                eventManager.trigger("STACK_READY", server);
                System_1.System.log('Status', `DB is running on port 3306`);
                if (!System_1.System.isProduction() && !isTest)
                    require("./seeder");
            }, { singleUse: true, autoTriggerIfMissed: true });
        });
        System_1.System.attachTerminateListeners(server);
        return server;
    },
    setStoragePath: (p) => {
        System_1.System.storagePath = p;
    },
    enableTestMode: () => {
        isTest = true;
        System_1.System.haltOutput();
    },
    getServer: async () => {
        return new Promise(resolve => {
            if (server === null) {
                eventManager.listen("STACK_READY", function (serv) {
                    resolve(serv);
                });
            }
            else
                resolve(server);
        });
    }
};
//# sourceMappingURL=setup.js.map