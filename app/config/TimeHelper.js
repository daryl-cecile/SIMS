"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TimeHelper {
    static minutesFromNow(minutes) {
        if (minutes < TimeHelper.MINIMUM_MINUTES)
            minutes = TimeHelper.MINIMUM_MINUTES;
        return new Date(Date.now() + (minutes * TimeHelper.ONE_MINUTE));
    }
}
exports.TimeHelper = TimeHelper;
TimeHelper.MINIMUM_MINUTES = 3;
TimeHelper.ONE_MINUTE = 60 * 1000;
//# sourceMappingURL=TimeHelper.js.map