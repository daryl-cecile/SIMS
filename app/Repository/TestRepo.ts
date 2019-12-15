import {BaseRepository} from "./BaseRepository";

class TestRepo extends BaseRepository{

    constructor() {
        super("test_table");
    }

}

module.exports = new TestRepo();