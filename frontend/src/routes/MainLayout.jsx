import Sidebar from '../components/layout/Sidebar';
import Layout from '../components/layout/Layout';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <Layout>
        <div className="flex-1">
          <Outlet />
        </div>
      </Layout>
    </div>
  );
}