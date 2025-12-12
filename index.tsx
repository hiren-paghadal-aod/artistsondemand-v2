import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

// --- CONFIGURATION ---
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwDL9rBaXaqVqj3nTh6SFFaaZe1KGxgoe_36nJ1snZgzhWNbjxkc3iO0tuzHiZpHkhU/exec";
const CONTACT_EMAIL = "communication.aod@gmail.com";
const INSTAGRAM_URL = "https://www.instagram.com/artistsondemand.in?igsh=MXRzNm1ucjZlNnpncg==";
const PHONE_NUMBER = "+91 96017 82132";

// --- Data ---
const HERO_SLIDES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1600",
    title: <>Creativity Delivered <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-orange-300">On Demand</span></>,
    subtitle: "The premium platform connecting you with verified, world-class artists for your events, weddings, and creative projects."
  },
  {
    id: 2,
    image: "https://wallpaperaccess.com/full/3793730.jpg",
    title: <>Capture Every <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-orange-300">Moment</span></>,
    subtitle: "Book top-tier photographers and videographers to preserve your memories with cinematic quality."
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=1600",
    title: <>Live Music That <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-orange-300">Moves You</span></>,
    subtitle: "From soulful soloists to high-energy bands, find the perfect sound to set the tone for your celebration."
  },
  {
    id: 4,
    image: "https://cdn.shopify.com/s/files/1/0752/4243/files/oweb_gold_nails_Front.jpg?180",
    title: <>Artistry In <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-orange-300">Every Detail</span></>,
    subtitle: "Connect with makeup artists, painters, and creative performers to bring your unique vision to life."
  }
];

const REVIEWS = [
  { id: 1, name: "Priya Sharma", role: "Event Planner", text: "AOD made it incredibly easy to find a live band for my corporate event. The artists were professional and punctual.", rating: 5 },
  { id: 2, name: "Rahul Verma", role: "Wedding Client", text: "I booked a photographer and makeup artist through AOD. The coordination was seamless and the quality was top-notch.", rating: 4.5 },
  { id: 3, name: "Sneha Gupta", role: "Gallery Owner", text: "Finding talented painters for our live art show was a breeze. Highly recommended service for quick artist requirements.", rating: 4 },
  { id: 4, name: "Amit Patel", role: "Restaurant Owner", text: "The musician we booked was a hit! The platform is very user-friendly.", rating: 5 },
  { id: 5, name: "Zoya Khan", role: "Fashion Designer", text: "Best place to find creative talent in India. Loved the service.", rating: 4.5 },
];

const SERVICES = [
  { 
    id: 1, 
    title: "Photographers", 
    description: "Capture your moments with professional event, wedding, and portfolio photographers.",
    icon: "fa-camera",
    image: "/photographer.jpg"
  },
  { 
    id: 2, 
    title: "Makeup Artists", 
    description: "Glam up for your special day with certified makeup and styling experts.",
    icon: "fa-wand-magic-sparkles",
    image: "https://cdn0.weddingwire.in/vendor/7852/3_2/960/jpg/bridalg10_15_17852.jpeg"
  },
  { 
    id: 3, 
    title: "Musicians & Bands", 
    description: "Live performers, bands, and singers to elevate the vibe of your event.",
    icon: "fa-music",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=800"
  },
  { 
    id: 4, 
    title: "Fine Artists", 
    description: "Engage your audience with live art—painters and sketch artists on demand.",
    icon: "fa-palette",
    image: "https://i.etsystatic.com/17849024/r/il/cd1a03/2188682452/il_500x500.2188682452_naw7.jpg"
  },
];

// --- API Helper ---
const submitToGoogleSheets = async (payload) => {
  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes("PASTE_YOUR")) {
    console.warn("Please configure the Google Script URL in the code.");
    return new Promise(resolve => setTimeout(() => resolve({ success: true }), 1500));
  }

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "text/plain;charset=utf-8" },
    });
    return { success: true };
  } catch (error) {
    console.error("Error submitting form", error);
    return { success: false, error };
  }
};

