import React, { useState, useEffect } from "react";
import { auth, googleProvider } from "../firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

interface Props {
  isSignup?: boolean;
}

const AuthForm: React.FC<Props> = ({ isSignup = false }) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleAuth = async () => {
    try {
      if (isSignup) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Set display name to name or username
        await updateProfile(userCredential.user, {
          displayName: name || username,
        });

        // You can also store additional user data in Firestore here
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/profile");
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/profile");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto mt-10 p-4 border rounded-lg">
      <h1 className="text-xl font-bold text-center">{isSignup ? "Sign Up" : "Login"}</h1>

      {isSignup && (
        <>
          <input
            className="border p-2 rounded"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="border p-2 rounded"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </>
      )}

      <input
        className="border p-2 rounded"
        placeholder="Email"
        type="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border p-2 rounded"
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="bg-blue-500 text-white py-2 rounded" onClick={handleAuth}>
        {isSignup ? "Sign Up" : "Login"}
      </button>

      <div className="text-center text-sm text-gray-500">or</div>

      <button className="bg-red-500 text-white py-2 rounded" onClick={handleGoogle}>
        Continue with Google
      </button>
    </div>
  );
};

export default AuthForm;
