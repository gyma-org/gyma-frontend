// /src/components/AddGymForm.tsx

import React, { useState } from 'react';
import { addGym } from '../../api/gym';
import { AddGymRequest } from '../../types/gym';

const AddGymForm: React.FC = () => {
  const [formData, setFormData] = useState<AddGymRequest>({
    name: '',
    gym_code: '',
    password: '',
    owner_firstname: '',
    owner_lastname: '',
    owner_email: '',
    owner_national_code: '',
    address: '',
    lat: 0,
    lon: 0,
    city: 'TEH',
    phone_number: '',
    profile: null,
    gallery: [],
    features: [],
    sex: 'both',
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData(prev => ({ ...prev, gallery: files }));
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({ ...prev, profile: e.target.files[0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await addGym(formData);
      setSuccess('Gym added successfully!');
    } catch (err) {
      setError(err.message || 'An error occurred while adding the gym.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Add Gym</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>
          Gym Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Gym Code:
          <input
            type="text"
            name="gym_code"
            value={formData.gym_code}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Owner First Name:
          <input
            type="text"
            name="owner_firstname"
            value={formData.owner_firstname}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Owner Last Name:
          <input
            type="text"
            name="owner_lastname"
            value={formData.owner_lastname}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Owner Email:
          <input
            type="email"
            name="owner_email"
            value={formData.owner_email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Owner National Code:
          <input
            type="text"
            name="owner_national_code"
            value={formData.owner_national_code}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Address:
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Latitude:
          <input
            type="number"
            name="lat"
            value={formData.lat}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Longitude:
          <input
            type="number"
            name="lon"
            value={formData.lon}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          City:
          <select
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          >
            <option value="ALB">ALB</option>
            <option value="ARD">ARD</option>
            <option value="BUS">BUS</option>
            {/* Add other options as needed */}
          </select>
        </label>
        <label>
          Phone Number:
          <input
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Profile Image:
          <input
            type="file"
            name="profile"
            onChange={handleProfileChange}
            required
          />
        </label>
        <label>
          Gallery Images:
          <input
            type="file"
            multiple
            onChange={handleFileChange}
          />
        </label>
        <label>
          Sex:
          <select
            name="sex"
            value={formData.sex}
            onChange={handleChange}
            required
          >
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="both">Both</option>
          </select>
        </label>
        <label>
          Features:
          <input
            type="text"
            name="features"
            placeholder="Enter features separated by commas"
            value={formData.features?.join(', ') || ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              features: e.target.value.split(',').map(feature => feature.trim())
            }))}
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
      {success && <p>{success}</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default AddGymForm;
