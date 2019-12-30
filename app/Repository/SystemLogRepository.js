"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseRepository_1 = require("./BaseRepository");
const SystemLogEntryModel_1 = require("../models/SystemLogEntryModel");
class repo extends BaseRepository_1.BaseRepository {
    constructor() {
        super(SystemLogEntryModel_1.SystemLogEntryModel);
    }
}
exports.SystemLogRepository = new repo();
//# sourceMappingURL=SystemLogRepository.js.map