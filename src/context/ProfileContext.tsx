import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import {useAuth} from "@/context/AuthContext";
import { fetchProfile } from '../api/profile';

interface Profile {
  // Define the structure of the profile data according to your API response
  id: number;
  username: string;
  email: string;
  // Add other fields as necessary
}

interface ProfileContextType {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const { authTokens } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        if (authTokens?.access) {
          const data = await fetchProfile(authTokens.access);
          setProfile(data);
        }
      } catch (error: any) {
        setError(error.message);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    if (authTokens) {
      getProfile();
    }
  }, [authTokens]);

  return (
    <ProfileContext.Provider value={{ profile, loading, error }}>
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileContext;
