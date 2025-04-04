import { Link } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';

export default function LoginPage({ onLoginSuccess }) {
  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="bg-white shadow-lg rounded-lg p-10 w-full max-w-md relative">
        <Link
          to="/"
          className="absolute top-4 left-4 text-2xl text-blue-500 hover:text-blue-700"
        >
          ←
        </Link>
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <LoginForm onLoginSuccess={onLoginSuccess} />
      </div>
    </div>
  );
}