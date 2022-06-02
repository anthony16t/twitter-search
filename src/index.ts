import fetch from 'node-fetch'
// IMPORT TYPES
import { User,Tweets,FollowersList,FollowingsList,Search } from '../types'
// IMPORT API JSON RETURNED TYPES

const log = new class {
    error(string=''){ console.log(`\x1b[31m${string}\x1b[0m`) }
    successful(string=''){ console.log(`\x1b[32m${string}\x1b[0m`) }
}  

export default class TwitterSearch{
    private bearerToken: string
    private apiBaseUrl: string
    
    constructor(bearerToken:string){
        this.apiBaseUrl = 'https://api.twitter.com/1.1/'
        this.bearerToken = bearerToken.trim()
    }

    // GET USERNAME INFORMATION FROM TWITTER
    async user(username:string):Promise<false|User>{
        // CHECK IF USERNAME WAS GIVEN, IF NOT RETURN 
        if(!username) return false
        // ELSE TRY TO GET RESPONSE
        try{
            const fetchUrl = `users/show.json?screen_name=${username}`
            const apiJson:User = await this.GET(fetchUrl)
            if(apiJson.hasOwnProperty('error')) return false
            return apiJson
        }catch(err:any){ log.error(err.message) ; return false }
    }

    // GET USER TWEETS, THIS DO NOT INCLUDES RETWEETS
    async tweets(userId:string,maxResults:number=100):Promise<false|Tweets[]>{
        // CHECK IF USER ID WAS GIVEN, IF NOT RETURN 
        if(!userId) return false
        // ELSE TRY TO GET RESPONSE
        try{
            const params = `?user_id=${userId}&exclude_replies=true&include_rts=false&count=${maxResults}&trim_user=false`
            const fetchUrl = `statuses/user_timeline.json${params}`
            const apiJson:Tweets[] = await this.GET(fetchUrl)
            if(apiJson.hasOwnProperty('error')) return false
            return apiJson
        }catch(err:any){ log.error(err.message) ; return false }
    }

    // GET USER'S LIST OF FOLLOWERS
    async followersList(userId:string,maxResults:number=200):Promise<false|FollowersList[]>{
        // CHECK IF USER ID WAS GIVEN, IF NOT RETURN 
        if(!userId) return false
        // ELSE TRY TO GET RESPONSE
        try{
            const fetchUrl = `followers/list.json?user_id=${userId}&count=${maxResults}`
            const apiJson = await this.GET(fetchUrl)
            if(apiJson.hasOwnProperty('error')) return false
            const followersList:FollowersList[] = apiJson['users']
            return followersList
        }catch(err:any){ log.error(err.message) ; return false }
    }

    // GET USER'S LIST OF FOLLOWINGS
    async followingsList(userId:string,maxResults:number=200):Promise<false|FollowingsList[]>{
        // CHECK IF USER ID WAS GIVEN, IF NOT RETURN 
        if(!userId) return false
        // ELSE TRY TO GET RESPONSE
        try{
            const fetchUrl = `friends/list.json?user_id=${userId}&count=${maxResults}`
            const apiJson = await this.GET(fetchUrl)
            if(apiJson.hasOwnProperty('error')) return false
            const followersList:FollowingsList[] = apiJson['users']
            return followersList
        }catch(err:any){ log.error(err.message) ; return false }
    }


    // SEARCH TWITTER
    async search(query:string,maxResults:number=100):Promise<false|Search[]>{
        // CHECK IF QUERY WAS GIVEN, IF NOT RETURN 
        if(!query) return false
        // ELSE TRY TO GET RESPONSE
        try{
            const params = `?count=${maxResults}&result_type=recent&include_rts=false&include_entities=false&q=${query}`
            const fetchUrl = `search/tweets.json${params}`
            const apiJson = await this.GET(fetchUrl)
            if(apiJson.hasOwnProperty('error')) return false
            const searchResult:Search[] = apiJson['statuses']
            return searchResult
        }catch(err:any){ log.error(err.message) ; return false }
    }

    private async GET(url:string):Promise<false|any>{
        const headers={
            'Authorization':'Bearer '+this.bearerToken,
            'User-Agent':`Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36`
        }
        const fetchUrl = this.apiBaseUrl+url
        const apiRequest = await fetch(fetchUrl,{headers:headers})
        // RETURN FALSE IF REQUEST STATUS IS NOT A 200
        if(apiRequest.status!==200) return false
        // ELSE RETURN API JSON RESPONSE
        return apiRequest.json()
    }


}