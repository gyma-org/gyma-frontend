import React, { useEffect, useState } from 'react';
import { listGyms } from '../../api/gymList';  // Import the API function
import { GymListResponse } from '../../types/gymList';  // Import the type
import Image from 'next/image';

// Use environment variables
const GALLERY_BASE_URL = process.env.NEXT_PUBLIC_GALLERY_BASE_URL;
const PROFILE_BASE_URL = process.env.NEXT_PUBLIC_PROFILE_BASE_URL;

const GymListTest: React.FC = () => {
  const [gyms, setGyms] = useState<GymListResponse[]>([]);  // State to store the list of gyms
  const [loading, setLoading] = useState<boolean>(true);  // Loading state
  const [error, setError] = useState<string | null>(null);  // Error state

  useEffect(() => {
    const fetchGyms = async () => {
      try {
        const data = await listGyms();  // Call the API function
        setGyms(data);  // Update state with the fetched gyms
      } catch (err) {
        // Type guard to check if err is an instance of Error
        if (err instanceof Error) {
          setError(err.message);  // Set the error message
        } else {
          setError("An unknown error occurred");  // Fallback for unknown errors
        }
      } finally {
        setLoading(false);  // Stop loading
      }
    };

    fetchGyms();  // Fetch gyms on component mount
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Gym List</h1>
      <ul>
        {gyms.map(gym => (
          <li key={gym.id}>
            <h2>{gym.name}</h2>
            <p><strong>Code:</strong> {gym.gym_code}</p>
            <p><strong>Owner:</strong> {gym.owner_firstname} {gym.owner_lastname}</p>
            <p><strong>Email:</strong> {gym.owner_email}</p>
            <p><strong>Address:</strong> {gym.address}</p>
            <p><strong>Location:</strong> Lat {gym.lat}, Lon {gym.lon}</p>
            <p><strong>City:</strong> {gym.city}</p>
            <p><strong>Phone Number:</strong> {gym.phone_number}</p>
            {gym.profile_url && (
              <Image 
                src={`${PROFILE_BASE_URL}${gym.profile_url}`} 
                alt={`${gym.name} profile`} 
                width={100} 
                height={100} 
                layout="responsive" 
              />
            )}
            {Array.isArray(gym.gallery) && gym.gallery.length > 0 && (
              <div>
                <h3>Gallery:</h3>
                {gym.gallery.map((img, index) => (
                  <img 
                    key={index} 
                    src={`${GALLERY_BASE_URL}${img}`} 
                    alt={`${gym.name} gallery ${index}`} 
                    width={100} 
                  />
                ))}
              </div>
            )}
            <p><strong>Features:</strong> {gym.features.join(', ')}</p>
            <p><strong>Sex:</strong> {gym.sex}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GymListTest;
