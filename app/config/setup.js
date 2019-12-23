"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PORT = process.env.PORT || 3000;
const eventManager = require('./GlobalEvents');
let server = null;
module.exports = {
    bootstrap: (express) => {
        const app = express();
        require('./DBConnection');
        app.set('views', require("path").resolve(__dirname, "../views"));
        app.set('view engine', 'ejs');
        app.use(express.json());
        app.use(express.urlencoded({
            extended: true
        }));
        app.use('/public', express.static("public"));
        app.use("/", require('../controllers/base'));
        app.use('/api', require('../controllers/apis'));
        let _server = app.listen(PORT, () => {
            eventManager.trigger("APP_READY", PORT);
            console.log(`App is running on port ${PORT}`);
            eventManager.listen("DB_READY", () => {
                eventManager.trigger("STACK_READY", _server);
                console.log(`DB is running on port 3306`);
                server = _server;
            }, { singleUse: true, autoTriggerIfMissed: true });
        });
        return _server;
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