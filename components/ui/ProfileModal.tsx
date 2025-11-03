"use client";

import { useSession } from "next-auth/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { createPortal } from "react-dom";
import { useState, useEffect } from "react";
import { FaTimes, FaFileAlt, FaTrash, FaEdit, FaPlus, FaClock } from "react-icons/fa";
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

  // Get user from Convex
  const convexUser = useQuery(
    api.auth.getUserByEmail,
    session?.user?.email ? { email: session.user.email } : "skip"
  );

  // Get all resumes for this user
  const resumes = useQuery(
    api.resume.getResumes,
    convexUser?._id ? { id: convexUser._id } : "skip"
  );

  // Delete mutation
  const deleteResume = useMutation(api.resume.deleteResume);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  const handleDeleteResume = async (resumeId: string) => {
    try {
      await deleteResume({ id: resumeId as any });
      toast.success("Resume deleted successfully!");
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete resume:", error);
      toast.error("Failed to delete resume");
    }
  };

  const handleCreateNew = () => {
    // Generate a new UUID for the resume
    const newId = crypto.randomUUID();
    router.push(`/builder/${newId}`);
    onClose();
  };

  const handleEditResume = (resumeId: string) => {
    router.push(`/builder/${resumeId}`);
    onClose();
  };

  const formatDate = (timestamp: number) => {
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
  };

  const getResumeTitle = (resumeData: string) => {
    try {
      const data = JSON.parse(resumeData);
      return data.name || "Untitled Resume";
    } catch {
      return "Untitled Resume";
    }
  };

  const getResumePosition = (resumeData: string) => {
    try {
      const data = JSON.parse(resumeData);
      return data.position || "No position specified";
    } catch {
      return "No position specified";
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm bg-black/60 exclude-print">
      <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-pink-500/30 max-w-4xl w-[95%] max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="relative p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {session?.user?.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  width={56}
                  height={56}
                  className="rounded-full border-2 border-pink-500"
                />
              )}
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {session?.user?.name || "User Profile"}
                </h2>
                <p className="text-gray-400 text-sm">{session?.user?.email}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
              aria-label="Close"
            >
              <FaTimes className="text-gray-400 hover:text-white size-5" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-800/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-pink-500">
                {resumes?.length || 0}
              </div>
              <div className="text-xs text-gray-400 mt-1">Total Resumes</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-500">
                {resumes?.filter((r) => {
                  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
                  return r._creationTime > weekAgo;
                }).length || 0}
              </div>
              <div className="text-xs text-gray-400 mt-1">This Week</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-500">
                {resumes && resumes.length > 0
                  ? formatDate(
                      Math.max(...resumes.map((r) => r._creationTime))
                    )
                  : "N/A"}
              </div>
              <div className="text-xs text-gray-400 mt-1">Last Active</div>
            </div>
          </div>
        </div>

        {/* Resume List */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Your Resumes</h3>
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <FaPlus className="size-4" />
              Create New
            </button>
          </div>

          {!resumes || resumes.length === 0 ? (
            <div className="text-center py-12">
              <FaFileAlt className="size-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">No resumes yet</p>
              <p className="text-gray-500 text-sm mb-6">
                Create your first resume to get started
              </p>
              <button
                onClick={handleCreateNew}
                className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors font-medium"
              >
                Create First Resume
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {resumes.map((resume) => (
                <div
                  key={resume._id}
                  className="bg-gray-800/50 hover:bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-pink-500/50 transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <FaFileAlt className="text-pink-500 size-5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-semibold truncate">
                            {getResumeTitle(resume.resume_data)}
                          </h4>
                          <p className="text-gray-400 text-sm truncate">
                            {getResumePosition(resume.resume_data)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <FaClock className="size-3" />
                        <span>Created {formatDate(resume._creationTime)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleEditResume(resume._id)}
                        className="p-2 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white transition-colors"
                        title="Edit Resume"
                      >
                        <FaEdit className="size-4" />
                      </button>
                      {deleteConfirm === resume._id ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDeleteResume(resume._id)}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(resume._id)}
                          className="p-2 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white transition-colors"
                          title="Delete Resume"
                        >
                          <FaTrash className="size-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
