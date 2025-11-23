"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import LogoutLoader from "@/components/auth/LogoutLoader";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import toast from "react-hot-toast";
import { useAutoSave } from "@/lib/useAutoSave";
import SavingIndicator from "@/components/ui/SavingIndicator";

// Import your existing builder components
import Language from "@/components/form/Language";
import LoadUnload from "@/components/form/LoadUnload";
import Preview from "@/components/preview/Preview";
import DefaultResumeData from "@/components/utility/DefaultResumeData";
import SocialMedia from "@/components/form/SocialMedia";
import WorkExperience from "@/components/form/WorkExperience";
import Skill from "@/components/form/Skill";
import PersonalInformation from "@/components/form/PersonalInformation";
import Summary from "@/components/form/Summary";
import Projects from "@/components/form/Projects";
import Education from "@/components/form/Education";
import Certification from "@/components/form/certification";
import Award from "@/components/form/Award"; 
import EditableFormTitle from "../../../components/form/EditableFormTitle";
import { SectionTitleProvider } from "@/contexts/SectionTitleContext";
import { ResumeContext } from "@/contexts/ResumeContext";
import Squares from "@/components/ui/Squares";
import type { ResumeData } from "../../types/resume";
import { FaChevronUp, FaOctopusDeploy, FaCog } from "react-icons/fa";
import MobileNavbar from "@/components/ui/MobileNavbar";
import MobileBottomNav from "@/components/ui/MobileBottomNav";
import FormSkeleton from "@/components/ui/FormSkeleton";
import PreviewSkeleton from "@/components/ui/PreviewSkeleton";
import LazySection from "@/components/ui/LazySection";
import ProfileModal from "@/components/ui/ProfileModal";

// server side rendering false
const Print = dynamic(() => import("@/components/utility/WinPrint"), {
  ssr: false,
});

