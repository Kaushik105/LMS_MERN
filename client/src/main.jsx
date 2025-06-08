import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { InstructorProvider } from "./context/instructorContext";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <BrowserRouter>
      <InstructorProvider>
        <App />
      </InstructorProvider>
    </BrowserRouter>
  </AuthProvider>
);
