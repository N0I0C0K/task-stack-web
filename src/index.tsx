import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { TaskList } from 'pages/task-list/TaskList'
import { SessionList } from 'pages/session-list/SessionList'

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{
				path: '',
				element: <TaskList />,
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
		],
	},
])

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(<RouterProvider router={router} />)