// --- Helper Components ---
const FadeInWhenVisible = ({ children, delay = 0 }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (domRef.current) observer.unobserve(domRef.current);
        }
      });
    });
    if (domRef.current) observer.observe(domRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<i key={i} className="fas fa-star text-brand"></i>);
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      stars.push(<i key={i} className="fas fa-star-half-alt text-brand"></i>);
    } else {
      stars.push(<i key={i} className="far fa-star text-gray-300"></i>);
    }
  }
  return <div className="flex gap-1 mb-4 text-sm">{stars}</div>;
};

// --- Page Components ---

const PrivacyPolicy = ({ onBack }) => (
  <div className="pt-32 pb-20 container mx-auto px-6 max-w-4xl min-h-screen">
    <button onClick={onBack} className="mb-8 flex items-center gap-2 text-brand font-bold hover:underline">
      <i className="fas fa-arrow-left"></i> Back to Home
    </button>
    <h1 className="text-4xl font-bold mb-6 text-dark-900">Privacy Policy</h1>
    <div className="prose prose-lg text-gray-600 space-y-6">
      <p>Last Updated: {new Date().toLocaleDateString()}</p>
      <p>At Artists On Demand (AOD), accessible from our website, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by AOD and how we use it.</p>
      <h3 className="text-2xl font-bold text-dark-900">Information We Collect</h3>
      <p>We collect information you provide directly to us when you fill out our "Hire Artist" or "Join as Artist" forms. This includes your name, email address, phone number, and event details.</p>
      <h3 className="text-2xl font-bold text-dark-900">How We Use Your Information</h3>
      <p>We use the information we collect to connect clients with artists, improve our website, and communicate with you regarding your bookings or applications.</p>
    </div>
  </div>
);

const TermsOfService = ({ onBack }) => (
  <div className="pt-32 pb-20 container mx-auto px-6 max-w-4xl min-h-screen">
    <button onClick={onBack} className="mb-8 flex items-center gap-2 text-brand font-bold hover:underline">
      <i className="fas fa-arrow-left"></i> Back to Home
    </button>
    <h1 className="text-4xl font-bold mb-6 text-dark-900">Terms of Service</h1>
    <div className="prose prose-lg text-gray-600 space-y-6">
      <h3 className="text-2xl font-bold text-dark-900">1. Acceptance of Terms</h3>
      <p>By accessing this website, we assume you accept these terms and conditions. Do not continue to use AOD if you do not agree to take all of the terms and conditions stated on this page.</p>
      <h3 className="text-2xl font-bold text-dark-900">2. Booking Services</h3>
      <p>AOD acts as an intermediary platform. We do not guarantee the performance of any artist, though we vet them to the best of our ability. Cancellations and refunds are subject to specific contracts signed during booking.</p>
      <h3 className="text-2xl font-bold text-dark-900">3. User Conduct</h3>
      <p>You agree not to use our platform for any unlawful purpose or to solicit our artists outside of the platform without our consent.</p>
    </div>
  </div>
);

// New About Us Component
const AboutUs = ({ onBack }) => (
  <div className="pt-32 pb-20 container mx-auto px-6 max-w-4xl min-h-screen">
    <button onClick={onBack} className="mb-8 flex items-center gap-2 text-brand font-bold hover:underline">
      <i className="fas fa-arrow-left"></i> Back to Home
    </button>
    <h1 className="text-4xl font-bold mb-6 text-dark-900">About Artists On Demand</h1>
    <div className="prose prose-lg text-gray-600 space-y-6">
      <p>Artists On Demand (AOD) is India’s premier platform dedicated to bridging the gap between exceptional creative talent and those who seek it. Whether you are planning a wedding, a corporate gala, or an intimate gathering, we believe that the right artist can transform any event into an unforgettable memory.</p>
      <p>Founded with a passion for the arts, AOD simplifies the booking process, ensuring that professionalism and quality are never compromised. Our curated roster of photographers, musicians, makeup artists, and performers are vetted to ensure they meet the highest standards of excellence.</p>
      <h3 className="text-2xl font-bold text-dark-900">Our Mission</h3>
      <p>To empower artists by providing them with a dignified platform to showcase their skills while offering clients a seamless, transparent, and reliable booking experience.</p>
    </div>
  </div>
);

// --- Global Components ---

