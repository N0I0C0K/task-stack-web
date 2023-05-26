import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { TaskList } from 'pages/task-list/TaskList'
import { SessionList } from 'pages/session-list/SessionList'
import { HomePanel } from 'pages/home/home'

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{
				path: 'home',
				element: <HomePanel />,
			},
			{
				path: 'task',
				element: <TaskList />,
			},
			{
				path: 'session',
				element: <SessionList />,
			},
			{
				path: 'setting',
				element: <p>setting</p>,
			},
			{
				path: '*',
				element: <HomePanel />,
			},
		],
	},
])

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(<RouterProvider router={router} />)
