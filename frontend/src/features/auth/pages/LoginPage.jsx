import { Link } from 'react-router-dom';
import AuthForm from '../../auth/components/AuthForm';
import { FaHome } from 'react-icons/fa';

export default function LoginPage({ onLoginSuccess }) {
  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="bg-white shadow-lg rounded-lg p-10 w-full max-w-md relative">
        <Link
          to="/"
          className="absolute top-5 left-5 text-3xl text-blue-500 hover:text-blue-700">
          <FaHome />
        </Link>
        <h2 className="text-2xl font-bold mb-6 text-center">Login/SignUp</h2>
        <AuthForm onAuthSuccess={onLoginSuccess} />
      </div>
    </div>
  );
}