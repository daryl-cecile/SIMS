const PORT = process.env.PORT || 3000;
module.exports = (express) => {
    const app = express();
    const conn = require('./db_conn');
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
    });
};
//# sourceMappingURL=setup.js.map