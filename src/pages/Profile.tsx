import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase/client";
import { User, LogOut } from "lucide-react";

const Profile = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    setNewName(user.user_metadata?.full_name || "");
    setNewUsername(user.user_metadata?.username || user.email?.split("@")[0] || "");
  }, [user, navigate]);

  if (!user) return null;

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({ data: { full_name: newName, username: newUsername } });
      if (error) throw error;
      setIsEditing(false);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-white">Profile</h1>

      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-6">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-400/20 to-amber-600/20 border border-white/[0.08]">
            <User className="h-6 w-6 text-amber-400/60" />
          </div>
          <div>
            <div className="text-sm font-medium text-white/80">{user.user_metadata?.full_name || "—"}</div>
            <div className="text-xs text-white/30">{user.email}</div>
          </div>
        </div>

        <div className="border-t border-white/[0.06] pt-5 space-y-5">
          <div>
            <label className="block text-[10px] font-semibold text-white/30 uppercase tracking-[0.2em] mb-1.5">Email</label>
            <div className="text-sm text-white/50">{user.email}</div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-white/30 uppercase tracking-[0.2em] mb-1.5">Name</label>
            {isEditing ? (
              <input
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-sm text-white focus:border-white/[0.2] focus:outline-none focus:ring-1 focus:ring-white/20"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            ) : (
              <div className="text-sm text-white/60">{user.user_metadata?.full_name || "—"}</div>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-white/30 uppercase tracking-[0.2em] mb-1.5">Username</label>
            {isEditing ? (
              <input
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-sm text-white focus:border-white/[0.2] focus:outline-none focus:ring-1 focus:ring-white/20"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
            ) : (
              <div className="text-sm text-white/60">{newUsername || "—"}</div>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={isSubmitting}
                className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-gray-950 transition hover:bg-white/90 disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-white/60 transition hover:border-white/[0.15] hover:bg-white/[0.06]"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-white/60 transition hover:border-white/[0.15] hover:bg-white/[0.06]"
            >
              Edit profile
            </button>
          )}
        </div>
      </div>

      <button
        onClick={async () => { await logout(); navigate("/"); }}
        className="flex items-center gap-2 text-sm text-white/30 hover:text-red-400 transition"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </div>
  );
};

export default Profile;
