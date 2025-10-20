/**
 * Resume Analytics Component
 * 
 * Provides insights and analytics for user resumes including:
 * - Profile completion percentage
 * - Section strength analysis
 * - Recommendations for improvement
 * - Skills gap analysis
 * - ATS (Applicant Tracking System) score
 * 
 * @component
 * @example
 * <ResumeAnalytics resumeData={userData} />
 */

"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaChartLine, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaInfoCircle,
  FaLightbulb,
  FaTrophy,
  FaClipboardCheck
} from 'react-icons/fa';

interface ResumeSection {
  name: string;
  completed: boolean;
  items: number;
  required: boolean;
  weight: number;
}

interface AnalyticsScore {
  overall: number;
  sections: {
    personalInfo: number;
    experience: number;
    education: number;
    skills: number;
    projects: number;
  };
}

interface Recommendation {
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  action: string;
}

interface ResumeAnalyticsProps {
  resumeData: any;
  onSectionClick?: (section: string) => void;
}

export const ResumeAnalytics: React.FC<ResumeAnalyticsProps> = ({
  resumeData,
  onSectionClick
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'recommendations' | 'ats'>('overview');

  // Calculate completion percentage
  const completionScore = useMemo(() => {
    const sections: ResumeSection[] = [
      {
        name: 'Personal Information',
        completed: !!(resumeData?.name && resumeData?.email && resumeData?.phone),
        items: [resumeData?.name, resumeData?.email, resumeData?.phone, resumeData?.location].filter(Boolean).length,
        required: true,
        weight: 20
      },
      {
        name: 'Professional Summary',
        completed: !!(resumeData?.summary && resumeData.summary.length > 50),
        items: resumeData?.summary ? 1 : 0,
        required: true,
        weight: 15
      },
      {
        name: 'Work Experience',
        completed: !!(resumeData?.experience && resumeData.experience.length > 0),
        items: resumeData?.experience?.length || 0,
        required: true,
        weight: 25
      },
      {
        name: 'Education',
        completed: !!(resumeData?.education && resumeData.education.length > 0),
        items: resumeData?.education?.length || 0,
        required: true,
        weight: 15
      },
      {
        name: 'Skills',
        completed: !!(resumeData?.skills && resumeData.skills.length >= 5),
        items: resumeData?.skills?.length || 0,
        required: true,
        weight: 15
      },
      {
        name: 'Projects',
        completed: !!(resumeData?.projects && resumeData.projects.length > 0),
        items: resumeData?.projects?.length || 0,
        required: false,
        weight: 10
      }
    ];

    const totalWeight = sections.reduce((sum, s) => sum + s.weight, 0);
    const completedWeight = sections
      .filter(s => s.completed)
      .reduce((sum, s) => sum + s.weight, 0);

    return {
      percentage: Math.round((completedWeight / totalWeight) * 100),
      sections,
      completedSections: sections.filter(s => s.completed).length,
      totalSections: sections.length
    };
  }, [resumeData]);

  // Generate recommendations
  const recommendations = useMemo((): Recommendation[] => {
    const recs: Recommendation[] = [];

    // Check personal info
    if (!resumeData?.name || !resumeData?.email) {
      recs.push({
        type: 'critical',
        title: 'Missing Contact Information',
        description: 'Your name and email are essential for recruiters to contact you.',
        action: 'Add your name and email in the Personal Info section'
      });
    }

    // Check summary
    if (!resumeData?.summary || resumeData.summary.length < 50) {
      recs.push({
        type: 'warning',
        title: 'Weak Professional Summary',
        description: 'A compelling summary helps you stand out. Aim for 100-150 words.',
        action: 'Write a strong professional summary highlighting your key strengths'
      });
    }

    // Check experience
    if (!resumeData?.experience || resumeData.experience.length === 0) {
      recs.push({
        type: 'critical',
        title: 'No Work Experience',
        description: 'Work experience is crucial for most job applications.',
        action: 'Add your work experience with quantifiable achievements'
      });
    } else if (resumeData.experience.length < 2) {
      recs.push({
        type: 'info',
        title: 'Limited Work Experience',
        description: 'Consider adding internships or relevant projects.',
        action: 'Add more experiences or focus on projects'
      });
    }

    // Check skills
    if (!resumeData?.skills || resumeData.skills.length < 5) {
      recs.push({
        type: 'warning',
        title: 'Insufficient Skills Listed',
        description: 'List at least 5-10 relevant skills to improve your profile.',
        action: 'Add technical and soft skills relevant to your field'
      });
    }

    // Check projects
    if (!resumeData?.projects || resumeData.projects.length === 0) {
      recs.push({
        type: 'info',
        title: 'No Projects Listed',
        description: 'Projects demonstrate practical application of your skills.',
        action: 'Add personal or professional projects to showcase your abilities'
      });
    }

    // Check for quantifiable achievements
    const hasNumbers = resumeData?.experience?.some((exp: any) => 
      /\d+%|\d+\+|\$\d+|\d+ (users|customers|projects|people)/i.test(exp.description || '')
    );

    if (!hasNumbers) {
      recs.push({
        type: 'info',
        title: 'Add Quantifiable Achievements',
        description: 'Numbers make your accomplishments more impactful (e.g., "Increased sales by 30%").',
        action: 'Use metrics and numbers to demonstrate your impact'
      });
    }

    return recs;
  }, [resumeData]);

  // Calculate ATS score
  const atsScore = useMemo(() => {
    let score = 0;
    const maxScore = 100;

    // Contact information (20 points)
    if (resumeData?.email) score += 10;
    if (resumeData?.phone) score += 10;

    // Professional summary (15 points)
    if (resumeData?.summary && resumeData.summary.length > 50) score += 15;

    // Work experience (25 points)
    const expCount = resumeData?.experience?.length || 0;
    score += Math.min(expCount * 8, 25);

    // Education (15 points)
    if (resumeData?.education && resumeData.education.length > 0) score += 15;

    // Skills (15 points)
    const skillCount = resumeData?.skills?.length || 0;
    score += Math.min(skillCount * 3, 15);

    // Keywords and formatting (10 points)
    const hasStrongVerbs = resumeData?.experience?.some((exp: any) =>
      /(achieved|improved|increased|reduced|developed|led|managed|created)/i.test(exp.description || '')
    );
    if (hasStrongVerbs) score += 5;

    const hasMetrics = resumeData?.experience?.some((exp: any) =>
      /\d+%|\d+\+/i.test(exp.description || '')
    );
    if (hasMetrics) score += 5;

    return Math.min(score, maxScore);
  }, [resumeData]);

  // Get score color
  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  // Get recommendation icon
  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <FaExclamationTriangle className="text-red-500" />;
      case 'warning':
        return <FaInfoCircle className="text-yellow-500" />;
      default:
        return <FaLightbulb className="text-blue-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FaChartLine className="text-2xl text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Resume Analytics
          </h2>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-500 hover:text-blue-600 font-medium"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Completion Score */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-300 font-medium">
                Completion
              </p>
              <p className={`text-3xl font-bold ${getScoreColor(completionScore.percentage)}`}>
                {completionScore.percentage}%
              </p>
            </div>
            <FaCheckCircle className="text-4xl text-blue-500 opacity-50" />
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionScore.percentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-blue-500 h-2 rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* ATS Score */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 dark:text-green-300 font-medium">
                ATS Score
              </p>
              <p className={`text-3xl font-bold ${getScoreColor(atsScore)}`}>
                {atsScore}/100
              </p>
            </div>
            <FaClipboardCheck className="text-4xl text-green-500 opacity-50" />
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
            Applicant Tracking System compatibility
          </p>
        </motion.div>

        {/* Issues */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 dark:text-purple-300 font-medium">
                Recommendations
              </p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-300">
                {recommendations.length}
              </p>
            </div>
            <FaTrophy className="text-4xl text-purple-500 opacity-50" />
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
            Ways to improve your resume
          </p>
        </motion.div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Tabs */}
            <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700 mb-6">
              {(['overview', 'recommendations', 'ats'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 px-4 font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? 'text-blue-500 border-b-2 border-blue-500'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    Section Breakdown
                  </h3>
                  {completionScore.sections.map((section, index) => (
                    <motion.div
                      key={section.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        {section.completed ? (
                          <FaCheckCircle className="text-green-500 text-xl" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                        )}
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">
                            {section.name}
                            {section.required && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {section.items} item{section.items !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${section.completed ? 'text-green-500' : 'text-gray-400'}`}>
                          {section.completed ? section.weight : 0}/{section.weight}
                        </p>
                        <p className="text-xs text-gray-500">points</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'recommendations' && (
                <motion.div
                  key="recommendations"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    Improvement Suggestions
                  </h3>
                  {recommendations.length === 0 ? (
                    <div className="text-center py-8">
                      <FaTrophy className="text-6xl text-green-500 mx-auto mb-4" />
                      <p className="text-xl font-semibold text-gray-800 dark:text-white">
                        Excellent Work!
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        Your resume looks great. No critical improvements needed.
                      </p>
                    </div>
                  ) : (
                    recommendations.map((rec, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-lg border-l-4 ${
                          rec.type === 'critical'
                            ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
                            : rec.type === 'warning'
                            ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                            : 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="mt-1">
                            {getRecommendationIcon(rec.type)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 dark:text-white mb-1">
                              {rec.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                              {rec.description}
                            </p>
                            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                              💡 {rec.action}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </motion.div>
              )}

              {activeTab === 'ats' && (
                <motion.div
                  key="ats"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    ATS Optimization Tips
                  </h3>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Applicant Tracking Systems (ATS) are used by 98% of Fortune 500 companies. 
                      A good ATS score increases your chances of getting your resume seen by a human recruiter.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-gray-700 dark:text-gray-300">Use standard section headings</span>
                      <FaCheckCircle className="text-green-500" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-gray-700 dark:text-gray-300">Include relevant keywords</span>
                      <FaCheckCircle className="text-green-500" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-gray-700 dark:text-gray-300">Use simple formatting</span>
                      <FaCheckCircle className="text-green-500" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-gray-700 dark:text-gray-300">Include contact information</span>
                      <FaCheckCircle className="text-green-500" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-gray-700 dark:text-gray-300">Quantify achievements</span>
                      {resumeData?.experience?.some((exp: any) => 
                        /\d+%|\d+\+/i.test(exp.description || '')
                      ) ? (
                        <FaCheckCircle className="text-green-500" />
                      ) : (
                        <FaExclamationTriangle className="text-yellow-500" />
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ResumeAnalytics;