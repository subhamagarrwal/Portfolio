import { ViteReactSSG } from 'vite-react-ssg'
import App from './App.tsx'
import Index from './pages/Index.tsx'
import NotFound from './pages/NotFound.tsx'
import './index.css'

const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Index />
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
];

export const createRoot = ViteReactSSG({ routes });
