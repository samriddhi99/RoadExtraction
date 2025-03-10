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
                  Data Collection
                </h3>
                <p className="text-dark-slate">
                  We collect high-resolution satellite imagery and aerial photography of road networks 
                  on a regular basis. This data is supplemented with ground-level imagery from 
                  authorized vehicles and public reports.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-light-olive p-3 rounded-full mr-4 mt-1">
                <span className="text-forest-green font-bold">2</span>
              </div>
              <div>
                <h3 className="text-xl font-playfair font-semibold text-forest-green mb-2">
                  AI-Powered Analysis
                </h3>
                <p className="text-dark-slate">
                  Our advanced AI algorithms analyze the collected imagery to identify changes, 
                  detect damages, recognize unauthorized constructions, and assess the overall 
                  condition of road infrastructure.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-light-olive p-3 rounded-full mr-4 mt-1">
                <span className="text-forest-green font-bold">3</span>
              </div>
              <div>
                <h3 className="text-xl font-playfair font-semibold text-forest-green mb-2">
                  Real-Time Alerts
                </h3>
                <p className="text-dark-slate">
                  The system generates real-time alerts for critical issues that require immediate 
                  attention, such as major road damages, flooding, or unauthorized activities that 
                  pose safety risks.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-light-olive p-3 rounded-full mr-4 mt-1">
                <span className="text-forest-green font-bold">4</span>
              </div>
              <div>
                <h3 className="text-xl font-playfair font-semibold text-forest-green mb-2">
                  Secure Access for Officials
                </h3>
                <p className="text-dark-slate">
                  Government officials and authorized personnel can access the platform through a 
                  secure login system. Different access levels ensure that users only see the 
                  information relevant to their roles and responsibilities.
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
              <h3 className="text-xl font-playfair font-semibold text-forest-green">Efficient Monitoring</h3>
            </div>
            <p className="text-dark-slate">
              Our platform saves time and resources by automating the monitoring process, 
              reducing the need for manual inspections and image analysis.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-light-olive p-3 rounded-full mr-4">
                <Shield className="text-forest-green" size={24} />
              </div>
              <h3 className="text-xl font-playfair font-semibold text-forest-green">Improved Emergency Navigation</h3>
            </div>
            <p className="text-dark-slate">
              Real-time road condition data helps emergency services navigate more efficiently, 
              avoiding damaged roads and finding the fastest routes to their destinations.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-light-olive p-3 rounded-full mr-4">
                <BarChart className="text-forest-green" size={24} />
              </div>
              <h3 className="text-xl font-playfair font-semibold text-forest-green">Simplified Data Access</h3>
            </div>
            <p className="text-dark-slate">
              Our intuitive interface makes it easy for officials to access and interpret complex 
              data, with customizable dashboards and reporting tools.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-light-olive p-3 rounded-full mr-4">
                <Layers className="text-forest-green" size={24} />
              </div>
              <h3 className="text-xl font-playfair font-semibold text-forest-green">Scalability & Compatibility</h3>
            </div>
            <p className="text-dark-slate">
              The platform is designed to work across different hardware and software environments, 
              ensuring compatibility with existing government systems.
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