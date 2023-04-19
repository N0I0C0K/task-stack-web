import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/home/home'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'task',
        element: <p>task</p>,
      },
      {
        path: '',
        element: <Home />,
      },
    ],
  },
])

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(<RouterProvider router={router} />)
