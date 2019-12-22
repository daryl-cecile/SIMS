"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const PORT = process.env.PORT || 3000;
module.exports = (express) => {
    const app = express();
    let dbConnection = require('./DBConnection');
    const eventManager = require('./GlobalEvents');
    app.set('views', require("path").resolve(__dirname, "../views"));
    app.set('view engine', 'ejs');
    app.use(express.json());
    app.use(express.urlencoded({
        extended: true
    }));
    app.use(express.static("/public"));
    app.use("/", require('../controllers/base'));
    app.use('/api', require('../controllers/apis'));
    return app.listen(PORT, () => {
        console.log(`App is running on port ${PORT}`);
        eventManager.trigger("APP_READY", PORT);
        eventManager.listen("DB_READY", () => {
            eventManager.trigger("STACK_READY");
        }, { singleUse: true, autoTriggerIfMissed: true });
    });
};
//# sourceMappingURL=setup.js.map