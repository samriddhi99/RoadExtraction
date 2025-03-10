import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, AlertCircle } from 'lucide-react';

interface FormData {
  // Step 1: Basic User Details
  fullName: string;
  email: string;
  phoneNumber: string;
  
  // Step 2: Professional Information
  governmentId: File | null;
  designation: string;
  department: string;
  username: string;
  password: string;
  confirmPassword: string;
  
  // Step 3: Access Requirements
  regions: string[];
  accessReason: string;
  supervisorContact: string;
  authorizationLetter: File | null;
  
  // Agreements
  termsAgreed: boolean;
  confidentialityAgreed: boolean;
}

const initialFormData: FormData = {
  fullName: '',
  email: '',
  phoneNumber: '',
  governmentId: null,
  designation: '',
  department: '',
  username: '',
  password: '',
  confirmPassword: '',
  regions: [],
  accessReason: '',
  supervisorContact: '',
  authorizationLetter: null,
  termsAgreed: false,
  confidentialityAgreed: false
};

const availableRegions = [
  'North Region',
  'South Region',
  'East Region',
  'West Region',
  'Central Region',
  'Metropolitan Area'
];

const Signup: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showConfidentialityModal, setShowConfidentialityModal] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
      
      // Clear error for this field if it exists
      if (formErrors[name]) {
        setFormErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      regions: checked
        ? [...prev.regions, value]
        : prev.regions.filter(region => region !== value)
    }));
    
    // Clear error for regions if it exists
    if (formErrors.regions) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.regions;
        return newErrors;
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
      if (!formData.phoneNumber.trim()) {
        newErrors.phoneNumber = 'Phone number is required';
      } else if (!/^\d{10,15}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
        newErrors.phoneNumber = 'Phone number is invalid';
      }
    } else if (step === 2) {
      if (!formData.governmentId) newErrors.governmentId = 'Government ID is required';
      if (!formData.designation.trim()) newErrors.designation = 'Designation is required';
      if (!formData.department.trim()) newErrors.department = 'Department is required';
      if (!formData.username.trim()) {
        newErrors.username = 'Username is required';
      } else if (formData.username.length < 5) {
        newErrors.username = 'Username must be at least 5 characters';
      }
      if (!formData.password.trim()) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    } else if (step === 3) {
      if (formData.regions.length === 0) newErrors.regions = 'Please select at least one region';
      if (!formData.accessReason.trim()) newErrors.accessReason = 'Reason for access is required';
    }
    
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.termsAgreed) {
      setFormErrors(prev => ({ ...prev, termsAgreed: 'You must agree to the Terms and Conditions' }));
      return;
    }
    
    if (!formData.confidentialityAgreed) {
      setFormErrors(prev => ({ ...prev, confidentialityAgreed: 'You must agree to the Data Confidentiality Agreement' }));
      return;
    }
    
    if (validateStep(3)) {
      setIsSubmitting(true);
      
      // Simulate form submission
      setTimeout(() => {
        console.log('Form submitted:', formData);
        setIsSubmitting(false);
        setIsSubmitted(true);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-playfair font-bold text-forest-green mb-4">
            Sign Up
          </h1>
          <p className="text-dark-slate text-lg max-w-3xl mx-auto">
            Create an account to access our Real-Time Road Monitoring System.
          </p>
        </div>

        {isSubmitted ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-light-olive rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="text-forest-green" size={32} />
            </div>
            <h2 className="text-2xl font-playfair font-bold text-forest-green mb-4">
              Registration Submitted Successfully!
            </h2>
            <p className="text-dark-slate mb-6">
              Thank you for registering with our Road Monitoring System. Your application is now under review.
              You will receive an email notification once your account is approved.
            </p>
            <a 
              href="/" 
              className="inline-block bg-forest-green text-cream font-semibold py-3 px-6 rounded-lg hover:bg-forest-green/90 transition-colors"
            >
              Return to Home
            </a>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Progress Steps */}
            <div className="bg-forest-green p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= 1 ? 'bg-light-olive text-forest-green' : 'bg-forest-green/50 text-cream'
                  }`}>
                    {currentStep > 1 ? <Check size={16} /> : 1}
                  </div>
                  <div className={`h-1 w-12 mx-1 ${
                    currentStep > 1 ? 'bg-light-olive' : 'bg-forest-green/30'
                  }`} />
                </div>
                
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= 2 ? 'bg-light-olive text-forest-green' : 'bg-forest-green/50 text-cream'
                  }`}>
                    {currentStep > 2 ? <Check size={16} /> : 2}
                  </div>
                  <div className={`h-1 w-12 mx-1 ${
                    currentStep > 2 ? 'bg-light-olive' : 'bg-forest-green/30'
                  }`} />
                </div>
                
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= 3 ? 'bg-light-olive text-forest-green' : 'bg-forest-green/50 text-cream'
                  }`}>
                    3
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between text-cream text-sm mt-2">
                <span>Basic Details</span>
                <span>Professional Info</span>
                <span>Access Requirements</span>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              {/* Step 1: Basic User Details */}
              <div className={`transition-opacity duration-300 ${currentStep === 1 ? 'block opacity-100' : 'hidden opacity-0'}`}>
                <h2 className="text-2xl font-playfair font-bold text-forest-green mb-6">
                  Basic User Details
                </h2>
                
                <div className="space-y-4">
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
                      placeholder="Enter your full name"
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
                      placeholder="your.email@example.com"
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
                      placeholder="Enter your phone number"
                    />
                    {formErrors.phoneNumber && (
                      <p className="mt-1 text-red-500 text-sm">{formErrors.phoneNumber}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Step 2: Professional Information */}
              <div className={`transition-opacity duration-300 ${currentStep === 2 ? 'block opacity-100' : 'hidden opacity-0'}`}>
                <h2 className="text-2xl font-playfair font-bold text-forest-green mb-6">
                  Professional Information
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="governmentId" className="block text-sm font-medium text-dark-slate mb-1">
                      Government ID (File Upload)
                    </label>
                    <input
                      type="file"
                      id="governmentId"
                      name="governmentId"
                      onChange={handleFileChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent outline-none ${
                        formErrors.governmentId ? 'border-red-500' : 'border-light-olive'
                      }`}
                      accept="image/*,.pdf"
                    />
                    {formErrors.governmentId && (
                      <p className="mt-1 text-red-500 text-sm">{formErrors.governmentId}</p>
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
                      placeholder="Enter your job title"
                    />
                    {formErrors.designation && (
                      <p className="mt-1 text-red-500 text-sm">{formErrors.designation}</p>
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
                      placeholder="Enter your department or organization"
                    />
                    {formErrors.department && (
                      <p className="mt-1 text-red-500 text-sm">{formErrors.department}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-dark-slate mb-1">
                      Preferred Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent outline-none ${
                        formErrors.username ? 'border-red-500' : 'border-light-olive'
                      }`}
                      placeholder="Choose a username"
                    />
                    {formErrors.username && (
                      <p className="mt-1 text-red-500 text-sm">{formErrors.username}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-dark-slate mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent outline-none ${
                        formErrors.password ? 'border-red-500' : 'border-light-olive'
                      }`}
                      placeholder="Create a password"
                    />
                    {formErrors.password && (
                      <p className="mt-1 text-red-500 text-sm">{formErrors.password}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-dark-slate mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent outline-none ${
                        formErrors.confirmPassword ? 'border-red-500' : 'border-light-olive'
                      }`}
                      placeholder="Confirm your password"
                    />
                    {formErrors.confirmPassword && (
                      <p className="mt-1 text-red-500 text-sm">{formErrors.confirmPassword}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Step 3: Access Requirements */}
              <div className={`transition-opacity duration-300 ${currentStep === 3 ? 'block opacity-100' : 'hidden opacity-0'}`}>
                <h2 className="text-2xl font-playfair font-bold text-forest-green mb-6">
                  Access Requirements
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-slate mb-2">
                      Region(s) you want to access
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {availableRegions.map(region => (
                        <div key={region} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`region-${region}`}
                            value={region}
                            checked={formData.regions.includes(region)}
                            onChange={handleRegionChange}
                            className="mr-2 h-4 w-4 text-forest-green focus:ring-forest-green border-light-olive rounded"
                          />
                          <label htmlFor={`region-${region}`} className="text-dark-slate">
                            {region}
                          </label>
                        </div>
                      ))}
                    </div>
                    {formErrors.regions && (
                      <p className="mt-1 text-red-500 text-sm">{formErrors.regions}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="accessReason" className="block text-sm font-medium text-dark-slate mb-1">
                      Reason for access request
                    </label>
                    <textarea
                      id="accessReason"
                      name="accessReason"
                      value={formData.accessReason}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent outline-none ${
                        formErrors.accessReason ? 'border-red-500' : 'border-light-olive'
                      }`}
                      placeholder="Explain why you need access to the system"
                    />
                    {formErrors.accessReason && (
                      <p className="mt-1 text-red-500 text-sm">{formErrors.accessReason}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="supervisorContact" className="block text-sm font-medium text-dark-slate mb-1">
                      Supervisor's Contact (Optional)
                    </label>
                    <input
                      type="text"
                      id="supervisorContact"
                      name="supervisorContact"
                      value={formData.supervisorContact}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-light-olive rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent outline-none"
                      placeholder="Enter your supervisor's contact information"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="authorizationLetter" className="block text-sm font-medium text-dark-slate mb-1">
                      Upload Official Authorization Letter (If required)
                    </label>
                    <input
                      type="file"
                      id="authorizationLetter"
                      name="authorizationLetter"
                      onChange={handleFileChange}
                      className="w-full px-4 py-2 border border-light-olive rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent outline-none"
                      accept=".pdf,.doc,.docx"
                    />
                  </div>
                  
                  <div className="pt-4 border-t border-light-olive/50">
                    <div className="flex items-start mb-4">
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
                            className="text-forest-green hover:underline font-medium"
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
                            className="text-forest-green hover:underline font-medium"
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
                </div>
              </div>
              
              {/* Navigation Buttons */}
              <div className="mt-8 flex justify-between">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center px-6 py-2 bg-gray-200 text-dark-slate rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    <ChevronLeft size={18} className="mr-1" />
                    <span>Previous</span>
                  </button>
                ) : (
                  <div></div> // Empty div to maintain flex spacing
                )}
                
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center px-6 py-2 bg-forest-green text-cream rounded-lg hover:bg-forest-green/90 transition-colors"
                  >
                    <span>Next</span>
                    <ChevronRight size={18} className="ml-1" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center px-6 py-2 bg-forest-green text-cream rounded-lg hover:bg-forest-green/90 transition-colors disabled:bg-forest-green/50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span>Submitting...</span>
                    ) : (
                      <>
                        <span>Submit</span>
                        <Check size={18} className="ml-1" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
        
        {/* Terms and Conditions Modal */}
        {showTermsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay">
            <div className="absolute inset-0 bg-dark-slate/50" onClick={() => setShowTermsModal(false)}></div>
            
            <div className="relative bg-cream rounded-lg shadow-xl w-full max-w-2xl p-6 modal-content max-h-[80vh] overflow-y-auto">
              <button 
                onClick={() => setShowTermsModal(false)}
                className="absolute top-4 right-4 text-dark-slate hover:text-forest-green transition-colors"
              >
                <X size={24} />
              </button>
              
              <h2 className="text-2xl font-playfair font-bold text-forest-green mb-6">
                Terms and Conditions
              </h2>
              
              <div className="space-y-4 text-dark-slate">
                <div className="flex items-start">
                  <AlertCircle className="text-forest-green mt-1 mr-2 flex-shrink-0" size={20} />
                  <p><strong>Authorized Access Only:</strong> This platform is exclusively for authorized government officials. Any unauthorized access is strictly prohibited and may result in legal action.</p>
                </div>
                
                <div className="flex items-start">
                  <AlertCircle className="text-forest-green mt-1 mr-2 flex-shrink-0" size={20} />
                  <p><strong>Accurate Information:</strong> Users must provide accurate and truthful information during registration. Providing false information may result in account suspension and potential legal consequences.</p>
                </div>
                
                <div className="flex items-start">
                  <AlertCircle className="text-forest-green mt-1 mr-2 flex-shrink-0" size={20} />
                  <p><strong>Data Usage:</strong> All data accessed through this platform is for official government use only. Unauthorized distribution or sharing of data is strictly prohibited.</p>
                </div>
                
                <div className="flex items-start">
                  <AlertCircle className="text-forest-green mt-1 mr-2 flex-shrink-0" size={20} />
                  <p><strong>Account Security:</strong> Users are responsible for maintaining the security of their account credentials. Any suspected unauthorized access should be reported immediately.</p>
                </div>
                
                <div className="flex items-start">
                  <AlertCircle className="text-forest-green mt-1 mr-2 flex-shrink-0" size={20} />
                  <p><strong>Compliance with Laws:</strong> Users must comply with all applicable laws and regulations when using this platform and the data accessed through it.</p>
                </div>
                
                <div className="flex items-start">
                  <AlertCircle className="text-forest-green mt-1 mr-2 flex-shrink-0" size={20} />
                  <p><strong>Monitoring:</strong> User activities on the platform may be monitored for security and compliance purposes.</p>
                </div>
                
                <div className="flex items-start">
                  <AlertCircle className="text-forest-green mt-1 mr-2 flex-shrink-0" size={20} />
                  <p><strong>Termination:</strong> Accounts may be terminated at any time for violations of these terms or for any other reason deemed necessary by the platform administrators.</p>
                </div>
                
                <div className="flex items-start">
                  <AlertCircle className="text-forest-green mt-1 mr-2 flex-shrink-0" size={20} />
                  <p><strong>Legal Action:</strong> Violations of these terms may result in legal action, including but not limited to civil and criminal proceedings.</p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="bg-forest-green text-cream px-6 py-2 rounded-lg hover:bg-forest-green/90 transition-colors"
                >
                  I Understand
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Data Confidentiality Agreement Modal */}
        {showConfidentialityModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay">
            <div className="absolute inset-0 bg-dark-slate/50" onClick={() => setShowConfidentialityModal(false)}></div>
            
            <div className="relative bg-cream rounded-lg shadow-xl w-full max-w-2xl p-6 modal-content max-h-[80vh] overflow-y-auto">
              <button 
                onClick={() => setShowConfidentialityModal(false)}
                className="absolute top-4 right-4 text-dark-slate hover:text-forest-green transition-colors"
              >
                <X size={24} />
              </button>
              
              <h2 className="text-2xl font-playfair font-bold text-forest-green mb-6">
                Data Confidentiality Agreement
              </h2>
              
              <div className="space-y-4 text-dark-slate">
                <div className="flex items-start">
                  <AlertCircle className="text-forest-green mt-1 mr-2 flex-shrink-0" size={20} />
                  <p><strong>Confidentiality Obligation:</strong> Users must maintain the confidentiality of all data accessed through the platform and must not share it with unauthorized parties.</p>
                </div>
                
                <div className="flex items-start">
                  <AlertCircle className="text-forest-green mt-1 mr-2 flex-shrink-0" size={20} />
                  <p><strong>Data Protection:</strong> Users must take appropriate measures to protect the data from unauthorized access, use, or disclosure.</p>
                </div>
                
                <div className="flex items-start">
                  <AlertCircle className="text-forest-green mt-1 mr-2 flex-shrink-0" size={20} />
                  <p><strong>Restricted Use:</strong> Data accessed through the platform may only be used for official government purposes. Unauthorized downloading, modifying, or distributing the data is prohibited.</p>
                </div>
                
                <div className="flex items-start">
                  <AlertCircle className="text-forest-green mt-1 mr-2 flex-shrink-0" size={20} />
                  <p><strong>Legal Compliance:</strong> Users must comply with all applicable data protection and privacy laws and regulations.</p>
                </div>
                
                <div className="flex items-start">
                  <AlertCircle className="text-forest-green mt-1 mr-2 flex-shrink-0" size={20} />
                  <p><strong>Breach Notification:</strong> Users must immediately report any actual or suspected breach of data confidentiality to the platform administrators.</p>
                </div>
                
                <div className="flex items-start">
                  <AlertCircle className="text-forest-green mt-1 mr-2 flex-shrink-0" size={20} />
                  <p><strong>Breach Consequences:</strong> Violations of this agreement may result in account termination, legal action, and other appropriate remedies.</p>
                </div>
                
                <div className="flex items-start">
                  <AlertCircle className="text-forest-green mt-1 mr-2 flex-shrink-0" size={20} />
                  <p><strong>Survival:</strong> The obligations under this agreement survive the termination of the user's account or access to the platform.</p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowConfidentialityModal(false)}
                  className="bg-forest-green text-cream px-6 py-2 rounded-lg hover:bg-forest-green/90 transition-colors"
                >
                  I Understand
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;