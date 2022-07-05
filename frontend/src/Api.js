
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
    }

    onLogin(callback) {
        this.loginCallbacks.push(callback)
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

        if (!response.ok) {
            throw new AuthenticationError(response.status, body)
        }

        this.accessToken = body.access
        this.refereshToken = body.refresh

        this.loginCallbacks.forEach((callback) => callback())
    }
}

export default Api