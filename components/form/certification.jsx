"use client";

import React, { useContext } from "react";
import { ResumeContext } from "../../contexts/ResumeContext";
import FormButton from "./FormButton";
import EditableFormTitle from './EditableFormTitle';

const Certification = () => {
  const { resumeData, setResumeData } = useContext(ResumeContext);
  const skillType = "certifications";
  const title = "Certifications";

  const handleCertification = (e, index) => {
    const newCertifications = [...resumeData[skillType]];
    newCertifications[index] = {
      ...newCertifications[index],
      [e.target.name]: e.target.value
    };
    setResumeData({ ...resumeData, [skillType]: newCertifications });
  };

  const addCertification = () => {
    setResumeData({
      ...resumeData,
      [skillType]: [
        ...resumeData[skillType],
        { name: "", issuer: "", link: "" }
      ]
    });
  };

  const removeCertification = () => {
    const newCertifications = [...resumeData[skillType]];
    newCertifications.pop();
    setResumeData({ ...resumeData, [skillType]: newCertifications });
  };

  return (
    <div className="form-section">
      <div className="form-section-title">
        <EditableFormTitle 
          sectionKey="certifications" 
          defaultTitle={title} 
        />
      </div>

      {resumeData[skillType].map((certification, index) => (
        <div key={index} className="section-card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="label-text">Certificate Name</label>
              <input
                type="text"
                placeholder="e.g., AWS Certified Solutions Architect"
                name="name"
                className="other-input w-full"
                value={certification.name}
                onChange={(e) => handleCertification(e, index)}
              />
            </div>
            <div>
              <label className="label-text">Provider/Issuer</label>
              <input
                type="text"
                placeholder="e.g., Amazon Web Services"
                name="issuer"
                className="other-input w-full"
                value={certification.issuer}
                onChange={(e) => handleCertification(e, index)}
              />
            </div>
          </div>

          <div>
            <label className="label-text">Verification Link (Optional)</label>
            <input
              type="url"
              placeholder="https://www.credly.com/badges/your-badge"
              name="link"
              className="other-input w-full"
              value={certification.link || ""}
              onChange={(e) => handleCertification(e, index)}
              pattern="https?://.+"
              title="Please enter a valid URL starting with http:// or https://"
            />
          </div>
        </div>
      ))}

      <FormButton 
        size={resumeData[skillType].length} 
        add={addCertification} 
        remove={removeCertification}
        sectionName="certification"
      />
    </div>
  );
};

export default Certification;