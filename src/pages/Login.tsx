import AuthForm from '../components/AuthForm';

const Login = () => {
  return (
    <div className="py-16">
      <AuthForm isSignup={false} />
    </div>
  );
};

export default Login;
