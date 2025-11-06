"use client";

import { useSession } from "next-auth/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { createPortal } from "react-dom";
import { useState, useEffect, useMemo, useCallback } from "react";
import { FaTimes, FaFileAlt, FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Get user from Convex - queries run always and Convex caches the results
  // This prevents refetching every time the modal opens
  const convexUser = useQuery(
    api.auth.getUserByEmail,
    session?.user?.email ? { email: session.user.email } : "skip"
  );

  // Get all resumes for this user - Convex caches this query
  const resumes = useQuery(
    api.resume.getResumes,
    convexUser?._id ? { id: convexUser._id } : "skip"
  );

  // Delete mutation
  const deleteResume = useMutation(api.resume.deleteResume);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  // Memoized handlers to prevent re-creation on every render
  const handleDeleteResume = useCallback(async (resumeId: string) => {
    try {
      const id = resumeId as any;
      await deleteResume({ id });
      toast.success("Resume deleted successfully!");
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete resume:", error);
      toast.error("Failed to delete resume. Please try again.");
    }
  }, [deleteResume]);

  const handleCreateNew = useCallback(() => {
    const newId = crypto.randomUUID();
    router.push(`/builder/${newId}`);
    onClose();
  }, [router, onClose]);

  const handleEditResume = useCallback((resumeId: string) => {
    router.push(`/builder/${resumeId}`);
    onClose();
  }, [router, onClose]);

  // Memoized utility functions
  const formatDate = useCallback((timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return date.toLocaleDateString();
  }, []);

  const getResumeTitle = useCallback((resumeData: string) => {
    try {
      const data = JSON.parse(resumeData);
      return data.name || "Untitled Resume";
    } catch {
      return "Untitled Resume";
    }
  }, []);

  const getResumePosition = useCallback((resumeData: string) => {
    try {
      const data = JSON.parse(resumeData);
      return data.position || "No position specified";
    } catch {
      return "No position specified";
    }
  }, []);

  // Memoize sorted and sliced resumes to prevent recalculation
  const displayResumes = useMemo(() => {
    if (!resumes || resumes.length === 0) return [];
    return resumes
      .sort((a, b) => b._creationTime - a._creationTime)
      .slice(0, 3);
  }, [resumes]);

  // Memoize last updated time
  const lastUpdated = useMemo(() => {
    if (!resumes || resumes.length === 0) return "N/A";
    return formatDate(Math.max(...resumes.map((r) => r._creationTime)));
  }, [resumes, formatDate]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-lg exclude-print p-4 overflow-hidden"
      onClick={onClose}
    >
      <div 
        className="bg-[#0a0a0a] rounded-xl border border-gray-800 max-w-4xl w-full max-h-[90vh] overflow-hidden"
        style={{
          boxShadow: '0 0 0 1px rgba(236, 72, 153, 0.1), 0 20px 50px rgba(0, 0, 0, 0.5)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-6 py-5 border-b border-gray-800/60">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              {session?.user?.image && (
                <div className="relative">
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0a0a0a]"></div>
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold text-gray-100">
                  {session?.user?.name || "User Profile"}
                </h2>
                <p className="text-gray-500 text-sm mt-0.5">{session?.user?.email}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors group"
              aria-label="Close"
            >
              <FaTimes className="text-gray-500 group-hover:text-gray-300 size-4" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-3">
              <div className="text-xl font-semibold text-gray-200">
                {resumes?.length || 0}
              </div>
              <div className="text-xs text-gray-500 mt-1">Total Resumes</div>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-3">
              <div className="text-xl font-semibold text-gray-200">
                {lastUpdated}
              </div>
              <div className="text-xs text-gray-500 mt-1">Last Updated</div>
            </div>
          </div>
        </div>

        {/* Resume List */}
        <div className="px-6 py-5 overflow-y-auto max-h-[calc(90vh-280px)]">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-medium text-gray-200">My Resumes</h3>
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700"
            >
              <FaPlus className="size-3.5" />
              New Resume
            </button>
          </div>

          {!resumes || resumes.length === 0 ? (
            <div className="text-center py-16 min-h-[280px] flex flex-col items-center justify-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-gray-900 flex items-center justify-center border border-gray-800">
                <FaFileAlt className="size-8 text-gray-600" />
              </div>
              <p className="text-gray-300 text-base mb-1 font-medium">No resumes yet</p>
              <p className="text-gray-500 text-sm mb-6">
                Create your first resume to get started
              </p>
              <button
                onClick={handleCreateNew}
                className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg transition-all font-medium border border-gray-700"
              >
                Create First Resume
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {displayResumes.map((resume) => (
                  <div
                    key={resume._id}
                    className="bg-gray-900/50 hover:bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-gray-700 transition-all"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center flex-shrink-0">
                          <FaFileAlt className="text-gray-500 size-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-gray-200 font-medium truncate text-sm">
                            {getResumeTitle(resume.resume_data)}
                          </h4>
                          <div className="flex items-center gap-3 mt-1">
                            <p className="text-gray-500 text-xs truncate">
                              {getResumePosition(resume.resume_data)}
                            </p>
                            <span className="text-gray-700 text-xs">•</span>
                            <span className="text-gray-500 text-xs whitespace-nowrap">
                              {formatDate(resume._creationTime)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => handleEditResume(resume._id)}
                          className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-all"
                          title="Edit Resume"
                        >
                          <FaEdit className="size-3.5 text-gray-400" />
                        </button>
                        {deleteConfirm === resume._id ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleDeleteResume(resume._id)}
                              className="px-3 py-2 bg-red-600 hover:bg-red-500 text-white text-xs rounded-lg transition-all font-medium shadow-lg shadow-red-600/20"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded-lg transition-all border border-gray-700"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(resume._id)}
                            className="p-2 rounded-lg bg-gray-800 hover:bg-red-900/20 border border-gray-700 hover:border-red-800 transition-all group"
                            title="Delete Resume"
                          >
                            <FaTrash className="size-3.5 text-gray-400 group-hover:text-red-500 transition-colors" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
