import { BrowserRouter, Route, Routes } from "react-router";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import SignOutPage from "./pages/SignOutPage";
import ChatAppPage from "./pages/ChatAppPage";
import { Toaster } from "sonner";
import ProtectedRoute from "./components/auth/ProtectedRoute";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* public routes */}
          <Route path="/signin" element={<SignInPage></SignInPage>}></Route>
          <Route path="/signup" element={<SignUpPage></SignUpPage>}></Route>
          <Route path="/signout" element={<SignOutPage></SignOutPage>}></Route>
          {/* protected routes */}
          <Route element={<ProtectedRoute></ProtectedRoute>}>
            <Route path="/" element={<ChatAppPage></ChatAppPage>}></Route>
          </Route>
        </Routes>
      </BrowserRouter>{" "}
      <Toaster richColors position="top-right" />
    </>
  );
}

export default App;
