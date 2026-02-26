import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";

export default function ProtectedRoute() {
  const { accessToken, user, loading, refresh, fetchMe } = useAuthStore();
  const [starting, setStarting] = useState(true);

  const init = async () => {
    // có thể xảy ra khi refresh trang
    if (!accessToken) {
      await refresh();
      console.log("token");
    }
    setStarting(false);
    if (accessToken && !user) {
      console.log("user");
      await fetchMe();
    }
  };

  useEffect(() => {
    init();
  }, []);

  if (starting || loading) {
    console.log(`State loading : ${loading} State Starting :${starting}`);
    return (
      <div className="flex h-screen items-center justify-center">
        Đang tải trang...
      </div>
    );
  }

  if (!accessToken) {
    return <Navigate to="/signin" replace />;
  }
  return <Outlet></Outlet>;
}
