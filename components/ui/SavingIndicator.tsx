import { FaCheck, FaSpinner } from 'react-icons/fa';

interface SavingIndicatorProps {
  isSaving: boolean;
  lastSaved: Date | null;
  className?: string;
}

export default function SavingIndicator({ isSaving, lastSaved, className = '' }: SavingIndicatorProps) {
  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 10) return 'just now';
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      {isSaving ? (
        <>
          <FaSpinner className="animate-spin text-pink-500" />
          <span className="text-gray-400">Saving...</span>
        </>
      ) : lastSaved ? (
        <>
          <FaCheck className="text-green-500" />
          <span className="text-gray-400">Saved {getTimeAgo(lastSaved)}</span>
        </>
      ) : (
        <span className="text-gray-500">No changes</span>
      )}
    </div>
  );
}
