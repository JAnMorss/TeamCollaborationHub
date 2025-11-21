import { RouterProvider } from 'react-router-dom'
import './App.css'
import { router } from './router/Routes'
import { useTheme } from './hooks/useTheme';

function App() {
  useTheme();
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
