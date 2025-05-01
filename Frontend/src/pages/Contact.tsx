import React, { useState } from 'react';
import { Mail, Phone, MessageSquare, Send } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send the form data to a server here
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        phone: '',
        email: '',
        message: ''
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-forest-green mb-4">
            Contact Us
          </h1>
          <p className="text-dark-slate text-lg max-w-3xl mx-auto">
            Have questions or need assistance? Reach out to our team and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-playfair font-bold text-forest-green mb-6">
              Send Us a Message
            </h2>
            
            {isSubmitted ? (
              <div className="bg-light-olive/20 border border-light-olive text-forest-green p-4 rounded-lg mb-6">
                <p className="font-medium">Thank you for your message!</p>
                <p>Your inquiry has been submitted successfully. We'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-dark-slate mb-1">
                    Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="text-forest-green" size={18} />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-2 border border-light-olive rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent outline-none"
                      placeholder="Your full name"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-dark-slate mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="text-forest-green" size={18} />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-2 border border-light-olive rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent outline-none"
                      placeholder="Your phone number"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-dark-slate mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="text-forest-green" size={18} />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-2 border border-light-olive rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent outline-none"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-dark-slate mb-1">
                    Concern/Message
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <MessageSquare className="text-forest-green" size={18} />
                    </div>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full pl-10 pr-4 py-2 border border-light-olive rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent outline-none"
                      placeholder="Your message or concern..."
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-forest-green hover:bg-forest-green/90 text-cream py-3 rounded-lg transition-colors flex items-center justify-center"
                >
                  <Send size={18} className="mr-2" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
          
          <div>
            <div className="bg-forest-green text-cream rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-playfair font-bold mb-6">
                Contact Information
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Mail className="mr-3 mt-1" size={20} />
                  <div>
                    <p className="font-medium">Email</p>
                    <p>support@roadmonitor.gov</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="mr-3 mt-1" size={20} />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p>+1 (555) 123-4567</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-playfair font-bold text-forest-green mb-6">
                Frequently Asked Questions
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-forest-green mb-2">
                    How quickly will I get access after signing up?
                  </h3>
                  <p className="text-dark-slate">
                    Once your government credentials are verified, access is typically granted within 24-48 hours.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-forest-green mb-2">
                    Can I request monitoring for specific areas?
                  </h3>
                  <p className="text-dark-slate">
                    Yes, authorized officials can request priority monitoring for specific regions or road segments.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-forest-green mb-2">
                    How often is the road data updated?
                  </h3>
                  <p className="text-dark-slate">
                    Major roads are updated daily, while secondary roads are updated weekly. Emergency updates can be processed within hours.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;