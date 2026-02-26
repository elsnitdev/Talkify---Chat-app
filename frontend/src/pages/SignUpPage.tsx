import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <div className="relative flex min-h-screen w-screen items-center justify-center p-4 overflow-hidden">
      <div
        className="absolute inset-0 bg-gradient-to-br 
   from-orange-200 via-orange-100 to-amber-200 opacity-70"
      />

      <div className="absolute -top-40 -left-40 w-96 h-96 bg-orange-300 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-300 rounded-full blur-3xl opacity-30" />

      <div className="relative w-full max-w-sm md:max-w-4xl">
        <SignupForm />
      </div>
    </div>
  );
}
