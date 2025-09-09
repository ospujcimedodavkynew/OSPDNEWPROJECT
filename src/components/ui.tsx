import React from 'react';

// Card
export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
    <div className={`bg-surface p-6 rounded-lg shadow ${className}`} {...props}>
        {children}
    </div>
);

// Button
export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className = '', ...props }) => (
    <button className={`px-4 py-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-primary text-white hover:bg-primary-focus focus:ring-primary ${className}`} {...props}>
        {children}
    </button>
);

export const SecondaryButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className = '', ...props }) => (
    <button className={`px-4 py-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-gray-200 text-text-primary hover:bg-gray-300 focus:ring-gray-400 ${className}`} {...props}>
        {children}
    </button>
);

export const IconButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className = '', ...props }) => (
    <button className={`p-2 rounded-full hover:bg-background focus:outline-none focus:ring-2 focus:ring-primary text-text-secondary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed ${className}`} {...props}>
        {children}
    </button>
);

// Input
export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...props }) => (
    <input
        className={`w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white ${className}`}
        {...props}
    />
);

// Select
export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ children, className = '', ...props }) => (
    <select
        className={`w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white ${className}`}
        {...props}
    >
        {children}
    </select>
);


// Label
export const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ children, className = '', ...props }) => (
    // FIX: Changed single quotes to backticks for correct template literal interpolation.
    <label className={`block text-sm font-medium text-text-secondary mb-1 ${className}`} {...props}>
        {children}
    </label>
);

// Modal
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-surface rounded-lg shadow-xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b p-4">
                    <h2 className="text-xl font-bold text-text-primary">{title}</h2>
                    <button onClick={onClose} className="text-text-secondary hover:text-text-primary text-2xl">&times;</button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
};


// Stepper
interface StepperProps {
  steps: { id: string; name: string }[];
  currentStepId: string;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStepId }) => {
  const currentStepIndex = steps.findIndex(step => step.id === currentStepId);

  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className={`relative ${stepIdx !== steps.length - 1 ? 'flex-1' : ''}`}>
            {stepIdx < currentStepIndex ? (
              // Completed step
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-primary" />
                </div>
                <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                  <span>&#10003;</span>
                </span>
              </>
            ) : stepIdx === currentStepIndex ? (
              // Current step
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <span className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-white text-primary font-bold">
                  <span>{stepIdx + 1}</span>
                </span>
                 <span className="absolute top-10 left-1/2 -translate-x-1/2 text-center text-sm font-bold text-primary">{step.name}</span>
              </>
            ) : (
              // Upcoming step
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-text-secondary">
                  <span>{stepIdx + 1}</span>
                </span>
                 <span className="absolute top-10 left-1/2 -translate-x-1/2 text-center text-sm text-text-secondary">{step.name}</span>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};


// Tabs
interface TabsProps {
  tabs: { id: string; label: string }[];
  activeTabId: string;
  onTabClick: (id: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTabId, onTabClick }) => {
  return (
    <div>
      <div className="border-b border-border">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabClick(tab.id)}
              className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
                tab.id === activeTabId
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-secondary hover:border-gray-300 hover:text-text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};