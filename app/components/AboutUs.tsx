import CascadingText from './reusables/CascadingText';

/**
 * AboutUs Section Component
 * 
 * Features our mission statement with an animated heading using CascadingText.
 * Promotes entrepreneurship and student startup culture at EDC.
 * 
 * Layout:
 * - Full-width section with left-aligned content
 * - Animated "ABOUT US" heading with cascading letter effect
 * - Mission statement text in Instrument Sans font, left-aligned
 */
export default function AboutUs() {
  return (
    <section id="about" className="min-h-screen">
      {/* Cascading Text Header - Light gray background with black text */}
      <div className="py-20 px-6" style={{ backgroundColor: '#f7f7f7' }}>
        <div className="max-w-4xl mx-auto text-center">
          <CascadingText
            text="ABOUT US"
            font="spline-sans-mono"
            fontSize="responsive"
            className="text-black"
          />
        </div>
      </div>
      
      {/* Content Section - Dark background with white text */}
      <div className="bg-[#101010] min-h-screen flex items-center px-6 pt-30">
        <div className="w-full max-w-6xl space-y-6">
          <p className="font-spline-sans-mono text-base md:text-lg text-white font-extralight mb-8 text-left">
            At the EDC,
          </p>
          
          <p className="font-instrument-sans text-4xl md:text-6xl lg:text-7xl xl:text-8xl text-white font-semibold leading-none tracking-tighter transform scale-y-125">
            ENTREPRENEURSHIP
          </p>
          
          <p className="font-instrument-sans text-4xl md:text-6xl lg:text-7xl xl:text-8xl text-white/90 font-semibold leading-none tracking-tighter transform scale-y-125">
            IS NOT JUST
          </p>
          
          <p className="font-instrument-sans text-4xl md:text-6xl lg:text-7xl xl:text-8xl text-white/80 font-semibold leading-none tracking-tighter transform scale-y-125">
            IDEAS, BUT
          </p>
          
          <p className="font-instrument-sans text-4xl md:text-6xl lg:text-7xl xl:text-8xl text-white/70 font-semibold leading-none tracking-tighter transform scale-y-125">
            A FORCE FOR DISRUPTION
          </p>
          
          <p className="font-instrument-sans text-4xl md:text-6xl lg:text-7xl xl:text-8xl text-white/60 font-semibold leading-none tracking-tighter transform scale-y-125">
            AND PROGRESS
          </p>
        </div>
      </div>
    </section>
  );
}