import axios from 'axios'

var token = ''
var hasLogin = false
export const baseUrl = 'http://127.0.0.1:5555/api'
export const websocketBaseUrl = 'ws://127.0.0.1:5555/api'

export const http = axios.create({
	baseURL: baseUrl,
	headers: {
		token: token,
	},
})

export const setToken = (itoken: string) => {
	token = itoken
	localStorage.setItem('token', token)
	http.defaults.headers['token'] = token
}

export const getToken = (): string => {
	return token
}

const loadToken = () => {
	token =
		localStorage.getItem('token') === null ? '' : localStorage.getItem('token')!
	setToken(token)
}

export function setHasLogin(value: boolean) {
	hasLogin = value
}

export function getHasLogin() {
	return hasLogin
}

var timer = null

loadToken()
