import React, { useState } from 'react';
import { MapPin, Check, AlertCircle, X } from 'lucide-react';

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  department: string;
  designation: string;
  locations: string[];
  justification: string;
  duration: 'temporary' | 'permanent';
  supervisorInfo: string;
  additionalComments: string;
  termsAgreed: boolean;
  confidentialityAgreed: boolean;
}

const availableLocations = [
  'North District',
  'South District',
  'East District',
  'West District',
  'Central Business District',
  'Industrial Zone',
  'Port Area',
  'Suburban Region'
];

const LocationRequest: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    department: '',
    designation: '',
    locations: [],
    justification: '',
    duration: 'temporary',
    supervisorInfo: '',
    additionalComments: '',
    termsAgreed: false,
    confidentialityAgreed: false
  });

  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showConfidentialityModal, setShowConfidentialityModal] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof FormData]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormData];
        return newErrors;
      });
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      locations: checked
        ? [...prev.locations, value]
        : prev.locations.filter(loc => loc !== value)
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.designation.trim()) newErrors.designation = 'Designation is required';
    if (formData.locations.length === 0) newErrors.locations = 'Please select at least one location';
    if (!formData.justification.trim()) newErrors.justification = 'Justification is required';
    if (!formData.supervisorInfo.trim()) newErrors.supervisorInfo = "Supervisor's information is required";
    if (!formData.termsAgreed) newErrors.termsAgreed = 'You must agree to the Terms and Conditions';
    if (!formData.confidentialityAgreed) newErrors.confidentialityAgreed = 'You must agree to the Data Confidentiality Agreement';

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-cream p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-light-olive rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="text-forest-green" size={32} />
          </div>
          <h2 className="text-2xl font-playfair font-bold text-forest-green mb-4">
            Location Request Submitted Successfully!
          </h2>
          <p className="text-dark-slate mb-6">
            Your request for access to new locations has been submitted and is under review.
            You will receive a notification once your request has been processed.
          </p>
          <button 
            onClick={() => setIsSubmitted(false)}
            className="bg-forest-green text-cream px-6 py-2 rounded-lg hover:bg-forest-green/90 transition-colors"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-playfair font-bold text-forest-green mb-4 flex items-center justify-center">
            <MapPin className="mr-3" size={28} />
            Request New Location Access
          </h1>
          <p className="text-dark-slate">
            Fill out this form to request access to additional monitoring locations.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-dark-slate mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent outline-none ${
                formErrors.fullName ? 'border-red-500' : 'border-light-olive'
              }`}
            />
            {formErrors.fullName && (
              <p className="mt-1 text-red-500 text-sm">{formErrors.fullName}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-dark-slate mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent outline-none ${
                formErrors.email ? 'border-red-500' : 'border-light-olive'
              }`}
            />
            {formErrors.email && (
              <p className="mt-1 text-red-500 text-sm">{formErrors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-dark-slate mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent outline-none ${
                formErrors.phoneNumber ? 'border-red-500' : 'border-light-olive'
              }`}
            />
            {formErrors.phoneNumber && (
              <p className="mt-1 text-red-500 text-sm">{formErrors.phoneNumber}</p>
            )}
          </div>

          <div>
            <label htmlFor="department" className="block text-sm font-medium text-dark-slate mb-1">
              Department/Organization Name
            </label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent outline-none ${
                formErrors.department ? 'border-red-500' : 'border-light-olive'
              }`}
            />
            {formErrors.department && (
              <p className="mt-1 text-red-500 text-sm">{formErrors.department}</p>
            )}
          </div>

          <div>
            <label htmlFor="designation" className="block text-sm font-medium text-dark-slate mb-1">
              Designation/Job Title
            </label>
            <input
              type="text"
              id="designation"
              name="designation"
              value={formData.designation}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent outline-none ${
                formErrors.designation ? 'border-red-500' : 'border-light-olive'
              }`}
            />
            {formErrors.designation && (
              <p className="mt-1 text-red-500 text-sm">{formErrors.designation}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-slate mb-2">
              New Location(s) Requested
            </label>
            <div className="grid grid-cols-2 gap-2">
              {availableLocations.map(location => (
                <div key={location} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`location-${location}`}
                    value={location}
                    checked={formData.locations.includes(location)}
                    onChange={handleLocationChange}
                    className="mr-2 h-4 w-4 text-forest-green focus:ring-forest-green border-light-olive rounded"
                  />
                  <label htmlFor={`location-${location}`} className="text-dark-slate">
                    {location}
                  </label>
                </div>
              ))}
            </div>
            {formErrors.locations && (
              <p className="mt-1 text-red-500 text-sm">{formErrors.locations}</p>
            )}
          </div>

          <div>
            <label htmlFor="justification" className="block text-sm font-medium text-dark-slate mb-1">
              Justification for Access Request
            </label>
            <textarea
              id="justification"
              name="justification"
              value={formData.justification}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent outline-none ${
                formErrors.justification ? 'border-red-500' : 'border-light-olive'
              }`}
            />
            {formErrors.justification && (
              <p className="mt-1 text-red-500 text-sm">{formErrors.justification}</p>
            )}
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-dark-slate mb-1">
              Expected Duration of Access
            </label>
            <select
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-light-olive rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent outline-none"
            >
              <option value="temporary">Temporary</option>
              <option value="permanent">Permanent</option>
            </select>
          </div>

          <div>
            <label htmlFor="supervisorInfo" className="block text-sm font-medium text-dark-slate mb-1">
              Supervisor's Approval (Contact Information)
            </label>
            <input
              type="text"
              id="supervisorInfo"
              name="supervisorInfo"
              value={formData.supervisorInfo}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent outline-none ${
                formErrors.supervisorInfo ? 'border-red-500' : 'border-light-olive'
              }`}
              placeholder="Supervisor's name and contact details"
            />
            {formErrors.supervisorInfo && (
              <p className="mt-1 text-red-500 text-sm">{formErrors.supervisorInfo}</p>
            )}
          </div>

          <div>
            <label htmlFor="additionalComments" className="block text-sm font-medium text-dark-slate mb-1">
              Additional Comments (Optional)
            </label>
            <textarea
              id="additionalComments"
              name="additionalComments"
              value={formData.additionalComments}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2 border border-light-olive rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent outline-none"
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-light-olive">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="termsAgreed"
                  name="termsAgreed"
                  type="checkbox"
                  checked={formData.termsAgreed}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-forest-green focus:ring-forest-green border-light-olive rounded"
                />
              </div>
              <div className="ml-3">
                <label htmlFor="termsAgreed" className="text-sm text-dark-slate">
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="text-forest-green hover:underline"
                  >
                    Terms and Conditions
                  </button>
                </label>
                {formErrors.termsAgreed && (
                  <p className="mt-1 text-red-500 text-sm">{formErrors.termsAgreed}</p>
                )}
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="confidentialityAgreed"
                  name="confidentialityAgreed"
                  type="checkbox"
                  checked={formData.confidentialityAgreed}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-forest-green focus:ring-forest-green border-light-olive rounded"
                />
              </div>
              <div className="ml-3">
                <label htmlFor="confidentialityAgreed" className="text-sm text-dark-slate">
                  I acknowledge the{' '}
                  <button
                    type="button"
                    onClick={() => setShowConfidentialityModal(true)}
                    className="text-forest-green hover:underline"
                  >
                    Data Confidentiality Agreement
                  </button>
                </label>
                {formErrors.confidentialityAgreed && (
                  <p className="mt-1 text-red-500 text-sm">{formErrors.confidentialityAgreed}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-forest-green text-cream px-6 py-2 rounded-lg hover:bg-forest-green/90 transition-colors disabled:bg-forest-green/50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting ? (
                <span>Submitting...</span>
              ) : (
                <>
                  <span>Submit Request</span>
                  <Check size={18} className="ml-2" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Terms and Conditions Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowTermsModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl p-6 max-w-2xl max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setShowTermsModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-playfair font-bold text-forest-green mb-4">Terms and Conditions</h2>
            <div className="space-y-4">
              <p>
                By requesting access to additional locations, you agree to:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Use the access only for official purposes</li>
                <li>Maintain confidentiality of all accessed information</li>
                <li>Report any suspicious activities or security concerns</li>
                <li>Follow all relevant government data protection regulations</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Confidentiality Agreement Modal */}
      {showConfidentialityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowConfidentialityModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl p-6 max-w-2xl max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setShowConfidentialityModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-playfair font-bold text-forest-green mb-4">Data Confidentiality Agreement</h2>
            <div className="space-y-4">
              <p>
                This agreement outlines your responsibilities regarding data access and confidentiality:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>All accessed data must be kept strictly confidential</li>
                <li>No data sharing with unauthorized personnel</li>
                <li>Implement appropriate security measures to protect accessed data</li>
                <li>Report any data breaches or security incidents immediately</li>
                <li>Maintain detailed logs of data access and usage</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationRequest;