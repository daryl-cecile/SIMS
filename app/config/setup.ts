const PORT = process.env.PORT || 3000;

module.exports = (express)=>{
    const app = express();

    app.use(express.json());                    // to support JSON-encoded bodies
    app.use(express.urlencoded({
        extended: true
    }));              // to support URL-encoded bodies
    app.use(express.static("/public"));    // makes public folder directly accessible


    // Routes
    app.use("/", require('../controllers/base'));
    app.use('/api', require('../controllers/apis'));

    app.listen(PORT, () => {
        console.log(`App is running on port ${ PORT }`);
    });

};