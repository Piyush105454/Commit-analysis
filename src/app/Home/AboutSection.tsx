export default function AboutSection() {
  return (
    <section id="about-section" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
      
         
          
          {/* Content */}
          <div className="lg:col-span-4 lg:order-2">
            <div className="mb-6">
            
              <h2 className="heading">About Us</h2>
            </div>
            
            <div className="mb-8 space-y-4">
              <p className="text-gray-600 leading-relaxed">
                 Reach1k helps creators, brands, and individuals analyze their social media profiles with powerful insights. Our mission is simple track, understand, and grow your reach smarter.              </p>

            </div>
            
           
            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="counter text-4xl font-bold text-blue-600 mb-2">
                  1<span className="text-2xl">M</span>
                </div>
                <div className="text-sm text-gray-600 uppercase tracking-wider font-semibold">
                  Members
                </div>
              </div>
              <div className="text-center">
               
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}