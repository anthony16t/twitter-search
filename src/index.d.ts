import { User, Tweets, FollowersList, FollowingsList, Search } from '../types';
export default class TwitterSearch {
    private bearerToken;
    private apiBaseUrl;
    constructor(bearerToken: string);
    user(username: string): Promise<false | User>;
    tweets(userId: string, maxResults?: number): Promise<false | Tweets[]>;
    followersList(userId: string, maxResults?: number): Promise<false | FollowersList[]>;
    followingsList(userId: string, maxResults?: number): Promise<false | FollowingsList[]>;
    search(query: string, maxResults?: number): Promise<false | Search[]>;
    private GET;
}
