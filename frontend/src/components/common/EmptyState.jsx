import React from "react";

const EmptyState = ({
  title = "No data available",
  description = "There's no data to display at the moment.",
  actionLabel,
  onAction,
  icon: Icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="w-16 h-16 bg-secondary-100 dark:bg-secondary-700 rounded-full flex items-center justify-center">
        {Icon ? (
          <Icon className="w-8 h-8 text-secondary-400" />
        ) : (
          <svg
            className="w-8 h-8 text-secondary-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        )}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-1">
          {title}
        </h3>
        <p className="text-secondary-500 dark:text-secondary-400 max-w-md">
          {description}
        </p>
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="btn-primary"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
