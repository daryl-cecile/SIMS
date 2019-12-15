"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseRepository_1 = require("./BaseRepository");
class TestRepo extends BaseRepository_1.BaseRepository {
    constructor() {
        super("test_table");
    }
}
module.exports = new TestRepo();
//# sourceMappingURL=TestRepo.js.map