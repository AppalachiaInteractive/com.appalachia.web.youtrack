"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const urls_1 = require("./urls");
const base_1 = require("./base1");
class SearchEndpoint extends base_1.BaseEndpoint {
    saved() {
        return this.toPromise(this.client.get(urls_1.urls.SAVED_SEARCHES)).then(response => {
            return response;
        });
    }
}
exports.SearchEndpoint = SearchEndpoint;
