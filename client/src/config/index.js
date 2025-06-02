export const signUpFormControls=[
    {
        name: "userName",
        label: "User Name",
        placeholder: "Enter your username",
        type: "text",
        componentType: "input"
    },
    {
        name: "userEmail",
        label: "Email",
        placeholder: "Enter your email",
        type: "email",
        componentType: "input"
    },
    {
        name: "password",
        label: "Password",
        placeholder: "password",
        type: "password",
        componentType: "input"
    },
]
export const signInFormControls=[
    {
        name: "userEmail",
        label: "Email",
        placeholder: "Enter your email",
        type: "email",
        componentType: "input"
    },
    {
        name: "password",
        label: "Password",
        placeholder: "password",
        type: "password",
        componentType: "input"
    },
]
export const initialSignInFormData = {
  userEmail: "",
  password: "",
};
export const initialSignUpFormData = {
  userName: "",
  userEmail: "",
  password: "",
};