import Logout from "@/components/auth/Logout";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

export default function ChatAppPage() {
  const user = useAuthStore((s) => s.user);
  console.log("Token trong store:", useAuthStore.getState().accessToken);
  console.log(user);
  const handleOnClick = async () => {
    try {
      await api.get("/users/test", { withCredentials: true });
      toast.success("successful");
    } catch (error) {
      console.error(error);
      toast.error("fail");
    }
  };
  return (
    <div className="flex flex-col">
      <Logout></Logout>
      <Button onClick={handleOnClick}>Test</Button>
      <div className="text-2xl">Home Page</div>;
      <div className="text-2xl bg-blue-800">{user?.displayName}</div>
    </div>
  );
}
