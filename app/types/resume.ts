export interface ResumeData {
  name: string;
  position: string;
  contactInformation: string;
  email: string;
  address: string;
  profilePicture: string;
  socialMedia: {
    socialMedia: string;
    link: string;
  }[];
  summary: string;
  education: {
    school: string;
    degree: string;
    startYear: string;
    endYear: string;
  }[];
  workExperience: {
    company: string;
    position: string;
    description: string;
    keyAchievements: string;
    startYear: string;
    endYear: string;
  }[];
  projects: {
    name: string;
    description: string;
    keyAchievements: string;
    startYear: string;
    endYear: string;
    link: string;
  }[];
  skills: {
    title: string;
    skills: string[];
  }[];
  languages: string[];
  certifications: {
    name: string;
    issuer: string;
  }[];
}

export interface ResumeContextType {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
  handleProfilePicture: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  saveResume?: () => Promise<void>;
  isSaving?: boolean;
}
