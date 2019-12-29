import * as http from "http";
import {System} from "./System";

const PORT = process.env.PORT || 3000;
const eventManager = require('./GlobalEvents');

const DEVELOPER_MODE = true;

let server:http.Server = null;

module.exports = {

    bootstrap : (express)=>{
        const app = express();
        require('./DBConnection');

        app.set('views', require("path").resolve(__dirname,"../views") );
        app.set('view engine', 'ejs');

        app.use(express.json());                                    // to support JSON-encoded bodies
        app.use(express.urlencoded({
            extended: true
        }));                                                        // to support URL-encoded bodies
        app.use('/public',express.static("public"));     // makes public folder directly accessible


        // Routes
        app.use("/", require('../controllers/base'));
        app.use('/api', require('../controllers/apis'));

        let _server =  app.listen(PORT, () => {
            eventManager.trigger("APP_READY", PORT);
            System.log('Status',`App is running on port ${PORT}`);

            eventManager.listen("DB_READY", ()=>{
                eventManager.trigger("STACK_READY", _server);
                System.log('Status',`DB is running on port 3306`);

                if (DEVELOPER_MODE) require("./seeder");

                try{
                    throw new Error("ABC");
                }
                catch(ex){
                    System.err(ex,System.ERRORS.APP_BOOT);
                }

                server = _server;
            },{singleUse:true,autoTriggerIfMissed:true});
        });

        return _server;
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