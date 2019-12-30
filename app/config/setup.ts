import * as http from "http";
import {System} from "./System";
import error = System.error;

const PORT = process.env.PORT || 3000;
const eventManager = require('./GlobalEvents');

let isTest:boolean = false;

let server:http.Server = null;

module.exports = {

    bootstrap : (express)=>{
        const app = express();
        const db = require('./DBConnection');

        app.set('views', require("path").resolve(__dirname,"../views") );
        app.set('view engine', 'ejs');

        app.use(express.json());                                    // to support JSON-encoded bodies
        app.use(express.urlencoded({
            extended: true
        }));                                                        // to support URL-encoded bodies
        app.use('/public',express.static("public"));     // makes public folder directly accessible

        // log request
        app.use(function(req,res,next){
            System.log("Request", req.url, System.ERRORS.NORMAL);
            next();
        });

        // Routes
        app.use("/", require('../controllers/base'));
        app.use('/api', require('../controllers/apis'));

        // catch app level errors in case
        process.on("uncaughtException",err => {
            System.fatal(err, System.ERRORS.APP_BOOT,"uncaughtException");
        });

        // listen for terminate events and gracefully release resources
        eventManager.listen("TERMINATE", ()=>{
            db.end().then(()=>{
                server.close(()=>{
                    eventManager.trigger("UNLOAD");
                });
            }).catch(x => {
                console.error(x);
                // process.exit(1); //couldnt end the connection so force exit
            });
        },{ singleUse: true });

        server =  app.listen(PORT, () => {
            eventManager.trigger("APP_READY", PORT);
            System.log('Status',`App is running on port ${PORT}`);

            eventManager.listen("DB_READY", ()=>{
                eventManager.trigger("STACK_READY",server);
                System.log('Status',`DB is running on port 3306`);

                if (!System.isProduction() && !isTest) require("./seeder");
            },{singleUse:true,autoTriggerIfMissed:true});
        });

        return server;
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