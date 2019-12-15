const fs = require("fs");
const path = require("path");
module.exports = {
    ca: fs.readFileSync(path.resolve('./ssl/gcloud-ca.pem')),
    key: fs.readFileSync(path.resolve('./ssl/gcloud-key.pem')),
    cert: fs.readFileSync(path.resolve('./ssl/gcloud-cert.pem'))
};
//# sourceMappingURL=cert_info.js.map