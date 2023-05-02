import axios from 'axios'

export var token = ''
export const baseUrl = 'http://127.0.0.1:5555/api'

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

export const getToken = () => {
	return token
}

const loadToken = () => {
	token =
		localStorage.getItem('token') === null ? '' : localStorage.getItem('token')!
	setToken(token)
}

var timer = null

loadToken()
