import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ component }) {
  const { loading, userId } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!userId) navigate("/login");
  }, [loading]);

  return !loading && userId && component;
}
