import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Funcionarios from './pages/Funcionario.jsx'
import Epi from './pages/EPI.jsx'
import EditarEPIs from './pages/EditarEPIs.jsx'
import Historico from './pages/Historico.jsx'

const paginas = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/funcionarios', element: <Funcionarios /> },
  { path: '/Epi', element: <Epi /> },
  { path: '/Historico', element: <Historico /> }
])

createRoot(document.getElementById('root')).render(
  <RouterProvider router={paginas} />
)