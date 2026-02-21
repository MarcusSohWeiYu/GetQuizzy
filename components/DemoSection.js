"use client";

import { useRef, useEffect, useState } from "react";

const DemoSection = () => {
  const [playingVideos, setPlayingVideos] = useState({});
  const sectionRef = useRef(null);
  const videoRefs = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.demo-animate').forEach((el, index) => {
              setTimeout(() => {
                el.classList.add('animate-fadeInUp');
              }, index * 100);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const demos = [
    {
      id: 1,
      title: "Survey Experience",
      description: "Create engaging surveys with beautiful UI and smooth transitions. Watch how respondents experience your customized surveys.",
      videoUrl: "/demo/survey-experience.mp4",
      thumbnail: "/demo/thumbnail/survey-experience.png",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-500/10 to-pink-500/10"
    },
    {
      id: 2,
      title: "Easy Survey Builder",
      description: "Build surveys in minutes with our intuitive drag-and-drop interface. Add questions, customize options, and configure everything effortlessly.",
      videoUrl: "/demo/survey-builder-demo.mp4",
      thumbnail: "/demo/thumbnail/survey-builder.png",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10"
    },
    {
      id: 3,
      title: "Result Experience Builder",
      description: "Design unforgettable endings with AI avatars, discount codes, custom messages & more. Drag and drop to create the perfect reward experience.",
      videoUrl: "/demo/result-builder.mp4",
      thumbnail: "/demo/thumbnail/result-builder.png",
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-500/10 to-red-500/10"
    },
    {
      id: 4,
      title: "Survey Dashboard & Responses",
      description: "Track all your responses in one place. View detailed analytics, individual submissions, and export data with ease.",
      videoUrl: "/demo/dashboard-overview.mp4",
      thumbnail: "/demo/thumbnail/dashboard-overview.png",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-500/10 to-emerald-500/10"
    }
  ];

  const handlePlayVideo = (demoId) => {
    const video = videoRefs.current[demoId];
    if (video) {
      video.play();
      setPlayingVideos(prev => ({ ...prev, [demoId]: true }));
    }
  };

  const handleVideoPlay = (demoId) => {
    setPlayingVideos(prev => ({ ...prev, [demoId]: true }));
  };

  const handleVideoPause = (demoId) => {
    setPlayingVideos(prev => ({ ...prev, [demoId]: false }));
  };

  return (
    <section
      ref={sectionRef}
      className="relative max-w-7xl mx-auto px-6 py-16 lg:py-24"
    >
      {/* Floating background elements */}
      <div className="absolute -inset-40 pointer-events-none -z-10">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="text-center mb-12 lg:mb-16 space-y-4">
        <div className="demo-animate inline-flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-300 text-xs font-semibold mb-4">
          FEATURES
        </div>
        <h2 className="demo-animate font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight text-white">
          See GetQuizzy in{" "}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 text-transparent bg-clip-text">
            Action
          </span>
        </h2>
        <p className="demo-animate text-base lg:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Explore how GetQuizzy transforms the survey experience from creation to completion
        </p>
      </div>

      {/* Demo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {demos.map((demo, index) => (
          <div
            key={demo.id}
            className="demo-animate group relative"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Card */}
            <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all duration-300 h-full flex flex-col">
              {/* Gradient glow on hover */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${demo.gradient} rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-300 -z-10`}></div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white mb-3">
                {demo.title}
              </h3>

              {/* Description */}
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                {demo.description}
              </p>

              {/* Video Player */}
              <div className="relative bg-black rounded-xl overflow-hidden aspect-video mt-auto group/video">
                <video
                  ref={(el) => videoRefs.current[demo.id] = el}
                  className="w-full h-full"
                  controls
                  preload="metadata"
                  poster={demo.thumbnail}
                  src={demo.videoUrl}
                  onPlay={() => handleVideoPlay(demo.id)}
                  onPause={() => handleVideoPause(demo.id)}
                >
                  Your browser does not support the video tag.
                </video>

                {/* Custom Play Button Overlay - only show when not playing */}
                {!playingVideos[demo.id] && (
                  <div 
                    onClick={() => handlePlayVideo(demo.id)}
                    className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/20 hover:bg-black/30 transition-colors duration-200"
                  >
                    <div className="relative">
                      {/* Pulsing background */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${demo.gradient} rounded-full blur-xl opacity-50 group-hover/video:opacity-75 transition-opacity duration-300 animate-pulse-slow`}></div>
                      
                      {/* Play button */}
                      <div className={`relative w-16 h-16 bg-gradient-to-r ${demo.gradient} rounded-full flex items-center justify-center shadow-2xl group-hover/video:scale-110 transition-transform duration-300`}>
                        <svg 
                          className="w-7 h-7 text-white ml-1" 
                          fill="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DemoSection;
