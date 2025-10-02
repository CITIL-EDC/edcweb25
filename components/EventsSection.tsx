export default function EventsSection() {
  return (
    <section id="events" className="min-h-screen py-20 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-900/10 to-black"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Events
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Stay tuned for exciting events, workshops, and competitions coming soon!
          </p>
        </div>

        {/* Placeholder Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-12 border border-white/10 text-center">
            <div className="text-6xl mb-6">📅</div>
            <h3 className="text-2xl font-bold mb-4 text-white">Coming Soon</h3>
            <p className="text-white/70 mb-6">
              We&apos;re planning some amazing events! Check back soon for updates on workshops, hackathons, and networking sessions.
            </p>
            <button className="px-6 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full font-semibold border border-white/20 hover:bg-white/20 transition-all duration-200">
              Get Notified
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