export default function BuilderPage() {
  // Get user session data
  const { data: session } = useSession();
  
  // Get resume ID from URL params
  const params = useParams();
  const resumeId = params?.id as string;

  // Get user from Convex by email - memoized to prevent unnecessary queries
  const convexUser = useQuery(
    api.auth.getUserByEmail,
    session?.user?.email ? { email: session.user.email } : "skip"
  );

  // Get specific resume from database if editing - only once on mount
  const [shouldFetchResume, setShouldFetchResume] = useState(true);
  const existingResume = useQuery(
    api.resume.getResume,
    shouldFetchResume && resumeId ? { id: resumeId } : "skip"
  );

  // Convex mutation for upserting resume (create or update)
  const upsertResumeMutation = useMutation(api.resume.upsertResume);

  // Resume data state with localStorage persistence (hydration-safe)
  const [resumeData, setResumeData] = useState<ResumeData>(
    JSON.parse(JSON.stringify(DefaultResumeData)) as ResumeData
  );
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isLoadingFromDB, setIsLoadingFromDB] = useState(false);

  // Load resume data from database if editing existing resume - only once
  useEffect(() => {
    if (existingResume && existingResume.resume_data && !isLoadingFromDB) {
      setIsLoadingFromDB(true);
      setShouldFetchResume(false); // Stop querying after first load
      try {
        const dbResumeData = JSON.parse(existingResume.resume_data);
        // Merge with default data to ensure all fields exist
        const migratedData = {
          ...JSON.parse(JSON.stringify(DefaultResumeData)),
          ...dbResumeData,
          education: dbResumeData.education || DefaultResumeData.education,
          workExperience: dbResumeData.workExperience || DefaultResumeData.workExperience,
          projects: dbResumeData.projects || DefaultResumeData.projects,
          skills: dbResumeData.skills || DefaultResumeData.skills,
          certifications: dbResumeData.certifications || DefaultResumeData.certifications,
          languages: dbResumeData.languages || DefaultResumeData.languages,
          socialMedia: dbResumeData.socialMedia || DefaultResumeData.socialMedia,
        };
        setResumeData(migratedData as ResumeData);
        // Also save to localStorage for persistence
        localStorage.setItem("resumeData", JSON.stringify(migratedData));
      } catch (error) {
        console.error("Failed to load resume from database:", error);
      }
    }
  }, [existingResume, isLoadingFromDB]);

  // Load from localStorage after hydration to prevent mismatches (only for new resumes)
  useEffect(() => {
    // Only load from localStorage if not editing an existing resume
    if (!existingResume) {
      const savedData = localStorage.getItem("resumeData");
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          
          // Merge saved data with default data to ensure all new fields exist
          const migratedData = {
            ...JSON.parse(JSON.stringify(DefaultResumeData)),
            ...parsedData,
            // Ensure arrays are properly merged (keep saved data if it exists)
            education: parsedData.education || DefaultResumeData.education,
            workExperience: parsedData.workExperience || DefaultResumeData.workExperience,
            projects: parsedData.projects || DefaultResumeData.projects,
            skills: parsedData.skills || DefaultResumeData.skills,
            certifications: parsedData.certifications || DefaultResumeData.certifications,
            languages: parsedData.languages || DefaultResumeData.languages,
            socialMedia: parsedData.socialMedia || DefaultResumeData.socialMedia,
          };
          
          setResumeData(migratedData as ResumeData);
        } catch (error) {
          console.warn("Failed to parse saved resume data:", error);
          // If parsing fails, use default data (deep copy)
          setResumeData(JSON.parse(JSON.stringify(DefaultResumeData)) as ResumeData);
        }
      } else {
        // If no saved data, ensure we're using default data (deep copy)
        setResumeData(JSON.parse(JSON.stringify(DefaultResumeData)) as ResumeData);
      }
    }
    setIsHydrated(true);
  }, [existingResume]);

  // Logout loading state
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Save to localStorage whenever resumeData changes (only after hydration)
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("resumeData", JSON.stringify(resumeData));
    }
  }, [resumeData, isHydrated]);

  // Handle logout with loading state
  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({ callbackUrl: "/" });
    } catch {
      // Handle any errors
    } finally {
      // The page will redirect, so we don't need to set loading to false
    }
  };

  // Form hide/show
  const [formClose, setFormClose] = useState(false);

  // Mobile view state - "edit" or "preview"
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Handle mobile view change with smooth transition
  const handleMobileViewChange = (view: "edit" | "preview") => {
    if (view === mobileView || isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Add fade transition
    requestAnimationFrame(() => {
      setMobileView(view);
      
      // Reset transition state after animation completes
      setTimeout(() => {
        setIsTransitioning(false);
        // Scroll to top on view change for better UX
        window.scrollTo({ top: 0, behavior: "instant" });
      }, 200);
    });
  };

  // Profile picture handler
  const handleProfilePicture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file instanceof Blob) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setResumeData({
          ...resumeData,
          profilePicture: event.target?.result as string,
        });
      };
      reader.readAsDataURL(file);
    } else {
      // Invalid file type
    }
  };

  // Change handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setResumeData({ ...resumeData, [e.target.name]: e.target.value });
  };

  // Save resume to database
  // Auto-save (not significant - won't show in profile)
  const autoSaveResume = async () => {
    // Don't save if not hydrated
    if (!isHydrated) return;
    
    // Check if user is logged in
    if (!session?.user?.email) {
      return; // Silent fail for auto-save
    }

    // Check if convex user is loaded
    if (!convexUser || !convexUser._id) {
      return; // Silent fail for auto-save
    }

    try {
      // Convert resume data to JSON string
      const resumeDataString = JSON.stringify(resumeData);
      
      // Call the Convex upsert mutation - mark as auto-save only
      await upsertResumeMutation({
        resume_id: resumeId,
        resume_data: resumeDataString,
        owner: convexUser._id,
        isSignificantSave: false, // Auto-save, won't show in profile
      });
    } catch (error) {
      console.error("Failed to auto-save resume:", error);
      throw error; // Let auto-save handle the error
    }
  };

  // Manual save or save on close (significant - will show in profile)
  const saveResumeManually = async () => {
    // Don't save if not hydrated
    if (!isHydrated) return;
    
    // Check if user is logged in
    if (!session?.user?.email) {
      toast.error("Please sign in to save your resume");
      return;
    }

    // Check if convex user is loaded
    if (!convexUser || !convexUser._id) {
      toast.error("Loading user data... Please try again.");
      return;
    }

    try {
      // Convert resume data to JSON string
      const resumeDataString = JSON.stringify(resumeData);
      
      // Call the Convex upsert mutation - mark as significant save
      await upsertResumeMutation({
        resume_id: resumeId,
        resume_data: resumeDataString,
        owner: convexUser._id,
        isSignificantSave: true, // Manual save, will show in profile
      });
      
      toast.success("Resume saved successfully!");
    } catch (error) {
      console.error("Failed to save resume:", error);
      toast.error("Failed to save resume. Please try again.");
      throw error;
    }
  };

  // Auto-save hook with activity tracking and debouncing
  const autoSaveState = useAutoSave({
    onSave: autoSaveResume, // Use auto-save function
    data: resumeData,
    interval: 60000, // 1 minute
    debounceDelay: 2000, // 2 seconds after user stops typing
    enabled: isHydrated && !!session?.user?.email && !!convexUser?._id,
  });

  // Save on window close (significant save)
  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (isHydrated && session?.user?.email && convexUser?._id) {
        // Save as significant on close
        try {
          await upsertResumeMutation({
            resume_id: resumeId,
            resume_data: JSON.stringify(resumeData),
            owner: convexUser._id,
            isSignificantSave: true, // Mark as significant on close
          });
        } catch (error) {
          console.error("Failed to save on close:", error);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isHydrated, session, convexUser, resumeId, resumeData, upsertResumeMutation]);

  // Keyboard shortcut for sidebar toggle (Ctrl+B or Cmd+B)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl+B (Windows/Linux) or Cmd+B (Mac)
      if ((event.ctrlKey || event.metaKey) && event.key === "b") {
        event.preventDefault();
        // Keyboard shortcut triggered
        setFormClose((prev) => !prev);
      }
    };

    // Add event listener
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []); // No dependencies needed since we use functional setState
  const divRef = useRef(null);
  const scrollToTop = () => {
    if (divRef.current) {
      //@ts-ignore
      divRef.current.scrollTo({
        top: 0,
        behavior: "smooth", // smooth scrolling
      });
    }
  };

  // Render the main builder interface (unprotected)
  return (
    <>
      <SectionTitleProvider>
        <ResumeContext.Provider
          value={{
            resumeData,
            setResumeData,
            handleProfilePicture,
            handleChange,
            saveResume: saveResumeManually, // Manual save for buttons
            isSaving: autoSaveState.isSaving,
          }}
        >
          <MobileNavbar 
            onSettingsClick={() => setShowProfileModal(true)}
            isSaving={autoSaveState.isSaving}
            lastSaved={autoSaveState.lastSaved}
          />

          <MobileBottomNav
            activeView={mobileView}
            onViewChange={handleMobileViewChange}
          />

          <div className='flex flex-col lg:flex-row h-screen max-w-full overflow-hidden pt-[60px] lg:pt-0 pb-[73px] lg:pb-0 relative print:!h-auto print:!pt-0 print:!pb-0 print:!overflow-visible'>
            {!formClose && (
              <div
                className={`w-full lg:w-[45%] xl:w-[40%] exclude-print transition-opacity duration-200 lg:relative print:!hidden ${
                  mobileView === "edit" ? "block opacity-100 relative z-10" : "absolute inset-0 opacity-0 pointer-events-none lg:block lg:relative lg:opacity-100 lg:pointer-events-auto lg:z-auto"
                } h-full`}
                style={{ 
                  backgroundColor: "hsl(240 10% 3.9%)",
                }}
              >
                <div className='absolute inset-0 w-full h-full z-0 hidden lg:block overflow-hidden pointer-events-none'>
                  <Squares
                    speed={0.3}
                    squareSize={30}
                    direction='diagonal'
                    borderColor='rgba(236, 72, 153, 0.15)'
                    hoverFillColor='rgba(236, 72, 153, 0.1)'
                  />
                </div>
                <div
                  ref={divRef}
                  className='h-full w-full border-r relative z-10 overflow-y-scroll overflow-x-hidden'
                  style={{ 
                    borderColor: "hsl(240 3.7% 15.9%)",
                    backgroundColor: "hsl(240 10% 3.9%)",
                    WebkitOverflowScrolling: 'touch',
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(236, 72, 153, 0.3) transparent',
                    willChange: 'scroll-position',
                    transform: 'translateZ(0)',
                  }}
                >
                  {!isHydrated ? (
                    <FormSkeleton />
                  ) : (
                    <div className='p-2.5 sm:p-4 lg:p-5 relative z-20 lg:backdrop-blur-[1.5px]' style={{ minHeight: '100%' }}>
                      {/* Header with Logo and Settings */}
                      <div className='hidden lg:flex items-center justify-between mb-6 py-3'>
                        {/* Left side - Profocto Logo */}
                        <div className='flex gap-2 items-center'>
                          <FaOctopusDeploy className='text-pink-500 size-7' />
                          <h1 className='text-2xl text-gray-200 font-bold tracking-wide'>
                            Profocto
                          </h1>
                        </div>
                        
                        {/* Center - Saving Indicator */}
                        <SavingIndicator 
                          isSaving={autoSaveState.isSaving}
                          lastSaved={autoSaveState.lastSaved}
                        />
                        
                        {/* Right side - Settings Icon */}
                        <button 
                          onClick={() => setShowProfileModal(true)}
                          className='p-2 rounded-lg hover:bg-gray-800/50 transition-colors'
                          aria-label='Settings'
                        >
                          <FaCog className='text-gray-400 hover:text-pink-500 size-5 transition-colors' />
                        </button>
                      </div>

                      <div className='space-y-2.5 lg:space-y-6'>
                      <LazySection height="200px">
                        <LoadUnload />
                      </LazySection>
                      <LazySection height="350px">
                        <PersonalInformation />
                      </LazySection>
                      <LazySection height="250px">
                        <SocialMedia />
                      </LazySection>
                      <LazySection height="200px">
                        <Summary />
                      </LazySection>
                      <LazySection height="300px">
                        <Education />
                      </LazySection>
                      <LazySection height="350px">
                        <WorkExperience />
                      </LazySection>
                      <LazySection height="350px">
                        <Projects />
                      </LazySection>

                      <LazySection height="300px">
                        <div className='form-section'>
                          <EditableFormTitle
                            sectionKey='skills'
                            defaultTitle='Technical Skills'
                            className='input-title'
                          />
                          <div className='space-y-4'>
                            {resumeData.skills
                              .filter(
                                (skill: { title: string; skills: string[] }) =>
                                  skill.title !== "Soft Skills"
                              )
                              .map(
                                (
                                  skill: { title: string; skills: string[] },
                                  index: number
                                ) => (
                                  <Skill title={skill.title} key={index} />
                                )
                              )}
                          </div>
                        </div>
                      </LazySection>

                      <LazySection height="200px">
                        {resumeData.skills
                          .filter(
                            (skill: { title: string; skills: string[] }) =>
                              skill.title === "Soft Skills"
                          )
                          .map(
                            (
                              skill: { title: string; skills: string[] },
                              index: number
                            ) => (
                              <Skill title={skill.title} key={index} />
                            )
                          )}
                      </LazySection>

                      <LazySection height="200px">
                        <Language />
                      </LazySection>
                      <LazySection height="300px">
                        <Certification />
                      </LazySection>
                      <LazySection height="300px">
                        <Award />
                      </LazySection> 
                    </div>

                    <div className='hidden lg:block relative lg:sticky bottom-0 left-0 right-0 p-4 z-10 mt-6'>
                      <div
                        className='relative p-4 rounded-xl border backdrop-blur-sm'
                        style={{
                          backgroundColor: "hsla(240, 10%, 3.9%, 0.95)",
                          borderColor: "hsl(240 3.7% 25%)",
                          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
                        }}
                      >
                        <div
                          className='absolute -top-1 left-4 right-4 h-2 rounded-b-lg opacity-60'
                          style={{ backgroundColor: "hsl(240 3.7% 20%)" }}
                        ></div>
                        <div
                          className='absolute -top-0.5 left-6 right-6 h-1 rounded-b-lg opacity-40'
                          style={{ backgroundColor: "hsl(240 3.7% 25%)" }}
                        ></div>
                        <div className='absolute inset-0 rounded-xl border border-pink-500/20 animate-pulse'></div>

                        <div className='flex items-center space-x-3'>
                          <div className='relative'>
                            <div
                              className='w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-lg ring-2 ring-pink-500/30 overflow-hidden'
                              style={{
                                background:
                                  "linear-gradient(135deg, hsl(322, 84%, 60%) 0%, hsl(270, 84%, 60%) 100%)",
                              }}
                            >
                              {session?.user?.image ? (
                                <Image
                                  src={session.user.image}
                                  alt={session.user.name || "User"}
                                  width={50}
                                  height={40}
                                  className='w-full h-full rounded-full object-cover'
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = "none";
                                  }}
                                />
                              ) : (
                                <div className='w-full h-full flex items-center justify-center text-white text-xl font-bold'>
                                  {session?.user?.name
                                    ?.charAt(0)
                                    .toUpperCase() || "U"}
                                </div>
                              )}
                            </div>
                            <div
                              className='absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 animate-pulse'
                              style={{ borderColor: "hsl(240 10% 3.9%)" }}
                            ></div>
                          </div>

                          <div className='flex-1 min-w-0'>
                            <p
                              className='text-sm font-medium truncate'
                              style={{ color: "hsl(0 0% 98%)" }}
                            >
                              {session?.user?.name || "User"}
                            </p>
                            <p
                              className='text-xs truncate'
                              style={{ color: "hsl(240 5% 64.9%)" }}
                            >
                              {session?.user?.email || "Resume Builder"}
                            </p>
                          </div>

                          <div className='flex items-center space-x-2 relative z-50'>
                            <button
                              onClick={handleSignOut}
                              disabled={isLoggingOut}
                              className='p-2 rounded-lg transition-all duration-200 hover:scale-105 group cursor-pointer relative z-50 disabled:opacity-50 disabled:cursor-not-allowed'
                              style={{
                                backgroundColor: "hsl(240 3.7% 20%)",
                                border: "1px solid rgba(236, 72, 153, 0.2)",
                                pointerEvents: "auto",
                              }}
                              title={isLoggingOut ? "Signing out..." : "Logout"}
                              type='button'
                            >
                              <svg
                                className='w-4 h-4 transition-colors group-hover:text-pink-400 pointer-events-none'
                                style={{ color: "hsl(240 5% 64.9%)" }}
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={2}
                                  d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                                />
                              </svg>
                            </button>
                            <button
                              className='absolute   border-pink-500/40 border-[1.7px]  bg-black rounded-full z-[9999] text-white -translate-y-16 bottom-0 mt-3 p-2 right-0 text-xs '
                              onClick={scrollToTop}
                            >
                              {" "}
                              <FaChevronUp />
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setFormClose(true);
                              }}
                              className='p-2 rounded-lg transition-all duration-200 hover:scale-105 group cursor-pointer relative z-50'
                              style={{
                                backgroundColor: "hsl(240 3.7% 20%)",
                                border: "1px solid rgba(236, 72, 153, 0.2)",
                                pointerEvents: "auto",
                              }}
                              title='Hide Sidebar'
                              type='button'
                            >
                              <svg
                                className='w-4 h-4 transition-colors group-hover:text-pink-400 pointer-events-none'
                                style={{ color: "hsl(240 5% 64.9%)" }}
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={2}
                                  d='M11 19l-7-7 7-7m8 14l-7-7 7-7'
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  )}
                </div>
              </div>
            )}

            {formClose && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setFormClose(false);
                }}
                className='fixed top-4 left-4 p-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-white cursor-pointer shadow-lg transition-all duration-200 hover:scale-105'
                title='Show Sidebar'
                style={{ zIndex: 9999, pointerEvents: "auto" }}
                type='button'
              >
                <svg
                  width='20'
                  height='20'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                  className='text-white pointer-events-none'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M13 17l5-5-5-5M6 17l5-5-5-5'
                  />
                </svg>
              </button>
            )}

            <div
              className={`${
                formClose ? "w-full" : "w-full lg:w-[55%] xl:w-[60%]"
              } ${
                mobileView === "preview" ? "block opacity-100 relative z-10" : "absolute inset-0 opacity-0 pointer-events-none lg:block lg:relative lg:opacity-100 lg:pointer-events-auto lg:z-auto"
              } transition-opacity duration-200 h-auto lg:min-h-screen print:!block print:!opacity-100 print:!static print:!w-full print:!min-h-0`}
            >
              <Preview />
            </div>
          </div>
          <Print mobileView={mobileView} />
        </ResumeContext.Provider>
      </SectionTitleProvider>

      <LogoutLoader isVisible={isLoggingOut} />
      
      {/* Profile Modal */}
      <ProfileModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
      />
    </>
  );
}
