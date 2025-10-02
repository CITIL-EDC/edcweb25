export default function AboutSection() {
  const initiatives = [
    {
      title: "Workshops & Mentorship",
      description: "Regular workshops and mentorship sessions with industry experts to help students develop entrepreneurial skills and mindset.",
      icon: "🎯"
    },
    {
      title: "Startup Incubation",
      description: "We provide a nurturing environment for budding entrepreneurs to transform their ideas into successful ventures.",
      icon: "🚀"
    },
    {
      title: "Networking Events",
      description: "Connect with like-minded individuals, investors, and successful entrepreneurs through our exclusive networking events.",
      icon: "🤝"
    },
    {
      title: "Innovation Challenges",
      description: "Participate in hackathons, pitch competitions, and innovation challenges to showcase your entrepreneurial spirit.",
      icon: "💡"
    }
  ];

  return (
    <section id="about" className="min-h-screen py-20 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            About EDC
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            The Entrepreneurship Development Cell at CIT is dedicated to fostering innovation and entrepreneurship among students.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* What We Do */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold mb-4 text-white">What We Do</h3>
            <p className="text-white/70 leading-relaxed mb-4">
              We create a vibrant ecosystem that encourages students to think beyond conventional career paths and explore the world of entrepreneurship. Through various initiatives, we provide the necessary resources, mentorship, and platform for aspiring entrepreneurs.
            </p>
            <p className="text-white/70 leading-relaxed">
              Our mission is to inspire, educate, and empower the next generation of innovators and business leaders who will drive economic growth and social change.
            </p>
          </div>

          {/* How We Do It */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold mb-4 text-white">How We Do It</h3>
            <p className="text-white/70 leading-relaxed mb-4">
              We believe in learning by doing. Our approach combines theoretical knowledge with practical experience through hands-on workshops, real-world projects, and direct interaction with successful entrepreneurs.
            </p>
            <p className="text-white/70 leading-relaxed">
              By creating a supportive community and providing access to industry experts, we ensure that every student has the opportunity to explore their entrepreneurial potential and turn their ideas into reality.
            </p>
          </div>
        </div>

        {/* Our Initiatives */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold text-center mb-12 text-white">Our Initiatives</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {initiatives.map((initiative, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
              >
                <div className="text-4xl mb-4">{initiative.icon}</div>
                <h4 className="text-xl font-semibold mb-3 text-white">{initiative.title}</h4>
                <p className="text-white/70 text-sm leading-relaxed">{initiative.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="inline-block bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold mb-4 text-white">Ready to Start Your Journey?</h3>
            <p className="text-white/70 mb-6">Join our community of innovators and entrepreneurs today!</p>
            <button className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200">
              Join EDC
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
