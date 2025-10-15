'use client';

import { useState, useEffect } from 'react';
import { Event, CreateEventData, UpdateEventData, eventsAPI } from '../../../lib/events';

interface EventFormProps {
  event?: Event | null;
  onClose: () => void;
  onSubmit: () => void;
}

export default function EventForm({ event, onClose, onSubmit }: EventFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    totalSeats: '',
    ticketPrice: ''
  });
  
  const [primaryImage, setPrimaryImage] = useState<File | null>(null);
  const [secondaryImages, setSecondaryImages] = useState<File[]>([]);
  const [primaryImagePreview, setPrimaryImagePreview] = useState<string>('');
  const [secondaryImagePreviews, setSecondaryImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        date: new Date(event.date).toISOString().slice(0, 16),
        location: event.location,
        totalSeats: event.totalSeats.toString(),
        ticketPrice: event.ticketPrice.toString()
      });
      setPrimaryImagePreview(event.primaryImage.url);
      setSecondaryImagePreviews(event.secondaryImages.map(img => img.url));
    }
  }, [event]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePrimaryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPrimaryImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPrimaryImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSecondaryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSecondaryImages(files);
    
    const previews: string[] = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        previews.push(e.target?.result as string);
        if (previews.length === files.length) {
          setSecondaryImagePreviews(previews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeSecondaryImage = (index: number) => {
    const newFiles = secondaryImages.filter((_, i) => i !== index);
    const newPreviews = secondaryImagePreviews.filter((_, i) => i !== index);
    setSecondaryImages(newFiles);
    setSecondaryImagePreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (event) {
        // Update existing event
        const updateData: UpdateEventData = {
          title: formData.title,
          description: formData.description,
          date: formData.date,
          location: formData.location,
          totalSeats: parseInt(formData.totalSeats),
          ticketPrice: parseFloat(formData.ticketPrice)
        };

        if (primaryImage) {
          updateData.primaryImage = primaryImage;
        }

        if (secondaryImages.length > 0) {
          updateData.secondaryImages = secondaryImages;
        }

        await eventsAPI.updateEvent(event._id, updateData);
      } else {
        // Create new event
        if (!primaryImage) {
          setError('Primary image is required');
          setLoading(false);
          return;
        }

        const createData: CreateEventData = {
          title: formData.title,
          description: formData.description,
          date: formData.date,
          location: formData.location,
          totalSeats: parseInt(formData.totalSeats),
          ticketPrice: parseFloat(formData.ticketPrice),
          primaryImage: primaryImage,
          secondaryImages: secondaryImages.length > 0 ? secondaryImages : undefined
        };

        await eventsAPI.createEvent(createData);
      }

      onSubmit();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {event ? 'Edit Event' : 'Create New Event'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="form-label">
                Event Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                required
                placeholder="Enter event title"
              />
            </div>

            <div>
              <label htmlFor="date" className="form-label">
                Event Date & Time *
              </label>
              <input
                type="datetime-local"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="form-label">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input-field"
              rows={4}
              required
              placeholder="Describe your event..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="location" className="form-label">
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="input-field"
                required
                placeholder="Event location"
              />
            </div>

            <div>
              <label htmlFor="totalSeats" className="form-label">
                Total Seats *
              </label>
              <input
                type="number"
                id="totalSeats"
                name="totalSeats"
                value={formData.totalSeats}
                onChange={handleChange}
                className="input-field"
                min="1"
                required
                placeholder="Number of seats"
              />
            </div>
          </div>

          <div>
            <label htmlFor="ticketPrice" className="form-label">
              Ticket Price *
            </label>
            <input
              type="number"
              id="ticketPrice"
              name="ticketPrice"
              value={formData.ticketPrice}
              onChange={handleChange}
              className="input-field"
              min="0"
              step="0.01"
              required
              placeholder="Price per ticket"
            />
          </div>

          {/* Image Uploads */}
          <div className="space-y-6">
            <div>
              <label className="form-label">
                Primary Image *
              </label>
              <div className="mt-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePrimaryImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
                {primaryImagePreview && (
                  <div className="mt-2">
                    <img
                      src={primaryImagePreview}
                      alt="Primary preview"
                      className="h-32 w-48 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="form-label">
                Secondary Images (Optional)
              </label>
              <div className="mt-1">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleSecondaryImagesChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
                {secondaryImagePreviews.length > 0 && (
                  <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
                    {secondaryImagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Secondary ${index + 1}`}
                          className="h-20 w-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeSecondaryImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (event ? 'Update Event' : 'Create Event')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
