import { LuUsers, LuArrowRight, LuCheck } from "react-icons/lu";
import { Link } from "react-router-dom";
import DashboardPreview from '../../assets/DashboardPreview.jpeg';

export default function HomePage() {
  const features = [
    "Real-time collaboration tools",
    "Project management dashboard",
    "Team communication hub",
    "File sharing & storage"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10">
            <div className="flex items-center space-x-4 justify-center lg:justify-start">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl flex items-center justify-center shadow-lg transform transition-transform hover:scale-110">
                <LuUsers className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                Team<span className="text-blue-600">Hub</span>
              </h1>
            </div>

            <div>
              <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
                Collaborate Seamlessly<br />
                <span className="text-blue-600">With Your Team</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-700 max-w-xl mx-auto lg:mx-0">
                Organize projects, share ideas, and communicate effortlessly all in one 
                powerful platform. Experience the future of team collaboration.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto lg:mx-0">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="flex items-center space-x-3 bg-blue-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <LuCheck className="w-6 h-6 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-800 font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 pt-6 justify-center lg:justify-start">
              <Link 
                to={"/dashboard"}
                className="px-10 py-4 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-3 font-semibold"
              >
                <span>Get Started Now</span>
                <LuArrowRight className="w-6 h-6" />
              </Link>
              <Link 
                to={"/about"}
                className="px-10 py-4 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-colors font-semibold text-center"
              >
                Learn More
              </Link>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-blue-100 rounded-3xl transform rotate-6 shadow-lg"></div>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={DashboardPreview} 
                alt="Dashboard Preview" 
                className="w-full h-auto object-cover hover:scale-102 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}