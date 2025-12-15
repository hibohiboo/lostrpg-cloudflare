import { RouterProvider } from 'react-router';
import { createRouter } from './routes';

function Router() {
  const router = createRouter();

  return <RouterProvider router={router} />;
}

export default Router;
