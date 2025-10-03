"use client";

import FormButton from "./FormButton";
import React, { useContext } from "react";
import { ResumeContext } from "../../contexts/ResumeContext";
import EditableFormTitle from './EditableFormTitle';
import { useTodayDate, MIN_DATE } from "../../lib/dateUtils";

const Education = () => {
    const { resumeData, setResumeData} = useContext(ResumeContext);
    const todayDate = useTodayDate();

    const handleEducation = (e, index) => {
      const newEducation = [...resumeData.education];
      newEducation[index][e.target.name] = e.target.value;
      setResumeData({ ...resumeData, education: newEducation });
    };
  
    const addEducation = () => {
      setResumeData({
        ...resumeData,
        education: [
          ...resumeData.education,
          { school: "", degree: "", startYear: "", endYear: "" },
        ],
      });
    };
  
    const removeEducation = (index) => {
      const newEducation = [...resumeData.education];
      newEducation[index] = newEducation[newEducation.length - 1];
      newEducation.pop();
      setResumeData({ ...resumeData, education: newEducation });
    };
    
    return (
      <div className="form-section">
        <div className="form-section-title">
          <EditableFormTitle 
            sectionKey="education" 
            defaultTitle="Education" 
          />
        </div>

        {resumeData.education.map((education, index) => (
          <div key={index} className="section-card">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="label-text">School/Institution</label>
                <input
                  type="text"
                  placeholder="School or University"
                  name="school"
                  className="other-input w-full"
                  value={education.school}
                  onChange={(e) => handleEducation(e, index)}
                />
              </div>
              <div>
                <label className="label-text">Degree/Program</label>
                <input
                  type="text"
                  placeholder="Degree, Field of Study"
                  name="degree"
                  className="other-input w-full"
                  value={education.degree}
                  onChange={(e) => handleEducation(e, index)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label-text">Start Date</label>
                <input
                  type="date"
                  name="startYear"
                  value={education.startYear}
                  onChange={(e) => handleEducation(e, index)}
                  className="other-input w-full"
                  max={todayDate}
                  min={MIN_DATE}
                />
              </div>
              <div>
                <label className="label-text">End Date</label>
                <input
                  type="date"
                  name="endYear"
                  value={education.endYear}
                  onChange={(e) => handleEducation(e, index)}
                  className="other-input w-full"
                  max={todayDate}
                  min={MIN_DATE}
                />
              </div>
            </div>
          </div>
        ))}

        <FormButton 
          size={resumeData.education.length} 
          add={addEducation} 
          remove={removeEducation}
          sectionName="education"
        />
      </div>
    )
  }

export default Education;