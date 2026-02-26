import { create } from "zustand";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/stores";

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,
  setAccessToken: (accessToken) => {
    set({ accessToken });
  },
  signUp: async (username, password, email, firstName, lastName) => {
    try {
      set({ loading: true });
      // call api
      await authService.signUp(username, password, email, firstName, lastName);
      toast.success("Đăng ký thành công");
    } catch (error) {
      console.error(error);
      toast.error("đăng ký không thành công");
    } finally {
      set({ loading: false });
    }
  },
  signIn: async (username, password) => {
    try {
      set({ loading: true });
      const { accessToken } = await authService.signIn(username, password);
      get().setAccessToken(accessToken);
      await get().fetchMe();
      toast.success("Đăng nhập thành công");
    } catch (error) {
      console.log(error);
      toast.error("Đăng nhập thất bại");
    } finally {
      set({ loading: false });
    }
  },
  clearState: () => {
    set({ accessToken: null, user: null, loading: false });
  },
  signOut: async () => {
    try {
      await authService.signOut();
      get().clearState();
      toast.success("logout thành công");
    } catch (error) {
      console.error(error);
      toast.error("logout không thành công");
    }
  },
  fetchMe: async () => {
    try {
      set({ loading: true });
      const user = await authService.fetchMe();
      set({ user: user });
    } catch (error) {
      console.error(error);
      set({ user: null, accessToken: null });
      toast.error("Đã có lỗi xảy ra khi lấy dữ liệu từ người dùng");
    } finally {
      set({ loading: false });
    }
  },
  refresh: async () => {
    try {
      const { user, fetchMe } = get();
      set({ loading: true });
      const accessToken = await authService.refresh();
      console.log("refresh");
      get().setAccessToken(accessToken);
      if (!user) {
        await fetchMe();
      }
      console.log(accessToken);
    } catch (error) {
      console.error(error);
      toast.error("Phiên đăng nhập đã hết hạn");
      get().clearState();
    } finally {
      set({ loading: false });
    }
  },
}));
