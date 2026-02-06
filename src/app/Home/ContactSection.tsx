
'use client'
import { useState, useEffect} from 'react'

import type { ChangeEvent, FormEvent } from 'react'

export default function ContactSection() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  })
  const [isExpanded, setIsExpanded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [activeField, setActiveField] = useState('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const section = document.getElementById('contact-section')
    if (section) observer.observe(section)

    return () => observer.disconnect()
  }, [])

  // ✅ Add proper types
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

  const contactMethods = [
    {
      icon: '📧',
      title: 'Email Us',
      description: 'Send us an email anytime',
      value: 'piyushmodi812@gmail.com',
      color: 'from-blue-500 to-blue-600',
      delay: '0ms'
    },
    {
      icon: '📍',
      title: 'Visit Us',
      description: 'Come say hello at our office',
      value: 'Bhopal RGPV College',
      color: 'from-green-500 to-green-600',
      delay: '200ms'
    },
    {
      icon: '💬',
      title: 'Live Chat',
      description: 'Chat with our team',
      value: 'Start conversation',
      color: 'from-purple-500 to-purple-600',
      delay: '400ms'
    }
  ]

  return (
    <section id="contact-section" className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* ... ✅ Your JSX code stays same ... */}
            {/* Background Animation */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Animated Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 animate-pulse">
            <span className="text-2xl">✉️</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Let&#39;s Start a{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Conversation
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ready to transform your social media presence? We&#39;d love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left Side - Contact Methods with Rolling Animation */}
          <div className="lg:col-span-5">
            <div className={`space-y-6 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}>
              {contactMethods.map((method, index) => (
                <div
                  key={index}
                  className={`group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 hover:scale-105`}
                  style={{ animationDelay: method.delay }}
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {/* Rolling Background Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${method.color} transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out`}></div>
                  
                  <div className="relative p-6 z-10">
                    <div className="flex items-center">
                      <div className="text-4xl mr-4 group-hover:animate-bounce">
                        {method.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-white transition-colors duration-300">
                          {method.title}
                        </h3>
                        <p className="text-gray-600 group-hover:text-gray-100 transition-colors duration-300">
                          {method.description}
                        </p>
                        <p className="text-sm font-medium text-blue-600 group-hover:text-white transition-colors duration-300 mt-1">
                          {method.value}
                        </p>
                      </div>
                      <div className="text-gray-400 group-hover:text-white transition-all duration-300 transform group-hover:translate-x-2">
                        →
                      </div>
                    </div>
                  </div>

                  {/* Expanding Details */}
                  <div className={`overflow-hidden transition-all duration-500 ${
                    isExpanded && index === 0 ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="px-6 pb-6 border-t border-gray-100">
                      <div className="pt-4">
                        <p className="text-sm text-gray-600">
                          Click here to {method.title.toLowerCase()} directly. We typically respond within 24 hours.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className={`mt-8 space-y-4 transition-all duration-1000 delay-600 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <a href="/auth/register" className="group relative w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden block text-center">
                <span className="relative z-10 flex items-center justify-center">
                  <span className="mr-2">🚀</span>
                  Get Started Free
                  <span className="ml-2 group-hover:translate-x-2 transition-transform duration-300">→</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </a>
              
              <a href="/auth/login" className="group relative w-full bg-white border-2 border-blue-500 text-blue-600 py-3 px-8 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden block text-center">
                <span className="relative z-10 flex items-center justify-center">
                  <span className="mr-2">👤</span>
                  Already have an account?
                  <span className="ml-2 group-hover:translate-x-2 transition-transform duration-300">→</span>
                </span>
                <div className="absolute inset-0 bg-blue-50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </a>
            </div>
          </div>

          {/* Right Side - Animated Contact Form */}
          <div className="lg:col-span-7">
            <div className={`bg-white rounded-3xl shadow-2xl p-8 transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="group">
                    <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                      First name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        onFocus={() => setActiveField('firstName')}
                        onBlur={() => setActiveField('')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 transform focus:scale-105"
                        required
                      />
                      <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ${
                        activeField === 'firstName' ? 'w-full' : 'w-0'
                      }`}></div>
                    </div>
                  </div>
                  <div className="group">
                    <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                      Last name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        onFocus={() => setActiveField('lastName')}
                        onBlur={() => setActiveField('')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 transform focus:scale-105"
                        required
                      />
                      <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ${
                        activeField === 'lastName' ? 'w-full' : 'w-0'
                      }`}></div>
                    </div>
                  </div>
                </div>
                
                <div className="group">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                    Email address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setActiveField('email')}
                      onBlur={() => setActiveField('')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 transform focus:scale-105"
                      required
                    />
                    <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ${
                      activeField === 'email' ? 'w-full' : 'w-0'
                    }`}></div>
                  </div>
                </div>
                
                <div className="group">
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                    Message
                  </label>
                  <div className="relative">
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setActiveField('message')}
                      onBlur={() => setActiveField('')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 transform focus:scale-105 resize-none"
                      required
                    ></textarea>
                    <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ${
                      activeField === 'message' ? 'w-full' : 'w-0'
                    }`}></div>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="group relative w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 rounded-xl font-semibold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    <span className="mr-2 group-hover:animate-bounce">📤</span>
                    Send Message
                    <span className="ml-2 group-hover:translate-x-2 transition-transform duration-300">→</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  )
}
