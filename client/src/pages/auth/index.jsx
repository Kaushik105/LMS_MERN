import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { signInFormControls, signUpFormControls } from "@/config";
import CommonForm from "@/components/commonForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { formValidator } from "@/utils/formValidator";

function AuthPage() {
  const [activeTab, setActiveTab] = useState("signIn");

  const {
    signInFormData,
    setSignInFormData,
    signUpFormData,
    setSignUpFormData,
    handleRegisterUser,
    handleLogin,
  } = useAuth();

  function handleActiveTabChange(value) {
    setActiveTab(value);
  }

  return (
    <div className="flex flex-col w-full min-h-screen">
      <header className="flex h-16 items-center border-b px-6 lg:px-8 py-2">
        <Link to={"/"} className="flex gap-2 justify-center items-center">
          <GraduationCap size={44} />
          <h1 className="text-2xl font-bold">LMS Learning</h1>
        </Link>
      </header>
      <div className="min-h-screen flex justify-center bg-background items-center">
        <Tabs
          className={"w-full max-w-md"}
          defaultValue={"signIn"}
          value={activeTab}
          onValueChange={handleActiveTabChange}
        >
          <TabsList className={"w-full"}>
            <TabsTrigger value={"signIn"}>Sign In</TabsTrigger>
            <TabsTrigger value={"signUp"}>Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value={"signIn"}>
            <Card>
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>Sing in to your account</CardDescription>
              </CardHeader>
              <CardContent>
                <CommonForm
                  formControls={signInFormControls}
                  formData={signInFormData}
                  setFormData={setSignInFormData}
                  btnText="Sign In"
                  isBtnDisabled={formValidator(signInFormData)}
                  handleSubmit={handleLogin}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value={"signUp"}>
            <Card>
              <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>Create a new account</CardDescription>
              </CardHeader>
              <CardContent>
                <CommonForm
                  formControls={signUpFormControls}
                  formData={signUpFormData}
                  setFormData={setSignUpFormData}
                  btnText="Sign Up"
                  isBtnDisabled={formValidator(signUpFormData)}
                  handleSubmit={handleRegisterUser}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default AuthPage;
