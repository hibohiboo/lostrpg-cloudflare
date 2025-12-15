import { Layout as UILayout } from '@lostrpg/ui/index';
import { Outlet, ScrollRestoration } from 'react-router';

export function Layout() {
  return (
    <UILayout>
      <Outlet />
      <ScrollRestoration />
    </UILayout>
  );
}
