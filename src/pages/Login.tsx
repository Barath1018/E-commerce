import { useSearchParams } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

const Login = () => {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  return (
    <div className="py-16">
      <AuthForm isSignup={false} redirectTo={redirectTo} />
    </div>
  );
};

export default Login;
