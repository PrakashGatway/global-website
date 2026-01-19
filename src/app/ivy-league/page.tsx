import Image from "next/image";
import IvyLeagueNavigation from "@/components/IvyLeagueNavigation";
import ImageTestimonial from "@/components/ImageTestimonial";
import IvyLeagueUniversitySlider from "@/components/IvyLeagueUniversitySlider";
import { Footer } from "@/components/Footer";
import VideoBackground from "@/components/VideoBackground";
import StatisticsSlider from "@/components/StatisticsSlider";

export default function IvyLeaguePage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <IvyLeagueNavigation />

      {/* Hero Section */}
      <section className="relative h-[700px] overflow-hidden">
        <div className="absolute inset-0">
          <VideoBackground 
            videos={[
              "/0_Queens_University_Belfast_Belfast_1920x1080.mp4",
              "/4730892_Cheyenne_Wyoming_1920x1080.mp4"
            ]} 
          />
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
        <div className="relative z-10 h-full flex flex-col justify-center items-start text-left px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl" style={{ marginLeft: '60px', transform: 'none', perspective: 'none' }}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl text-white mb-0 leading-tight" style={{ fontFamily: "'Mileast', 'Playfair Display', 'Cormorant Garamond', Georgia, serif", fontWeight: 500, textAlign: 'left', transform: 'none', transformStyle: 'flat', transformOrigin: 'initial', letterSpacing: 'normal' }}>
              <span className="block" style={{ transform: 'none', display: 'block' }}>Your path to the</span>
              <span className="block" style={{ transform: 'none', display: 'block' }}>Ivy League Universities</span>
            </h1>
            <p className="text-lg md:text-xl text-white mb-10 leading-relaxed" style={{ textAlign: 'left' }}>
              GAway is a league of its own. We help you get into the Ivy League and other top universities in the USA, UK, and Canada. We&apos;ll help you get into the Ivy League and top graduate schools.
            </p>
            
          </div>
        </div>
      </section>

      {/* Our Global University Network */}
      <section className="py-5 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-600">
            Our Global University Network
          </h2>
          <IvyLeagueUniversitySlider />
        </div>
      </section>

      {/* Ivy Coach's College Admissions Track Record */}
      <section className="py-5 bg-gray-50" style={{ overflow: 'visible' }}>
        <div className="max-w-7xl mx-auto px-4" style={{ overflow: 'visible' }}>
          {/* Border line above */}
          <div className="mb-8 mx-auto" style={{ borderTop: '3px solid rgb(94, 77, 77)', width: '50%' }}></div>
          
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 uppercase tracking-wide" style={{ color: '#f46c44', fontFamily: "'Mileast', 'Playfair Display', 'Cormorant Garamond', Georgia, serif", textAlign: 'center' }}>
              <span className="block">IVY COACH&apos;S COLLEGE</span>
              <span className="block">ADMISSIONS TRACK RECORD</span>
            </h2>
            <p className="text-lg text-gray-800 max-w-5xl mx-auto mb-2 font-semibold" style={{ textAlign: 'center' }}>
              <span className="block">The percentage of Ivy Coach&apos;s packaged clients over the last 10 years</span>
              <span className="block">who earned admission to the following schools in the Early round.</span>
            </p>
            <p className="text-sm text-gray-800 font-semibold mx-auto" style={{ textAlign: 'center' }}>
              At most of these schools, we typically have 3-4 applicants annually.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start" style={{ overflow: 'visible' }}>
            {/* Left Panel - Proven Success */}
            <div>
              <h3 className="text-3xl font-bold mb-8">
                <span className="block text-xl font-bold italic" style={{ 
                  fontFamily: "'Mileast Italic', 'Playfair Display', 'Cormorant Garamond', Georgia, serif",
                  background: 'linear-gradient(180deg, #ff8c5a 0%, #f46c44 50%, #e55a2b 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 1px 2px rgba(244, 108, 68, 0.3))'
                }}>Numbers Don&apos;t Lie.</span>
                <span className="block text-gray-600">Proven Success.</span>
                <span className="block text-gray-600">Unmatched Results.</span>
              </h3>

              {/* Student Image */}
              <div className="mb-8 relative" style={{ width: 'fit-content' }}>
                <div className="relative" style={{ width: '350px', height: '280px' }}>
                  <Image 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&h=500&fit=crop"
                    alt="Student Success"
                    width={350}
                    height={280}
                    className="object-cover rounded-lg shadow-lg absolute inset-0"
                    style={{ height: '100%', width: '100%', zIndex: 1 }}
                    unoptimized
                  />
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundImage: 'url(/0002.png)',
                      backgroundSize: '100% 100%',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                      zIndex: 2
                    }}
                  ></div>
                </div>
              </div>

              {/* 98% Stat */}
              <div className="text-left">
                <div className="text-7xl  mb-3" style={{ color: '#f46c44' }}>98%</div>
                <p className="text-xl text-gray-700 font">of our students are admitted to atleast 1 of their top 5 college choices</p>
              </div>
            </div>

            {/* Right Panel - Bar Chart */}
            <div style={{ overflow: 'visible', paddingLeft: '10px' }}>
              {/* Large Number Box - Tilted */}
              <div className="mb-1 text-left transform rotate-3" style={{ borderWidth: '1.5px', borderStyle: 'solid', borderColor: '#f46c44', transform: 'rotate(-3deg)', borderRadius: '20px', padding: '32px', overflow: 'visible', marginLeft: '150px' }}>
                <div className="text-7xl mb-0" style={{ color: '#f46c44', fontFamily: "'Mileast', 'Playfair Display', 'Cormorant Garamond', Georgia, serif", fontWeight: 500 }}>1,485</div>
                <p className="text-gray-600 text-lg">Total Offers in Last 10 Years</p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h4 className="text-2xl font-bold mb-8 text-gray-600" style={{ fontFamily: "'Mileast', 'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}>
                  <span className="border-b-2 border-gray-300 pb-2 inline-block">College Specific Acceptance Rates</span>
                </h4>

                {/* Table Header */}
                <div className="flex items-center gap-3 pb-2 mb-2 border-b-2 border-gray-300">
             
            
                  <div className="flex- text-center">
                    <span className="text-xs font-semibold text-gray-600">General Admit Rate</span>
                  </div>
                  <div className="w-[px] h-full min-h-[4px] bg-gray-300 self-stretch"></div>
                  <div className="flex-5 text-center">
                    <span className="text-xs font-semibold" style={{ color: '#f46c44' }}>GAway Student Admit Rate</span>
                  </div>
                </div>

                {/* Table Format with Both Columns */}
                <div className="space-y-0">
                  {[
                    { name: 'Harvard', generalRate: 3.2, gawayRate: 20.0, logo: '/ivy/Harvard_University_coat_of_arms.svg', alt: 'Harvard' },
                    { name: 'Stanford', generalRate: 4.3, gawayRate: 80.0, logo: '/ivy/images.png', alt: 'Stanford' },
                    { name: 'Yale', generalRate: 4.6, gawayRate: 70.2, logo: '/ivy/Yale_University_Shield_1.svg', alt: 'Yale' },
                    { name: 'Columbia', generalRate: 3.9, gawayRate: 78.1, logo: '/ivy/61Fa-pNEFXL._AC_UF1000,1000_QL80_.jpg', alt: 'Columbia' },
                    { name: 'UPenn', generalRate: 5.9, gawayRate: 83.3, logo: '/ivy/UniversityofPennsylvania_Shield_RGB-2.png', alt: 'UPenn' },
                    { name: 'Dartmouth', generalRate: 6.2, gawayRate: 77.0, logo: '/ivy/images.png', alt: 'Dartmouth' },
                    { name: 'Princeton', generalRate: 5.7, gawayRate: 60.6, logo: '/ivy/seal-and-logo-of-princeton-university-2JR4KMY.jpg', alt: 'Princeton' },
                    { name: 'Cornell', generalRate: 7.3, gawayRate: 80.6, logo: '/ivy/images.png', alt: 'Cornell' },
                    { name: 'MIT', generalRate: 6.5, gawayRate: 85.0, logo: '/ivy/images.png', alt: 'MIT' }
                  ].map((uni, i) => (
                    <div key={i} className="flex items-center gap-3 pb-0 border-b border-gray-100 last:border-0">
                      {/* University Icon/Logo */}
                      <div className="w-12 h-12  rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                        <Image 
                          src={uni.logo}
                          alt={uni.alt}
                          width={48}
                          height={48}
                          className="object-contain w-full h-full p-1.5"
                          unoptimized
                        />
                      </div>
                      
                      {/* University Name */}
                      <div className="w-32 flex-shrink-0">
                        <span className="text-sm font-semibold text-gray-800">{uni.name}</span>
                      </div>
                      
                      {/* General Admit Rate Column - Empty */}
                      <div className="flex-1">
                      </div>
                      
                      {/* Vertical Divider Line */}
                      <div className="w-px h-8 bg-gray-300"></div>
                      
                      {/* GAway Student Admit Rate Column - Orange */}
                      <div className="flex-10">
                        <div style={{ marginLeft: '2px', position: 'relative' }}>
                          <div className=" rounded-full h-3 relative" style={{ overflow: 'visible' }}>
                            <div 
                              className="h-full rounded-full transition-all duration-500"
                              style={{ 
                                width: `${(uni.gawayRate / 85.0) * 100}%`,
                                background: `linear-gradient(to right, #f46c44 0%, #f46c44 70%, rgba(244, 108, 68, 0.85) 80%, rgba(244, 108, 68, 0.6) 85%, rgba(244, 108, 68, 0.4) 90%, rgba(244, 108, 68, 0.2) 95%, transparent 100%)`
                              }}
                            ></div>
                          </div>
                          <span 
                            className="text-sm font-bold absolute top-1/2 -translate-y-1/2 whitespace-nowrap"
                            style={{ 
                              color: '#000000',
                              left: `calc(${(uni.gawayRate / 85.0) * 100}% + 8px)`
                            }}
                          >
                            {uni.gawayRate}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="mt-8 w-full text-gray-700 px-6 py-3 rounded-lg font-semibold hover:text-orange-500 transition border-2" style={{ borderColor: '#f46c44', outline: 'none', background: 'transparent' }}>
                  VIEW STATISTICS
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Ivy Coach Daily */}
      <section className="py-10 bg-white overflow-visible">
        <div className="max-w-7xl mx-auto px-4 overflow-visible">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-3 uppercase tracking-wide" style={{ color: '#f46c44' }}>
              THE IVY COACH DAILY
            </h2>
            <p className="text-lg text-gray-600 ">Way To Tell It Like It Is, Ivy Coach</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10" style={{ width: '100%' }}>
            {[
              { 
                uni: 'Harvard University', 
                text: 'Harvard University Class of 2028 Early Action Admission Rate is 7.2%',
                date: 'December 15, 2023',
                img: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop'
              },
              { 
                uni: 'Cornell University', 
                text: 'Cornell University Class of 2028 Early Decision Admission Rate is 17.9%',
                date: 'December 15, 2023',
                img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop'
              },
              { 
                uni: 'Yale University', 
                text: 'Yale University Class of 2028 Early Action Admission Rate is 9.0%',
                date: 'December 15, 2023',
                img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=600&fit=crop'
              }
            ].map((item, i) => (
              <div key={`ivy-coach-${i}`} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition w-full">
                <Image 
                  src={item.img}
                  alt={item.uni}
                  width={400}
                  height={300}
                  className="w-full h-56 object-cover"
                  unoptimized
                />
                <div className="p-6">
                  <h4 className="text-lg font-bold text-gray-800 mb-2 leading-tight">
                    {item.text}
                  </h4>
                  <p className="text-sm text-gray-500">by S.K. Date: {item.date}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button className="text-gray-700 px-10 py-3 rounded-lg font-semibold hover:text-orange-500 transition border-2" style={{ borderColor: '#f46c44', outline: 'none', background: 'transparent' }}>
              VIEW ALL
            </button>
          </div>
        </div>
      </section>

      {/* Statistics Bar */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <StatisticsSlider />
        </div>
      </section>

      {/* What Makes Ivy League Special */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16" style={{ color: '#f46c44' }}>
            What Makes Ivy League Special
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Panel - Features */}
            <div className="space-y-8">
              <div className="border-4 rounded-lg p-8" style={{ borderColor: '#f46c44', backgroundColor: '#fef5f1' }}>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Ivy League Curriculum</h3>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  Our Ivy League curriculum is designed to help students develop the skills and knowledge necessary to succeed in the Ivy League. The curriculum includes rigorous coursework, research opportunities, and access to world-class faculty.
                </p>
                <button className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition">
                  Read More
                </button>
              </div>

              <div className="border-4 rounded-lg p-8" style={{ borderColor: '#f46c44', backgroundColor: '#fef5f1' }}>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Profile Building</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  We help students build a strong profile that showcases their unique talents and achievements. This includes extracurricular activities, leadership roles, community service, and academic excellence.
                </p>
                <button className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition">
                  Read More
                </button>
              </div>
            </div>

            {/* Right Panel - Image */}
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=600&fit=crop"
                alt="Student with passport"
                className="w-full h-[600px] object-cover rounded-3xl"
                style={{ border: '4px solid #f46c44' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Admission Requirements */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4" style={{ color: '#f46c44' }}>
            Admission Requirements for United Kingdom Study Abroad
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-4xl mx-auto text-lg">
            Here are the main requirements to study in UK which you need to ensure you to apply for the university.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="space-y-5">
              {['Copy of valid passport', 'GRE/GMAT scores for PG programs', 'Letter of recommendation (LORs)', 'Academic transcripts'].map((req, i) => (
                <div key={i} className="flex items-start gap-4">
                  <svg className="w-7 h-7 flex-shrink-0 mt-0.5" style={{ color: '#f46c44' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-lg text-gray-700">{req}</span>
                </div>
              ))}
            </div>
            <div className="space-y-5">
              {['TOEFL/IELTS/Advanced scores', 'Academic Resume/CV', 'Portfolio (for specific courses)', 'Statement of Purpose (SOP)'].map((req, i) => (
                <div key={i} className="flex items-start gap-4">
                  <svg className="w-7 h-7 flex-shrink-0 mt-0.5" style={{ color: '#f46c44' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-lg text-gray-700">{req}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How GAway Helps */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16" style={{ color: '#f46c44' }}>
            How GAway helps
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6" style={{ color: '#f46c44' }}>
                Write Essays That Seal the Deal
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                From the perfect topic to final polish, our essay experts guide you on how to write a personal statement and supplemental essays that show why they belong on campus.
              </p>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=500&fit=crop"
                alt="Essay writing"
                className="w-full h-[500px] object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Admission Process Roadmap */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16" style={{ color: '#f46c44' }}>
            Admission Process Roadmap
          </h2>

          <div className="relative">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4">
              {[
                { num: 1, text: 'Profile Evaluation' },
                { num: 2, text: 'Exam Preparation' },
                { num: 3, text: 'University Shortlisting' },
                { num: 4, text: 'Application Filing' },
                { num: 5, text: 'Visa & Enrollment' },
                { num: 6, text: 'Pre-Departure & Visa Preparation' }
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full text-white flex items-center justify-center text-3xl font-bold mb-4 shadow-lg" style={{ backgroundColor: '#f46c44' }}>
                    {step.num}
                  </div>
                  <p className="text-gray-700 font-semibold text-lg max-w-[150px]">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Scholarships */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4" style={{ color: '#f46c44' }}>
            Scholarships to Study in United Kingdom
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-4xl mx-auto text-lg">
            There are many scholarships offered by the UK government, universities and private organizations to help you cover the tuition fees of your course and other costs of living. Here are some of the scholarships you can apply for:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="space-y-5">
              {['Chevening Scholarships', 'Commonwealth Scholarships', 'Rhodes Scholarship', 'Gates Cambridge Scholarship', 'Erasmus Mundus Joint Master Degrees', 'GREAT Scholarships'].map((sch, i) => (
                <div key={i} className="flex items-start gap-4">
                  <svg className="w-7 h-7 flex-shrink-0 mt-0.5" style={{ color: '#f46c44' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-lg text-gray-700">{sch}</span>
                </div>
              ))}
            </div>
            <div className="space-y-5">
              {['Felix Scholarships', 'Marshall Scholarships'].map((sch, i) => (
                <div key={i} className="flex items-start gap-4">
                  <svg className="w-7 h-7 flex-shrink-0 mt-0.5" style={{ color: '#f46c44' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-lg text-gray-700">{sch}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Image Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          
          <ImageTestimonial />
        </div>
      </section>

      {/* Case Studies */}
      <section 
        className="py-20 bg-white"
        style={{
          display: 'grid',
          height: 'fit-content',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          marginTop: '-50px'
        }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ color: '#f46c44' }}>
              Case Studies
            </h2>
            <p className="text-xl text-gray-600">
              Real student journeys, real results. Carefully curated outcomes.
            </p>
          </div>
          {/* Case Studies component can be added here */}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24" style={{ backgroundColor: '#f46c44' }}>
        <div className="max-w-5xl mx-auto text-center px-4">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 uppercase tracking-wide">
            TOWARD THE <span className="line-through">CONQUEST OF</span> ADMISSION
          </h2>
          <p className="text-xl text-white mb-10 max-w-3xl mx-auto leading-relaxed">
            If you&apos;re interested in Ivy Coach&apos;s college counseling, fill out our contact form or schedule a free consultation to learn more and get in touch.
          </p>
          <button className="bg-white text-orange-500 px-12 py-4 rounded-lg text-xl font-semibold hover:bg-gray-100 transition shadow-lg">
            GET STARTED
          </button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
