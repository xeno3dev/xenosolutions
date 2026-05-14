import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { getRouter } from './router'

import './styles.css'

const container = document.getElementById('root')!
const root = createRoot(container)

const router = getRouter()

root.render(
  <RouterProvider router={router} />,
)