import { createContext } from "react";
import DefaultResumeData from "../components/utility/DefaultResumeData";
import type { ResumeData, ResumeContextType } from "../app/types/resume";

const ResumeContext = createContext<ResumeContextType>({
  resumeData: DefaultResumeData as ResumeData,
  setResumeData: () => {},
  handleProfilePicture: () => {},
  handleChange: () => {},
  saveVersion: () => {},
  listVersions: () => [],
  restoreVersion: () => {},
  darkMode: false,
  toggleDarkMode: () => {},
});

export { ResumeContext };
export default ResumeContext;