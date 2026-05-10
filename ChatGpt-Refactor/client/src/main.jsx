import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import "./app/global.css"
import { Provider } from 'react-redux'
import store from './store/store.js'
import { routes } from './app/app.routes.jsx'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={routes} />
  </Provider>
)