var url = require('url')
var patreon = require('patreon')
var patreonAPI = patreon.patreon
var patreonOAuth = patreon.oauth

// Use o client id e secret que você recebeu ao configurar sua conta OAuth
var CLIENT_ID = 'bBALopM5hulNr-TieXjnueaOcQa7J9Pc3imwszT5ZMpH1o2Tw0j2qAvRCilAP-Ys'
var CLIENT_SECRET = 'e4EKmh6VBhrTIKL5-U8PHUd4joPYbxePx0Uhv1dOMQiT8g8H7Hkjxgz15yvyk18R'
var patreonOAuthClient = patreonOAuth(CLIENT_ID, CLIENT_SECRET)

// Esta deve ser uma das redirect_uri totalmente qualificadas que você usou ao configurar sua conta OAuth
var redirectURL = 'http://mypatreonapp.com/oauth/redirect'

function handleOAuthRedirectRequest(request, response) {
    var oauthGrantCode = url.parse(request.url, true).query.code

    patreonOAuthClient
        .getTokens(oauthGrantCode, redirectURL)
        .then(function(tokensResponse) {
            var patreonAPIClient = patreonAPI(tokensResponse.access_token)
            return patreonAPIClient('/current_user')
        })
        .then(function(result) {
            var store = result.store
            response.end(store.findAll('user').map(user => user.serialize()))
        })
        .catch(function(err) {
            console.error('error!', err)
            response.end(err)
        })
}