const CookieConsent = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('aod_cookie_consent');
    if (!consent) setShow(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem('aod_cookie_consent', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-50 p-6 animate-fade-in-up">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-600 max-w-2xl">
          <strong className="text-dark-900">We use cookies.</strong> We use cookies to improve your experience and analyze our traffic. By continuing to use our site, you agree to our Terms of Service and Privacy Policy.
        </div>
        <div className="flex gap-4">
          <button onClick={() => setShow(false)} className="text-gray-500 hover:text-dark-900 text-sm font-medium">Decline</button>
          <button onClick={handleAccept} className="px-6 py-2 bg-brand text-white rounded-full text-sm font-bold hover:bg-brand-dark transition-colors">Accept All</button>
        </div>
      </div>
    </div>
  );
};

const SuccessModal = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="bg-white rounded-2xl w-full max-w-md p-8 relative z-10 shadow-2xl animate-[fadeInUp_0.3s_ease-out] text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="fas fa-check text-green-500 text-3xl"></i>
        </div>
        <h3 className="text-2xl font-serif font-bold text-dark-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-8">{message}</p>
        <button onClick={onClose} className="w-full py-3 bg-brand text-white font-bold rounded-lg hover:bg-brand-dark transition-colors">
          Awesome!
        </button>
      </div>
    </div>
  );
};

const Navbar = ({ onOpenForm, onNavigate, currentPage }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (section) => {
    setIsMobileMenuOpen(false);
    
    const executeScroll = () => {
      if (section === 'footer') {
        // Force scroll to the very bottom of the document
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      } else {
        // Scroll to specific section ID
        const element = document.getElementById(section);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }
    };
    
    // If we are not on home page, go to home first
    if (currentPage !== 'home') {
      onNavigate('home');
      // Wait for page to render, then scroll
      setTimeout(() => {
        const element = document.getElementById(section);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      // If already on home, just scroll
      document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
      executeScroll();
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="text-2xl font-bold tracking-tighter flex items-center gap-2 cursor-pointer" onClick={() => handleNavClick('home')}>
          <span className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-serif text-xl ${isScrolled ? 'bg-brand' : 'bg-white text-brand'}`}>A</span>
          <span className={`text-xl ${isScrolled ? 'text-dark-900' : 'text-white'}`}>AOD</span>
        </div>

        <div className={`hidden md:flex items-center gap-8 ${isScrolled ? 'text-gray-600' : 'text-white/90'}`}>
          <button onClick={() => handleNavClick('home')} className="hover:text-brand transition-colors text-sm font-medium tracking-wide">Home</button>
          <button onClick={() => handleNavClick('services')} className="hover:text-brand transition-colors text-sm font-medium tracking-wide">Services</button>
          <button onClick={() => handleNavClick('reviews')} className="hover:text-brand transition-colors text-sm font-medium tracking-wide">Reviews</button>
          <button onClick={() => handleNavClick('footer')} className="hover:text-brand transition-colors text-sm font-medium tracking-wide">Contact Us</button>
          <button 
            onClick={() => onOpenForm('JOIN')}
            className="text-sm font-medium hover:text-brand transition-colors tracking-wide"
          >
            Join as Artist
          </button>
        </div>

        <div className="hidden md:block">
          <button 
            onClick={() => onOpenForm('HIRE')}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all transform hover:scale-105 shadow-md ${
              isScrolled 
                ? 'bg-brand text-white hover:bg-brand-dark' 
                : 'bg-white text-brand hover:bg-gray-100'
            }`}
          >
            Hire Artist
          </button>
        </div>

        <button 
          className={`md:hidden text-2xl ${isScrolled ? 'text-dark-900' : 'text-white'}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-xl py-6 flex flex-col items-center gap-6 md:hidden border-t animate-fade-in-down">
          <button onClick={() => handleNavClick('home')} className="text-gray-800 font-medium text-lg">Home</button>
          <button onClick={() => handleNavClick('services')} className="text-gray-800 font-medium text-lg">Services</button>
          <button onClick={() => handleNavClick('reviews')} className="text-gray-800 font-medium text-lg">Reviews</button>
          <button onClick={() => handleNavClick('footer')} className="text-gray-800 font-medium text-lg">Contact Us</button>
          <button 
            onClick={() => { onOpenForm('JOIN'); setIsMobileMenuOpen(false); }}
            className="text-brand font-medium text-lg"
          >
            Join as Artist
          </button>
          <button 
            onClick={() => { onOpenForm('HIRE'); setIsMobileMenuOpen(false); }}
            className="bg-brand text-white px-8 py-3 rounded-full font-medium shadow-lg"
          >
            Hire Artist
          </button>
        </div>
      )}
    </nav>
  );
};

const Hero = ({ onOpenForm }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000); 

    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Slideshow */}
      {HERO_SLIDES.map((slide, index) => (
        <div 
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img 
            src={slide.image}
            alt="Hero Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30"></div>
        </div>
      ))}

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10 text-center text-white max-w-5xl">
        <div key={currentSlide} className="fade-in-up">
          <span className="inline-block py-1.5 px-4 rounded-full bg-brand/20 border border-brand/50 text-brand-light text-xs font-bold tracking-[0.2em] mb-8 uppercase backdrop-blur-sm">
            Welcome to AOD
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight tracking-tight">
            {HERO_SLIDES[currentSlide].title}
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            {HERO_SLIDES[currentSlide].subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button 
              onClick={() => onOpenForm('HIRE')}
              className="w-full sm:w-auto px-10 py-4 bg-brand text-white rounded-full font-bold text-lg hover:bg-brand-dark transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center gap-3"
            >
              Find an Artist <i className="fas fa-arrow-right text-sm"></i>
            </button>
            <button 
              onClick={() => onOpenForm('JOIN')}
              className="w-full sm:w-auto px-10 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full font-bold text-lg hover:bg-white hover:text-dark-900 transition-all transform hover:scale-105"
            >
              Join as Artist
            </button>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
        {HERO_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-brand w-8' : 'bg-white/50 hover:bg-white'
            }`}
          ></button>
        ))}
      </div>
    </section>
  );
};

