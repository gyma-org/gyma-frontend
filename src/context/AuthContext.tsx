"use client";
import { createContext, useState, useContext, useEffect, useCallback, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { RegisterValues } from "@/types/RegisterValues";
import Cookies from "js-cookie";
import { getSavedGyms } from "@/api/DisplaySavedGyms";

interface AuthTokens {
  access: string;
  refresh: string;
}

interface User {
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  authTokens: AuthTokens | null;
  registerUser: (userData: RegisterValues) => Promise<{ success: boolean; errors?: any }>;
  loginUser: (
    credentials: UserCredentials
  ) => Promise<{ success: boolean; status_code: number; message: string }>;
  logoutUser: () => void;
  loading: boolean;
}

interface UserCredentials {
  identifier: string;
  password: string;
}

interface UserData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  sex: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [authTokens, setAuthTokens] = useState<AuthTokens | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const logoutUser = useCallback(() => {
    localStorage.removeItem("authTokens");
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setAuthTokens(null);
    setUser(null);
    window.location.href = "/";
  }, [router]);

  const updateToken = useCallback(async () => {
    if (!authTokens?.refresh) {
      setLoading(false);
      return;
    }

    try {
      console.log("Refreshing token...");
      const response = await fetch("https://backuser.gyma.app/auth/token-refresh/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: authTokens.refresh }),
      });
    
      if (!response.ok) {
        // Handle specific response status codes
        if (response.status === 400 || response.status === 401) {
          console.warn("Invalid or expired refresh token, logging out...");
          logoutUser();
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    
      const data = await response.json();
      setAuthTokens(data);
      setUser(jwtDecode<User>(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
      document.cookie = `auth_token=${data.access}; path=/; max-age=${
        60 * 60 * 24 * 7
      }; SameSite=Strict; Secure`;
    
    } catch (error) {
      console.error("Token refresh error:", error);
    
      // Network errors (e.g., no internet, server down)
      if (error instanceof TypeError) {
        console.warn("Network issue, not logging out the user.");
      } else {
        logoutUser();
      }
    } finally {
      setLoading(false);
    }
  }, [authTokens, logoutUser]);

  const registerUser = async (userData: RegisterValues) => {
    const formData = new FormData();

    // Append text fields
    formData.append("first_name", userData.first_name);
    formData.append("last_name", userData.last_name);
    formData.append("phone_number", userData.phone_number);
    formData.append("password", userData.password);
    formData.append("sex", userData.sex);
    console.log(formData);

    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
    // Append optional fields if available
    if (userData.height) formData.append("height", userData.height.toString());
    if (userData.weight) formData.append("weight", userData.weight.toString());

    // Append files if provided
    if (userData.profile) formData.append("profile", userData.profile);
    if (userData.banner) formData.append("banner", userData.banner);
    console.log(formData);
    try {
      const response = await fetch("https://backuser.gyma.app/user/add-user/", {
        method: "POST",
        body: formData, // Use FormData directly as body
      });

      if (response.ok) {
        return { success: true };
      } else {
        const data = await response.json();
        return { success: false, errors: data };
      }
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, errors: { non_field_errors: ["An unexpected error occurred"] } };
    }
  };

  const loginUser = async (credentials: UserCredentials) => {
    try {
      const response = await fetch("https://backuser.gyma.app/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        setAuthTokens(data);
        setUser(jwtDecode<User>(data.access));
        localStorage.setItem("authTokens", JSON.stringify(data));
        document.cookie = `auth_token=${data.access}; path=/; max-age=${
          60 * 60 * 24 * 7
        }; SameSite=Strict; Secure`;

        // Store the user's gender in localStorage
        if (data.sex) {
          localStorage.setItem("selectedGender", data.sex === "men" ? "men" : "women");
        }

        // Fetch the saved gyms from the API after successful login
        const savedGyms = await getSavedGyms(data.access, logoutUser); // Fetch saved gyms using the newly obtained access token
        const gymIds = savedGyms.map((gym) => gym.gym_id.toString()); // Map the gym IDs to strings
        
        // Save the gym IDs in cookies
        Cookies.set("savedGymIds", JSON.stringify(gymIds), { expires: 7 }); // Set the gym IDs in cookies for 7 days

        router.push("/");
        return { success: true, status_code: response.status, message: "Login successful" }; // success response
      } else {
        return { success: false, status_code: response.status, message: data.detail || "Login failed" }; // error response
      }
    } catch (error: any) {
      console.error("Login error:", error);
      return { success: false, status_code: 500, message: error.message || "An unexpected error occurred" }; // error response
    }
  };

  useEffect(() => {
    const storedTokens = localStorage.getItem("authTokens");
    if (storedTokens) {
      const tokens = JSON.parse(storedTokens);
      setAuthTokens(tokens);
      setUser(jwtDecode<User>(tokens.access));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const REFRESH_INTERVAL = 1000 * 60 * 2; // 2 minutes
    let interval: NodeJS.Timeout;
    let secondsPassed = 0; // Initialize counter for seconds

    if (authTokens) {
      interval = setInterval(() => {
        secondsPassed += 1; // Increment the seconds counter
        // console.log(`Seconds passed: ${secondsPassed}`);

        // Check if it's time to refresh the token
        if (secondsPassed >= REFRESH_INTERVAL / 1000) {
          // console.log("Refreshing token now...");
          updateToken();
          secondsPassed = 0; // Reset the counter after refresh
        }
      }, 1000); // Set interval to 1 second
    }

    return () => clearInterval(interval); // Cleanup on unmount
  }, [authTokens, updateToken]);

  const contextData: AuthContextType = {
    user,
    authTokens,
    registerUser,
    loginUser,
    logoutUser,
    loading,
  };

  return <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
