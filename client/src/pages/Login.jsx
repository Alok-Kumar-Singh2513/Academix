import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
} from "@/features/api/authApi";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const [signupInput, setSignupInput] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const [loginInput, setLoginInput] = useState({ email: "", password: "" });

  const [
    registerUser,
    {
      data: registerData,
      error: registerError,
      isLoading: registerIsLoading,
      isSuccess: registerIsSuccess,
    },
  ] = useRegisterUserMutation();

  const [
    loginUser,
    {
      data: loginData,
      error: loginError,
      isLoading: loginIsLoading,
      isSuccess: loginIsSuccess,
    },
  ] = useLoginUserMutation();

  const changeInputHandler = (e, type) => {
    const { name, value } = e.target;

    if (type === "signup") {
      setSignupInput({ ...signupInput, [name]: value });
    } else {
      setLoginInput({ ...loginInput, [name]: value });
    }
  };

  const handleRoleToggle = (checked) => {
    setSignupInput({ ...signupInput, role: checked ? "instructor" : "student" });
  };

  const handleRegistration = async (type) => {
    try {
      const inputData = type === "signup" ? signupInput : loginInput;
      
      // Validate signup data
      if (type === "signup") {
        if (!inputData.name || !inputData.email || !inputData.password) {
          toast.error("Please fill in all required fields");
          return;
        }
        if (inputData.password.length < 6) {
          toast.error("Password must be at least 6 characters long");
          return;
        }
        if (!inputData.email.includes("@")) {
          toast.error("Please enter a valid email address");
          return;
        }
      }

      const action = type === "signup" ? registerUser : loginUser;
      const result = await action(inputData).unwrap();
      
      if (type === "signup") {
        toast.success(result.message || "Signup successful");
        // Clear form after successful registration
        setSignupInput({
          name: "",
          email: "",
          password: "",
          role: "student",
        });
        // Switch to login tab after successful registration
        document.querySelector('[value="login"]').click();
      } else {
        // Handle login success
        if (result.success && result.user) {
          toast.success(result.message || "Login successful");
          // Store user role in localStorage for role-based access
          localStorage.setItem("userRole", result.user.role);
          navigate("/");
        } else {
          toast.error("Login failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage = error.data?.message || 
        (error.status === 400 ? "Invalid input data" : 
        error.status === 401 ? "Authentication failed" : 
        "An error occurred during registration");
      toast.error(errorMessage);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (registerIsSuccess && registerData) {
      toast.success(registerData.message || "Signup successful");
    }
    if (registerError) {
      toast.error(registerError.data.message || "Signup failed..");
    }
    if (loginIsSuccess && loginData) {
      toast.success(loginData.message || "Login successful");
      navigate("/");
    }
    if (loginError) {
      toast.error("Login failed..");
    }
  }, [
    loginIsSuccess,
    registerIsSuccess,
    loginData,
    registerData,
    loginError,
    registerError,
    navigate,
  ]);

  return (
    <div className="flex items-center w-full justify-center mt-20">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signup">SignUp</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>

        {/* SignUp Tab */}
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Signup</CardTitle>
              <CardDescription>
                Create a new account and click signup when you are done.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input
                  type="text"
                  name="name"
                  placeholder="Eg. singh"
                  value={signupInput.name}
                  required
                  onChange={(e) => changeInputHandler(e, "signup")}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="Eg. singh123@gmail.com"
                  value={signupInput.email}
                  required
                  onChange={(e) => changeInputHandler(e, "signup")}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  name="password"
                  placeholder="Eg. xzy"
                  value={signupInput.password}
                  required
                  onChange={(e) => changeInputHandler(e, "signup")}
                />
              </div>
              <div className="flex items-center space-x-2 mt-4">
                <Switch
                  id="role-toggle"
                  checked={signupInput.role === "instructor"}
                  onCheckedChange={handleRoleToggle}
                />
                <Label htmlFor="role-toggle">
                  {signupInput.role === "instructor" ? "Instructor" : "Student"}
                </Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                disabled={registerIsLoading}
                onClick={() => handleRegistration("signup")}
              >
                {registerIsLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                    wait..
                  </>
                ) : (
                  "Signup"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Login Tab */}
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Login to your account here. After signup, you will be logged in.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="Eg. singh123@gmail.com"
                  value={loginInput.email}
                  required
                  onChange={(e) => changeInputHandler(e, "login")}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  name="password"
                  placeholder="Eg. xyz"
                  value={loginInput.password}
                  required
                  onChange={(e) => changeInputHandler(e, "login")}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                disabled={loginIsLoading}
                onClick={() => handleRegistration("login")}
              >
                {loginIsLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                    wait..
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Login;
