import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useSession } from "../../context/SessionContext";
import supabase from "../../supabase";

const SignUpPage = () => {
  // ==============================
  // If user is already logged in, redirect to home
  // This logic is being repeated in SignIn and SignUp..
  const { session } = useSession();
  if (session) return <Navigate to="/" />;
  // maybe we can create a wrapper component for these pages
  // just like the ./router/AuthProtectedRoute.tsx? up to you.
  // ==============================
  const [status, setStatus] = useState("");
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("Creating account...");
    const { error } = await supabase.auth.signUp({
      email: formValues.email,
      password: formValues.password,
    });
    if (error) {
      alert(error.message);
    }
    setStatus("");
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen flex flex-col items-center">
      <div className="relative w-full max-w-md min-h-screen flex flex-col bg-background-light dark:bg-background-dark shadow-2xl overflow-hidden">
        <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 w-full">
          <Link className="home-link" to="/">
            ◄ Home
          </Link>
          <form className="main-container" onSubmit={handleSubmit}>
            <h1 className="header-text">Sign Up</h1>
            <p
              style={{
                textAlign: "center",
                fontSize: "0.8rem",
                color: "#777",
              }}
            >
              Demo app, please don't use your real email or password
            </p>
            <input
              name="email"
              onChange={handleInputChange}
              type="email"
              placeholder="Email"
            />
            <input
              name="password"
              onChange={handleInputChange}
              type="password"
              placeholder="Password"
            />
            <button type="submit">Create Account</button>
            <Link className="auth-link" to="/auth/sign-in">
              Already have an account? Sign In
            </Link>
            {status && <p>{status}</p>}
          </form>
        </main>
        {/* Floating Decorative Element */}
        <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[30%] bg-primary/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
        <div className="fixed bottom-[-5%] right-[-5%] w-[40%] h-[20%] bg-accent/10 blur-[100px] rounded-full pointer-events-none z-0"></div>
      </div>
    </div>
  );
};

export default SignUpPage;