const Stats = () => {
  return (
    <section id="stats" className="bg-white py-16 border-b">
      <div className="container mx-auto px-6">
        <FadeInWhenVisible>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-100">
            {[
              { label: "Active Artists", value: "100+", icon: "fa-users" },
              { label: "Events Completed", value: "500+", icon: "fa-check-circle" },
              { label: "Cities Covered", value: "50+", icon: "fa-map-marker-alt" },
              { label: "Client Rating", value: "4.9/5", icon: "fa-star" },
            ].map((stat, idx) => (
              <div key={idx} className="p-4 group cursor-default">
                <i className={`fas ${stat.icon} text-brand/20 text-3xl mb-4 group-hover:text-brand transition-colors duration-300`}></i>
                <div className="text-4xl md:text-5xl font-bold text-dark-900 mb-2 font-serif">{stat.value}</div>
                <div className="text-gray-500 text-xs md:text-sm uppercase tracking-widest font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </FadeInWhenVisible>
      </div>
    </section>
  );
};

// const Sentence1 = () => {
//   return (
//     <section id="Sentence1" className="bg-white py-16 border-b">
//       <div
//         className="flex overflow-x-auto pb-8 snap-x"
//         style={{
//           animation: "scroll-right 10s linear infinite",
//           width: "max-content",
//         }}
//       >
//         <p className="whitespace-nowrap w-max text-4xl md:text-6xl font-bold text-dark-900">
//           India’s First One-Stop Platform for Easy Artists Booking.
//         </p>
//       </div>
//     </section>
//   );
// };

const FeatureHighlight = () => {
  return (
    <section id="feature" className="py-24 bg-brand-light/30 relative overflow-hidden">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-dark-900 mb-4">
          India’s First One-Stop Platform for <br></br>Easy Artists Booking.
        </h2>
        <p className="text-gray-600 mt-2">
          Discover how simple it is to connect with the best artists for your events.
        </p>
      </div>

      <div className="relative w-full overflow-hidden mt-12">
        {/* Decorative Gradient Edges */}
        <div className="absolute left-0 top-0 h-full w-15 bg-gradient-to-r from-white/80 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 h-full w-15 bg-gradient-to-l from-white/80 to-transparent z-10 pointer-events-none"></div>

        {/* Optional Decorative Box */}
        <div className="flex justify-center gap-6 overflow-x-auto pb-8" style={{
            animation: "scroll-left 20s linear infinite",
            width: "max-content"
          }}>
          <div className="flex-shrink-0 w-[85vw] md:w-[45vw]">
            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col justify-center items-center">
              <p className="text-gray-700 italic text-lg md:text-xl text-center">
                "Your Trusted Marketplace for Booking"
              </p>
            </div>
          </div>
          <div className="flex-shrink-0 w-[85vw] md:w-[45vw]">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col justify-center items-center">
              <p className="text-gray-700 italic text-lg md:text-xl text-center">
                "India’s Smartest Way to Hire Artists for Any Event."
              </p>
            </div>
          </div>
          <div className="flex-shrink-0 w-[85vw] md:w-[45vw]">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col justify-center items-center">
              <p className="text-gray-700 italic text-lg md:text-xl text-center">
                "Discover, Connect & Book Artists — All in One Place."
              </p>
            </div>
          </div>
          <div className="flex-shrink-0 w-[85vw] md:w-[45vw]">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col justify-center items-center">
              <p className="text-gray-700 italic text-lg md:text-xl text-center">
                "Making Artist Booking Transparent, Easy, and Reliable"
              </p>
            </div>
          </div>
          <div className="flex-shrink-0 w-[85vw] md:w-[45vw]">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col justify-center items-center">
              <p className="text-gray-700 italic text-lg md:text-xl text-center">
                "Transform Your Event With Verified and Skilled Performers."
              </p>
            </div>
          </div>
        </div>
      </div>

      
    </section>
  );
};

// export default FeatureHighlight;


const Services = () => {
  return (
    <section id="services" className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <FadeInWhenVisible>
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <span className="text-brand font-bold tracking-widest text-sm uppercase mb-3 block">What We Offer</span>
            <h2 className="text-4xl md:text-5xl font-bold text-dark-900 mb-6">Our Artist Categories</h2>
            <p className="text-gray-600 text-lg">Explore our diverse pool of talent. From visual arts to performing arts, we have the right expert for your specific needs.</p>
          </div>
        </FadeInWhenVisible>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {SERVICES.map((service, idx) => (
            <FadeInWhenVisible key={service.id} delay={idx * 100}>
              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer h-full flex flex-col">
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-dark-900/20 group-hover:bg-dark-900/10 transition-all z-10"></div>
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute bottom-4 left-4 z-20 w-12 h-12 bg-white rounded-full flex items-center justify-center text-brand shadow-lg group-hover:bg-brand group-hover:text-white transition-colors duration-300">
                    <i className={`fas ${service.icon} text-lg`}></i>
                  </div>
                </div>
                <div className="p-8 flex-grow">
                  <h3 className="text-2xl font-bold text-dark-900 mb-3 group-hover:text-brand transition-colors">{service.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{service.description}</p>
                </div>
              </div>
            </FadeInWhenVisible>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2 relative">
             <FadeInWhenVisible>
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200" 
                  alt="Team working" 
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand/10 rounded-full z-0 blur-3xl"></div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-200/20 rounded-full z-0 blur-3xl"></div>
            </FadeInWhenVisible>
          </div>
          
          <div className="md:w-1/2">
            <FadeInWhenVisible delay={200}>
              <span className="text-brand font-bold tracking-widest text-sm uppercase mb-3 block">Process</span>
              <h2 className="text-4xl md:text-5xl font-bold text-dark-900 mb-10">Simple Steps to <br/>Hire Talent</h2>
              <div className="space-y-10">
                {[
                  { step: "01", title: "Submit Your Request", desc: "Fill out the hire form with your event details, location, and artist requirements." },
                  { step: "02", title: "We Match the Best", desc: "Our algorithm and team select the perfect available artist from our curated pool." },
                  { step: "03", title: "Create Magic", desc: "The artist connects with you, confirms details, and delivers an exceptional experience." },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-6 group">
                    <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-brand/5 text-brand group-hover:bg-brand group-hover:text-white transition-all duration-300 flex items-center justify-center font-serif font-bold text-2xl border border-brand/20">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-dark-900 mb-3">{item.title}</h4>
                      <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeInWhenVisible>
          </div>
        </div>
      </div>
    </section>
  );
};

const Reviews = () => {
  return (
    <section id="reviews" className="py-24 bg-brand-light/30 relative overflow-hidden">
      <div className="container mx-auto px-6 mb-12 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-dark-900 mb-4">Client Stories</h2>
        <p className="text-gray-600">See what our partners have to say</p>
      </div>

      <div className="relative w-full overflow-hidden">
        {/* Gradients to hide edges */}
        <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-white/80 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-white/80 to-transparent z-10 pointer-events-none"></div>

        {/* Manual Horizontal Scroll - No Auto Animation */}
        <div className="flex overflow-x-auto gap-6 pb-8 snap-x" 
          style={{
            animation: "scroll-left 20s linear infinite",
            width: "max-content"
          }}>
          {REVIEWS.map((review, idx) => (
            <div 
              key={`${review.id}-${idx}`} 
              className="flex-shrink-0 w-[85vw] md:w-[45vw] snap-center" 
            >
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col justify-between">
                <div>
                  <StarRating rating={review.rating} />
                  <p className="text-gray-600 mb-6 italic text-base leading-relaxed">"{review.text}"</p>
                </div>
                <div className="flex items-center gap-4 pt-4 border-t border-gray-50">
                  <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-brand font-bold text-lg font-serif">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-bold text-dark-900 text-sm">{review.name}</h5>
                    <span className="text-xs text-gray-400 font-bold uppercase">{review.role}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = ({ onNavigate }) => {
  return (
    <footer id="footer" className="bg-dark-900 text-white pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
               <span className="w-8 h-8 rounded-full flex items-center justify-center bg-white text-dark-900 font-serif font-bold">A</span>
               <span className="text-3xl font-serif font-bold text-white">AOD.</span>
            </div>
            <p className="text-gray-400 max-w-md mb-8 leading-relaxed text-lg">
              Artists On Demand is your premier platform for discovering and booking creative talent. 
              We bridge the gap between skilled artists and those who need their vision brought to life.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand transition-colors"><i className="fab fa-facebook-f"></i></a>
              <a href={INSTAGRAM_URL} target="_blank" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand transition-colors"><i className="fab fa-instagram"></i></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand transition-colors"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-8 text-white">Quick Links</h4>
            <ul className="space-y-4 text-gray-400">
              <li><a href="#home"  className="hover:text-brand transition-colors flex items-center gap-2"><i className="fas fa-chevron-right text-xs"></i> Home</a></li>
              <li><a href="#services" className="hover:text-brand transition-colors flex items-center gap-2"><i className="fas fa-chevron-right text-xs"></i> Services</a></li>
              <li><a href="#reviews" className="hover:text-brand transition-colors flex items-center gap-2"><i className="fas fa-chevron-right text-xs"></i> Reviews</a></li>
              <li><button onClick={() => onNavigate('about')} className="hover:text-brand transition-colors flex items-center gap-2"><i className="fas fa-chevron-right text-xs"></i> About Us</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-8 text-white">Contact Us</h4>
            <ul className="space-y-6 text-gray-400">
              <li className="flex items-start gap-4">
                <i className="fas fa-map-marker-alt mt-1.5 text-brand"></i>
                <span>Ahmedabad, India</span>
              </li>
              <li className="flex items-center gap-4">
                <i className="fas fa-phone-alt text-brand"></i>
                <a href={`tel:${PHONE_NUMBER.replace(/\s/g, '')}`} className="hover:text-white transition-colors">{PHONE_NUMBER}</a>
              </li>
              <li className="flex items-center gap-4">
                <i className="fas fa-envelope text-brand"></i>
                <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-white transition-colors decoration-slice">{CONTACT_EMAIL}</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} AOD Artists On Demand.</p>
          <div className="flex gap-8 mt-6 md:mt-0">
            <button onClick={() => onNavigate('privacy')} className="hover:text-white transition-colors">Privacy Policy</button>
            <button onClick={() => onNavigate('terms')} className="hover:text-white transition-colors">Terms of Service</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Modal Forms ---

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl animate-[fadeInUp_0.3s_ease-out]">
        <div className="sticky top-0 bg-white px-8 py-5 border-b flex justify-between items-center z-10">
          <h3 className="text-2xl font-serif font-bold text-dark-900">{title}</h3>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <i className="fas fa-times text-gray-500 text-lg"></i>
          </button>
        </div>
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

const HireForm = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [otherServiceText, setOtherServiceText] = useState("");

  const options = ["Photographer",  "Make-up Artists", "Mehandi Artists", "Musician/Band", "Fine Artist", "Other"];

  const handleCheckboxChange = (option) => {
    setSelectedServices(prev => 
      prev.includes(option) ? prev.filter(item => item !== option) : [...prev, option]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedServices.length === 0) return alert("Please select at least one service.");
    
    setLoading(true);
    const formData = new FormData(e.target);
    const finalServices = selectedServices.map(s => s === "Other" ? `Other: ${otherServiceText}` : s).join(", ");

    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      phoneNumber: formData.get("phone"),
      requiredArtists: finalServices,
      artistNeededFromTime: formData.get("fromTime"),
      artistNeededToTime: formData.get("toTime"),
      location: formData.get("location"),
      eventDetails: formData.get("details")
    };

    await submitToGoogleSheets(payload);
    setLoading(false);
    onClose(); 
    onSuccess("Request Received", "We have received your request. Our team will match you with an artist shortly.");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Name</label>
          <input required name="name" type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-brand focus:border-brand outline-none transition-all" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Phone</label>
          <input required name="phone" type="tel" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-brand focus:border-brand outline-none transition-all" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Email</label>
        <input required name="email" type="email" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-brand focus:border-brand outline-none transition-all" />
      </div>
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">Required Artists</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
          {options.map((option) => (
            <label key={option} className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" checked={selectedServices.includes(option)} onChange={() => handleCheckboxChange(option)} className="w-5 h-5 text-brand rounded" />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
        {selectedServices.includes("Other") && (
          <input type="text" value={otherServiceText} onChange={(e) => setOtherServiceText(e.target.value)} placeholder="Specify..." className="w-full px-4 py-2 rounded-lg border border-gray-300" />
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Start Date & Time</label>
          <input required name="fromTime" type="datetime-local" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-brand focus:border-brand outline-none transition-all" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">End Date & Time</label>
          <input required name="toTime" type="datetime-local" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-brand focus:border-brand outline-none transition-all" />
        </div>
      </div>
      <input required name="location" placeholder="Location" className="w-full px-4 py-3 rounded-lg border" />
      <textarea required name="details" rows={4} className="w-full px-4 py-3 rounded-lg border" placeholder="Event Details"></textarea>
      <button type="submit" disabled={loading} className="w-full py-4 bg-brand text-white font-bold rounded-lg hover:bg-brand-dark transition-all flex justify-center items-center">
        {loading ? <i className="fas fa-spinner fa-spin"></i> : "Submit Request"}
      </button>
    </form>
  );
};

const JoinForm = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [selectedProfessions, setSelectedProfessions] = useState([]);
  const [otherProfessionText, setOtherProfessionText] = useState("");

  const professionOptions = ["Photographer", "Videographer", "Makeup Artist", "Musician/Singer", "Dancer", "Painter/Artist", "Other"];

  const handleCheckboxChange = (option) => {
    setSelectedProfessions(prev => prev.includes(option) ? prev.filter(item => item !== option) : [...prev, option]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedProfessions.length === 0) return alert("Select at least one profession");
    
    setLoading(true);
    const formData = new FormData(e.target);
    const professionString = selectedProfessions.map(p => p === "Other" ? `Other: ${otherProfessionText}` : p).join(", ");

    const payload = {
      name: formData.get("fullName"),
      email: formData.get("email"),
      phoneNumber: formData.get("phone"),
      location: formData.get("location"), 
      requiredArtists: professionString,
      eventDetails: `ARTIST REGISTRATION - City: ${formData.get("city")} | Proficiencies: ${professionString} (${formData.get("experience")} yrs) | Portfolio: ${formData.get("portfolio") || "N/A"} | Bio: ${formData.get("bio")}`
    };

    await submitToGoogleSheets(payload);
    setLoading(false);
    onClose();
    onSuccess("Application Sent", "Thanks for applying to AOD! We will review your profile and contact you.");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6 text-sm text-blue-800">
        <i className="fas fa-info-circle mr-2"></i> Join our network of 500+ verified artists.
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input required name="fullName" placeholder="Full Name" className="w-full px-4 py-3 rounded-lg border" />
        <input required name="phone" type="tel" placeholder="Phone" className="w-full px-4 py-3 rounded-lg border" />
      </div>
      <input required name="email" type="email" placeholder="Email" className="w-full px-4 py-3 rounded-lg border" />
      <div className="space-y-3">
        <label className="text-sm font-medium">Profession</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50 p-4 rounded-lg border">
          {professionOptions.map((option) => (
            <label key={option} className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" checked={selectedProfessions.includes(option)} onChange={() => handleCheckboxChange(option)} className="w-5 h-5 text-brand rounded" />
              <span>{option}</span>
            </label>
          ))}
        </div>
        {selectedProfessions.includes("Other") && <input value={otherProfessionText} onChange={(e) => setOtherProfessionText(e.target.value)} placeholder="Specify..." className="w-full px-4 py-2 border rounded-lg" />}
      </div>
      <input required name="experience" type="number" placeholder="Experience (Years)" className="w-full px-4 py-3 rounded-lg border" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input required name="city" placeholder="City" className="w-full px-4 py-3 rounded-lg border" />
        <input required name="location" placeholder="Location" className="w-full px-4 py-3 rounded-lg border" />
      </div>
      <input name="portfolio" type="url" placeholder="Portfolio Link" className="w-full px-4 py-3 rounded-lg border" />
      <textarea name="bio" rows={3} placeholder="Bio / Skills" className="w-full px-4 py-3 rounded-lg border"></textarea>
      <button type="submit" disabled={loading} className="w-full py-4 bg-brand text-white font-bold rounded-lg hover:bg-brand-dark transition-all flex justify-center items-center">
        {loading ? <i className="fas fa-spinner fa-spin"></i> : "Submit Application"}
      </button>
    </form>
  );
};

// --- Main App ---
const App = () => {
  const [modalType, setModalType] = useState(null);
  const [successData, setSuccessData] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');

  // Fix: Scroll to top whenever page changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const openForm = (type) => setModalType(type);
  const closeForm = () => setModalType(null);

  const handleSuccess = (title, message) => {
    setSuccessData({ title, message });
  };

  const MainContent = () => (
    <main>
      <Hero onOpenForm={openForm} />
      <Stats />
      {/* <Sentence1 /> */}
      <FeatureHighlight />
      <Services />
      <HowItWorks />
      <Reviews />
    </main>
  );

  return (
    <div className="font-sans text-dark-900 bg-white min-h-screen flex flex-col">
      <Navbar onOpenForm={openForm} onNavigate={setCurrentPage} currentPage={currentPage} />
      
      {/* Page Routing */}
      {currentPage === 'home' && <MainContent />}
      {currentPage === 'privacy' && <PrivacyPolicy onBack={() => setCurrentPage('home')} />}
      {currentPage === 'terms' && <TermsOfService onBack={() => setCurrentPage('home')} />}
      {currentPage === 'about' && <AboutUs onBack={() => setCurrentPage('home')} />}

      <Footer onNavigate={setCurrentPage} />

      <CookieConsent />

      <Modal isOpen={modalType === 'HIRE'} onClose={closeForm} title="Hire an Artist">
        <HireForm onClose={closeForm} onSuccess={handleSuccess} />
      </Modal>

      <Modal isOpen={modalType === 'JOIN'} onClose={closeForm} title="Join AOD Team">
        <JoinForm onClose={closeForm} onSuccess={handleSuccess} />
      </Modal>

      <SuccessModal 
        isOpen={!!successData} 
        onClose={() => setSuccessData(null)} 
        title={successData?.title} 
        message={successData?.message} 
      />
    </div>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);