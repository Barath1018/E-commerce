import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Account = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>You are not logged in</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Hello, {user.email}</h1>
      <button onClick={handleLogout} className="bg-black text-white px-4 py-2 rounded mt-4">
        Logout
      </button>
    </div>
  );
};

export default Account;
