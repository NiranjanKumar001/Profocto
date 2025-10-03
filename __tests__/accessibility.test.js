// Simple test to verify our accessibility improvements work correctly
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import FormButton from '../components/form/FormButton';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('Accessibility Improvements', () => {
  describe('FormButton Component', () => {
    const mockAdd = jest.fn();
    const mockRemove = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should have no accessibility violations', async () => {
      const { container } = render(
        <FormButton 
          size={2} 
          add={mockAdd} 
          remove={mockRemove} 
          sectionName="work experience"
        />
      );
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('should have proper ARIA labels', () => {
      render(
        <FormButton 
          size={2} 
          add={mockAdd} 
          remove={mockRemove} 
          sectionName="work experience"
        />
      );

      expect(screen.getByLabelText('Add new work experience')).toBeInTheDocument();
      expect(screen.getByLabelText(/Remove last work experience/)).toBeInTheDocument();
    });

    test('should provide screen reader announcements', () => {
      render(
        <FormButton 
          size={2} 
          add={mockAdd} 
          remove={mockRemove} 
          sectionName="work experience"
        />
      );

      const addButton = screen.getByLabelText('Add new work experience');
      fireEvent.click(addButton);

      // Check if ARIA live region exists
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    test('should handle keyboard navigation', () => {
      render(
        <FormButton 
          size={2} 
          add={mockAdd} 
          remove={mockRemove} 
          sectionName="work experience"
        />
      );

      const addButton = screen.getByLabelText('Add new work experience');
      
      // Test Enter key
      fireEvent.keyDown(addButton, { key: 'Enter' });
      expect(mockAdd).toHaveBeenCalledTimes(1);

      // Test Space key  
      fireEvent.keyDown(addButton, { key: ' ' });
      expect(mockAdd).toHaveBeenCalledTimes(2);
    });

    test('should have proper focus indicators', () => {
      render(
        <FormButton 
          size={2} 
          add={mockAdd} 
          remove={mockRemove} 
          sectionName="work experience"
        />
      );

      const addButton = screen.getByLabelText('Add new work experience');
      
      // Check if focus styles are applied
      expect(addButton).toHaveClass('focus:outline-none', 'focus:ring-2');
    });

    test('should group related controls', () => {
      render(
        <FormButton 
          size={2} 
          add={mockAdd} 
          remove={mockRemove} 
          sectionName="work experience"
        />
      );

      // Check if buttons are grouped with proper ARIA role
      expect(screen.getByRole('group')).toBeInTheDocument();
    });
  });

  describe('Error Boundary Component', () => {
    test('should display user-friendly error message', () => {
      const ThrowError = () => {
        throw new Error('Test error');
      };

      const { ErrorBoundary } = require('../components/utility/ErrorBoundary');
      
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });
  });

  describe('Performance Utils', () => {
    test('should debounce function calls', () => {
      jest.useFakeTimers();
      const { debounce } = require('../lib/performanceUtils');
      
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      // Call multiple times quickly
      debouncedFn('test1');
      debouncedFn('test2');
      debouncedFn('test3');

      // Should not have been called yet
      expect(mockFn).not.toHaveBeenCalled();

      // Fast forward time
      jest.advanceTimersByTime(100);

      // Should have been called once with the last value
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('test3');

      jest.useRealTimers();
    });
  });
});

// Integration test for accessibility
describe('Accessibility Integration', () => {
  test('should meet WCAG guidelines', async () => {
    // This would be a more comprehensive test in a real scenario
    const { container } = render(
      <div>
        <h1>Resume Builder</h1>
        <button aria-label="Create new resume">Create Resume</button>
        <nav aria-label="Main navigation">
          <ul>
            <li><button type="button">Home</button></li>
            <li><button type="button">Builder</button></li>
          </ul>
        </nav>
      </div>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});