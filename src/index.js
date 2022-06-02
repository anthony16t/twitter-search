var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fetch from 'node-fetch';
// IMPORT API JSON RETURNED TYPES
const log = new class {
    error(string = '') { console.log(`\x1b[31m${string}\x1b[0m`); }
    successful(string = '') { console.log(`\x1b[32m${string}\x1b[0m`); }
};
export default class TwitterSearch {
    constructor(bearerToken) {
        this.apiBaseUrl = 'https://api.twitter.com/1.1/';
        this.bearerToken = bearerToken.trim();
    }
    // GET USERNAME INFORMATION FROM TWITTER
    user(username) {
        return __awaiter(this, void 0, void 0, function* () {
            // CHECK IF USERNAME WAS GIVEN, IF NOT RETURN 
            if (!username)
                return false;
            // ELSE TRY TO GET RESPONSE
            try {
                const fetchUrl = `users/show.json?screen_name=${username}`;
                const apiJson = yield this.GET(fetchUrl);
                if (apiJson.hasOwnProperty('error'))
                    return false;
                return apiJson;
            }
            catch (err) {
                log.error(err.message);
                return false;
            }
        });
    }
    // GET USER TWEETS, THIS DO NOT INCLUDES RETWEETS
    tweets(userId, maxResults = 100) {
        return __awaiter(this, void 0, void 0, function* () {
            // CHECK IF USER ID WAS GIVEN, IF NOT RETURN 
            if (!userId)
                return false;
            // ELSE TRY TO GET RESPONSE
            try {
                const params = `?user_id=${userId}&exclude_replies=true&include_rts=false&count=${maxResults}&trim_user=false`;
                const fetchUrl = `statuses/user_timeline.json${params}`;
                const apiJson = yield this.GET(fetchUrl);
                if (apiJson.hasOwnProperty('error'))
                    return false;
                return apiJson;
            }
            catch (err) {
                log.error(err.message);
                return false;
            }
        });
    }
    // GET USER'S LIST OF FOLLOWERS
    followersList(userId, maxResults = 200) {
        return __awaiter(this, void 0, void 0, function* () {
            // CHECK IF USER ID WAS GIVEN, IF NOT RETURN 
            if (!userId)
                return false;
            // ELSE TRY TO GET RESPONSE
            try {
                const fetchUrl = `followers/list.json?user_id=${userId}&count=${maxResults}`;
                const apiJson = yield this.GET(fetchUrl);
                if (apiJson.hasOwnProperty('error'))
                    return false;
                const followersList = apiJson['users'];
                return followersList;
            }
            catch (err) {
                log.error(err.message);
                return false;
            }
        });
    }
    // GET USER'S LIST OF FOLLOWINGS
    followingsList(userId, maxResults = 200) {
        return __awaiter(this, void 0, void 0, function* () {
            // CHECK IF USER ID WAS GIVEN, IF NOT RETURN 
            if (!userId)
                return false;
            // ELSE TRY TO GET RESPONSE
            try {
                const fetchUrl = `friends/list.json?user_id=${userId}&count=${maxResults}`;
                const apiJson = yield this.GET(fetchUrl);
                if (apiJson.hasOwnProperty('error'))
                    return false;
                const followersList = apiJson['users'];
                return followersList;
            }
            catch (err) {
                log.error(err.message);
                return false;
            }
        });
    }
    // SEARCH TWITTER
    search(query, maxResults = 100) {
        return __awaiter(this, void 0, void 0, function* () {
            // CHECK IF QUERY WAS GIVEN, IF NOT RETURN 
            if (!query)
                return false;
            // ELSE TRY TO GET RESPONSE
            try {
                const params = `?count=${maxResults}&result_type=recent&include_rts=false&include_entities=false&q=${query}`;
                const fetchUrl = `search/tweets.json${params}`;
                const apiJson = yield this.GET(fetchUrl);
                if (apiJson.hasOwnProperty('error'))
                    return false;
                const searchResult = apiJson['statuses'];
                return searchResult;
            }
            catch (err) {
                log.error(err.message);
                return false;
            }
        });
    }
    GET(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = {
                'Authorization': 'Bearer ' + this.bearerToken,
                'User-Agent': `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36`
            };
            const fetchUrl = this.apiBaseUrl + url;
            const apiRequest = yield fetch(fetchUrl, { headers: headers });
            // RETURN FALSE IF REQUEST STATUS IS NOT A 200
            if (apiRequest.status !== 200)
                return false;
            // ELSE RETURN API JSON RESPONSE
            return apiRequest.json();
        });
    }
}
