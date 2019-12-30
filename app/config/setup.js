"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const System_1 = require("./System");
const PORT = process.env.PORT || 3000;
const eventManager = require('./GlobalEvents');
let isTest = false;
let server = null;
module.exports = {
    bootstrap: (express) => {
        const app = express();
        const db = require('./DBConnection');
        app.set('views', require("path").resolve(__dirname, "../views"));
        app.set('view engine', 'ejs');
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use('/public', express.static("public"));
        app.use(System_1.System.Middlewares.CookieHandler());
        app.use(System_1.System.Middlewares.LogRequest());
        app.use(System_1.System.Middlewares.CSRFHandler());
        app.use("/", require('../controllers/base'));
        app.use('/api', require('../controllers/apis'));
        System_1.System.attachTerminateListeners(db, server);
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
        return server;
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