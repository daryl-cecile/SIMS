const PORT = process.env.PORT || 3000;
module.exports = (express) => {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({
        extended: true
    }));
    app.use(express.static("/public"));
    app.use("/", require('../controllers/base'));
    app.use('/api', require('../controllers/apis'));
    app.listen(PORT, () => {
        console.log(`App is running on port ${PORT}`);
    });
};
//# sourceMappingURL=setup.js.map