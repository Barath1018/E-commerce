import React, { useState, useEffect } from "react";
import { User, Settings, ShoppingBag, Heart, LogOut, Edit } from "lucide-react";
import { auth, firestore } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setNewName(user.displayName || "");
        setNewUsername(user.email?.split('@')[0] || "");
      } else {
        navigate("/login"); // Redirect to login if no user
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>; // Show a loading message while user data is being fetched
  }

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/"); // Redirect to home or login after logout
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      // Update displayName (name) in Firebase Auth
      await updateProfile(user, {
        displayName: newName,
      });

      // Optionally, update username and other details in Firestore
      const userRef = doc(firestore, "users", user.uid);
      await setDoc(userRef, { username: newUsername }, { merge: true });

      setIsEditing(false);
      setIsSubmitting(false);
    } catch (error) {
      alert("Error updating profile: " + error.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-4 rounded-full">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600">Manage your account settings and preferences</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded-md text-sm"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center space-x-3 mb-4">
              <Settings className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Account Settings</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-gray-900">{user?.email || "No email found"}</p>
              </div>

              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                {isEditing ? (
                  <input
                    className="mt-1 border p-2 rounded"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{user?.displayName || "No name provided"}</p>
                )}
              </div>

              {/* Username Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                {isEditing ? (
                  <input
                    className="mt-1 border p-2 rounded"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{newUsername || "No username provided"}</p>
                )}
              </div>

              {/* Edit Button */}
              {!isEditing && (
                <button
                  className="text-blue-600 mt-2 flex items-center gap-1"
                  onClick={handleEdit}
                >
                  <Edit className="w-4 h-4" /> Edit
                </button>
              )}

              {/* Save Button */}
              {isEditing && (
                <button
                  className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md"
                  onClick={handleSave}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              )}
            </div>
          </div>

          {/* Other sections here (Order History, Wishlist, Preferences) */}
        </div>
      </div>
    </div>
  );
};

export default Profile;
