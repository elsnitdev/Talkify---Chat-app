import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "../ui/label";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type React from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";
const signInSchema = z.object({
  username: z.string().min(3, "User name must have at least character "),
  password: z.string().min(8, "password must be have at least 8 character"),
});
type SignInFormValues = z.infer<typeof signInSchema>;

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const { signIn } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });
  const onSubmit = async (data: SignInFormValues) => {
    const { username, password } = data;
    console.log(`username : ${username}`);
    await signIn(username, password);
    navigate("/");
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border-border">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              {/* header - logo */}
              <div className="flex flex-col items-center gap-2 text-center">
                <a
                  href="/"
                  className="group mx-auto block w-fit transition-opacity hover:opacity-80"
                >
                  <img
                    src="../images/logo.jpg"
                    alt="Talkify Logo"
                    className="h-16 w-16 rounded-full object-cover border-2 border-muted shadow-sm"
                  />
                </a>

                <h1 className="text-2xl font-bold tracking-tight">
                  Tạo tài khoản Talkify
                </h1>
                <p className="text-muted-foreground text-balance">
                  Chào mừng bạn! Hãy đăng ký để bắt đầu trò chuyện!
                </p>
              </div>

              {/* username */}
              <div className="flex flex-col gap-3">
                <Label htmlFor="username" className="block text-sm">
                  Tên đăng nhập
                </Label>
                <Input
                  type="text"
                  id="username"
                  placeholder="Elon musk"
                  {...register("username")}
                />{" "}
                {errors.username && (
                  <p className="text-destructive text-sm text-red-500">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* password */}
              <div className="flex flex-col gap-3">
                <Label htmlFor="password" className="block text-sm">
                  Mật khẩu
                </Label>
                <Input
                  type="password"
                  id="password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-destructive text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* nút đăng ký */}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                Đăng nhập
              </Button>

              <div className="text-center text-sm">
                Bạn chưa có tài khoản?{" "}
                <a href="/signup" className="underline underline-offset-4">
                  Đăng ký
                </a>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="./images/Login/login_thumbnail.jpg"
              alt="Image"
              className="absolute top-1/2 -translate-y-1/2 object-cover"
            />
          </div>
        </CardContent>
      </Card>
      <div className=" text-xs text-balance px-6 text-center *:[a]:hover:text-primary text-muted-foreground *:[a]:underline *:[a]:underline-offetset-4">
        Bằng cách tiếp tục, bạn đồng ý với <a href="#">Điều khoản dịch vụ</a> và{" "}
        <a href="#">Chính sách bảo mật</a> của chúng tôi.
      </div>
    </div>
  );
}
