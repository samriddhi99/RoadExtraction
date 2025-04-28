import React from 'react';
import { BarChart, Clock, Shield, Layers } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-forest-green mb-4">
            About Our Platform
          </h1>
          <p className="text-dark-slate text-lg max-w-3xl mx-auto">
            Our system enhances road monitoring by providing real-time insights into infrastructure 
            changes using satellite imagery and artificial intelligence.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 mb-12">
          <h2 className="text-3xl font-playfair font-bold text-forest-green mb-6">
            How Our Platform Works
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-light-olive p-3 rounded-full mr-4 mt-1">
                <span className="text-forest-green font-bold">1</span>
              </div>
              <div>
                <h3 className="text-xl font-playfair font-semibold text-forest-green mb-2">
                Deep Learning-Powered Analysis
                </h3>
                <p className="text-dark-slate">
                Identifies and maps changes in roads and infrastructure using temporal satellite imagery.
                .
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-light-olive p-3 rounded-full mr-4 mt-1">
                <span className="text-forest-green font-bold">2</span>
              </div>
              <div>
                <h3 className="text-xl font-playfair font-semibold text-forest-green mb-2">
                Support for Urban Planning and Research
                </h3>
                <p className="text-dark-slate">
                Helps urban planners, government agencies, and researchers monitor land use and manage infrastructure efficiently.

                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-light-olive p-3 rounded-full mr-4 mt-1">
                <span className="text-forest-green font-bold">3</span>
              </div>
              <div>
                <h3 className="text-xl font-playfair font-semibold text-forest-green mb-2">
                Change Detection Over Time
                </h3>
                <p className="text-dark-slate">
                Compares satellite images from different periods to highlight developments like new road construction.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-light-olive p-3 rounded-full mr-4 mt-1">
                <span className="text-forest-green font-bold">4</span>
              </div>
              <div>
                <h3 className="text-xl font-playfair font-semibold text-forest-green mb-2">
                Real-Time Alerts and Notifications
                </h3>
                <p className="text-dark-slate">
                Provides automatic alerts to users about detected changes, enabling timely and evidence-based decision-making.
                </p>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-playfair font-bold text-forest-green mb-8 text-center">
          Key Features
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-light-olive p-3 rounded-full mr-4">
                <Clock className="text-forest-green" size={24} />
              </div>
              <h3 className="text-xl font-playfair font-semibold text-forest-green">Automated Change Detection</h3>
            </div>
            <p className="text-dark-slate">
            Uses deep learning models to automatically detect changes in roads, infrastructure, and land use from satellite images.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-light-olive p-3 rounded-full mr-4">
                <Shield className="text-forest-green" size={24} />
              </div>
              <h3 className="text-xl font-playfair font-semibold text-forest-green">Temporal Image Comparison</h3>
            </div>
            <p className="text-dark-slate">
            Analyzes satellite images taken at different time intervals to identify and highlight new developments or modifications.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-light-olive p-3 rounded-full mr-4">
                <BarChart className="text-forest-green" size={24} />
              </div>
              <h3 className="text-xl font-playfair font-semibold text-forest-green">Real-Time Alerts</h3>
            </div>
            <p className="text-dark-slate">
            Sends timely notifications to users when significant changes are detected, supporting rapid response and planning.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-light-olive p-3 rounded-full mr-4">
                <Layers className="text-forest-green" size={24} />
              </div>
              <h3 className="text-xl font-playfair font-semibold text-forest-green">User-Friendly Visualization</h3>
            </div>
            <p className="text-dark-slate">
            Displays detected changes clearly on an interactive map for easy interpretation and decision-making.
            </p>
          </div>
        </div>

        <div className="bg-forest-green text-cream rounded-xl p-8 text-center">
          <h2 className="text-3xl font-playfair font-bold mb-4">Our Mission</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            We are committed to improving road infrastructure management through technology, 
            making roads safer, more efficient, and better maintained for all citizens.
          </p>
          <a 
            href="/contact" 
            className="inline-block bg-light-olive text-forest-green font-semibold py-3 px-6 rounded-lg hover:bg-light-olive/90 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;