
export class AuthenticationError extends Error {
    constructor(status, body) {
        super()

        this.status = status
        this.body = body
    }
}


class Api {
    constructor() {
        this.baseUrl = new URL('http://localhost:8000/')
        this.refreshToken = ''
        this.accessToken = ''

        this.loginCallbacks = []
        this.currentUserInfo = null

        this.chatSocket = null

        this.messageReceivedCallbacks = []
    }

    async initChatWebSocket() {
        const url = new URL(`/ws/chat/`, this.baseUrl)
        url.protocol = 'ws'
        url.searchParams.set('token', this.accessToken)

        this.chatSocket = new WebSocket(url)

        const logFunc = (socket, event) => {
            console.log(event)
        }

        // TODO set appropriate listeners
        this.chatSocket.addEventListener('error', logFunc)
        this.chatSocket.addEventListener('message', (event) => {
            const data = JSON.parse(event.data)
            console.log(data)
            this.messageReceivedCallbacks.forEach((callback) => {
                callback(data.payload.message)
            })
        })
    }

    onLogin(callback) {
        this.loginCallbacks.push(callback)
    }

    onMessageReceived(callback) {
        this.messageReceivedCallbacks.push(callback)
    }

    _fetch(path, requestInit = {}) {
        const url = new URL(path, this.baseUrl)

        if (requestInit.headers == null) {
            requestInit.headers = new Headers()
        }

        requestInit.headers.set('Authorization', 'Bearer ' + this.accessToken)

        console.log(requestInit)
        return fetch(url, requestInit)
    }

    async _fetchCurrentUserInfo() {
        const response = await this._fetch('/current-user-info/')

        if (!response.ok) {
            return
        }

        this.currentUserInfo = await response.json()
        console.log(this.currentUserInfo)
    }

    async authenticate(username, password) {
        const url = new URL('/token/', this.baseUrl)

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password,
            })
        })

        const body = await response.json()
        console.log(body)

        if (!response.ok) {
            throw new AuthenticationError(response.status, body)
        }

        this.accessToken = body.access
        this.refereshToken = body.refresh

        await this._fetchCurrentUserInfo()

        this.loginCallbacks.forEach((callback) => callback())
    }

    async getMessages() {
        const url = new URL('/message/', this.baseUrl)

        const response = await this._fetch(url)
        const json = await response.json()
        console.log(json)
        const messages = []
        json.forEach((message) => {
            messages.push(message)
        })

        return messages
    }

    async sendMessageREST(text) {
        const url = new URL('/message/', this.baseUrl)

        const response = await this._fetch(url, {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
            }),
            body: JSON.stringify({
                'text': text,
                'user': this.currentUserInfo.id,
            }),
        })

        const newMessage = await response.json()
        return newMessage
    }

    async sendMessage(text) {
        this.chatSocket.send(JSON.stringify({
            type: 'send_message',
            payload: {
                text: text,
            },
        }))
    }
}

let apiInstance = null
export function getApiInstance() {
    if (apiInstance == null) {
        apiInstance = new Api()
        console.log('Created Api instance')
    }

    return apiInstance
}
