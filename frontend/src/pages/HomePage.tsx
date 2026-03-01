import { Link } from "react-router-dom";
import supabase from "../supabase";
import { useSession } from "../context/SessionContext";

const HomePage = () => {
  const { session } = useSession();
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen flex flex-col items-center">
      <div className="relative w-full max-w-md min-h-screen flex flex-col bg-background-light dark:bg-background-dark shadow-2xl overflow-hidden">
        <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 w-full">
          <section className="main-container">
            <h1 className="header-text text-3xl">React Supabase Auth Template</h1>
            <p>Current User : {session?.user.email || "None"}</p>
            <Link
              to="/protected"
              className="flex justify-center items-center h-screen"
              >
              Go to Application
            </Link>
              {session ? (
                <button onClick={() => supabase.auth.signOut()}>Sign Out</button>
              ) : (
                <Link to="/auth/sign-in">Sign In</Link>
              )}
          </section>
        </main>
        {/* Floating Decorative Element */}
        <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[30%] bg-primary/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
        <div className="fixed bottom-[-5%] right-[-5%] w-[40%] h-[20%] bg-accent/10 blur-[100px] rounded-full pointer-events-none z-0"></div>
      </div>
    </div>
  );
};

export default HomePage;
