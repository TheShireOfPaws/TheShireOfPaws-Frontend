import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdoptionForm from './AdoptionForm';
import adoptionRequestService from '../../../services/adoptionRequestService';

vi.mock('../../../services/adoptionRequestService');

describe('AdoptionForm', () => {
  const mockDogId = 1;
  const mockDogName = 'Max';
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial rendering', () => {
    it('renders the form with all fields', () => {
      render(<AdoptionForm dogId={mockDogId} dogName={mockDogName} onSuccess={mockOnSuccess} />);

      expect(screen.getByText(/Max/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByText(/housing type/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/household size/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/why do you want to adopt/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/where will the dog stay/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /submit adoption request/i })).toBeInTheDocument();
    });

    it('all fields are empty initially', () => {
      render(<AdoptionForm dogId={mockDogId} dogName={mockDogName} onSuccess={mockOnSuccess} />);

      expect(screen.getByLabelText(/first name/i)).toHaveValue('');
      expect(screen.getByLabelText(/last name/i)).toHaveValue('');
      expect(screen.getByLabelText(/email/i)).toHaveValue('');
      expect(screen.getByLabelText(/household size/i)).toHaveValue(null);
    });
  });

  describe('Field validation', () => {
    it('shows error when first name is empty', async () => {
      const user = userEvent.setup();
      render(<AdoptionForm dogId={mockDogId} dogName={mockDogName} onSuccess={mockOnSuccess} />);

      const submitButton = screen.getByRole('button', { name: /submit adoption request/i });
      await user.click(submitButton);

      expect(await screen.findByText('First name is required')).toBeInTheDocument();
    });

    it('shows error when last name is empty', async () => {
      const user = userEvent.setup();
      render(<AdoptionForm dogId={mockDogId} dogName={mockDogName} onSuccess={mockOnSuccess} />);

      const submitButton = screen.getByRole('button', { name: /submit adoption request/i });
      await user.click(submitButton);

      expect(await screen.findByText('Last name is required')).toBeInTheDocument();
    });

    it('shows error when email is empty', async () => {
      const user = userEvent.setup();
      render(<AdoptionForm dogId={mockDogId} dogName={mockDogName} onSuccess={mockOnSuccess} />);

      const submitButton = screen.getByRole('button', { name: /submit adoption request/i });
      await user.click(submitButton);

      expect(await screen.findByText('Email is required')).toBeInTheDocument();
    });

    it('shows error when housing type is not selected', async () => {
      const user = userEvent.setup();
      render(<AdoptionForm dogId={mockDogId} dogName={mockDogName} onSuccess={mockOnSuccess} />);

      const submitButton = screen.getByRole('button', { name: /submit adoption request/i });
      await user.click(submitButton);

      expect(await screen.findByText('Please select your housing type')).toBeInTheDocument();
    });

    it('shows error when household size is empty', async () => {
      const user = userEvent.setup();
      render(<AdoptionForm dogId={mockDogId} dogName={mockDogName} onSuccess={mockOnSuccess} />);

      const submitButton = screen.getByRole('button', { name: /submit adoption request/i });
      await user.click(submitButton);

      expect(await screen.findByText('Household size is required')).toBeInTheDocument();
    });

    it('shows error when motivation is empty', async () => {
      const user = userEvent.setup();
      render(<AdoptionForm dogId={mockDogId} dogName={mockDogName} onSuccess={mockOnSuccess} />);

      const submitButton = screen.getByRole('button', { name: /submit adoption request/i });
      await user.click(submitButton);

      expect(await screen.findByText('Please tell us why you want to adopt')).toBeInTheDocument();
    });

    it('validates motivation has at least 50 characters', async () => {
      const user = userEvent.setup();
      render(<AdoptionForm dogId={mockDogId} dogName={mockDogName} onSuccess={mockOnSuccess} />);

      const motivationInput = screen.getByLabelText(/why do you want to adopt/i);
      await user.type(motivationInput, 'Short text');

      const submitButton = screen.getByRole('button', { name: /submit adoption request/i });
      await user.click(submitButton);

      expect(await screen.findByText('Please provide at least 50 characters')).toBeInTheDocument();
    });

    it('displays character counter for motivation', () => {
      render(<AdoptionForm dogId={mockDogId} dogName={mockDogName} onSuccess={mockOnSuccess} />);

      expect(screen.getByText('0 / 50 characters minimum')).toBeInTheDocument();
    });

    it('updates character counter when typing', async () => {
      const user = userEvent.setup();
      render(<AdoptionForm dogId={mockDogId} dogName={mockDogName} onSuccess={mockOnSuccess} />);

      const motivationInput = screen.getByLabelText(/why do you want to adopt/i);
      await user.type(motivationInput, 'I love dogs');

      expect(screen.getByText('11 / 50 characters minimum')).toBeInTheDocument();
    });
  });

  describe('Field interaction', () => {
    it('allows typing in first name field', async () => {
      const user = userEvent.setup();
      render(<AdoptionForm dogId={mockDogId} dogName={mockDogName} onSuccess={mockOnSuccess} />);

      const firstNameInput = screen.getByLabelText(/first name/i);
      await user.type(firstNameInput, 'John');

      expect(firstNameInput).toHaveValue('John');
    });

    it('allows typing in household size field', async () => {
      const user = userEvent.setup();
      render(<AdoptionForm dogId={mockDogId} dogName={mockDogName} onSuccess={mockOnSuccess} />);

      const householdInput = screen.getByLabelText(/household size/i);
      await user.type(householdInput, '3');

      expect(householdInput).toHaveValue(3);
    });

    it('allows selecting housing type', async () => {
      const user = userEvent.setup();
      render(<AdoptionForm dogId={mockDogId} dogName={mockDogName} onSuccess={mockOnSuccess} />);

      const houseRadio = screen.getByRole('radio', { name: /house/i });
      await user.click(houseRadio);

      expect(houseRadio).toBeChecked();
    });

    it('only allows one housing type selection at a time', async () => {
      const user = userEvent.setup();
      render(<AdoptionForm dogId={mockDogId} dogName={mockDogName} onSuccess={mockOnSuccess} />);

      const houseRadio = screen.getByRole('radio', { name: /house/i });
      const apartmentRadio = screen.getByRole('radio', { name: /apartment/i });

      await user.click(houseRadio);
      expect(houseRadio).toBeChecked();

      await user.click(apartmentRadio);
      expect(apartmentRadio).toBeChecked();
      expect(houseRadio).not.toBeChecked();
    });

    it('removes error when field is corrected', async () => {
      const user = userEvent.setup();
      render(<AdoptionForm dogId={mockDogId} dogName={mockDogName} onSuccess={mockOnSuccess} />);

      const submitButton = screen.getByRole('button', { name: /submit adoption request/i });
      await user.click(submitButton);

      expect(await screen.findByText('First name is required')).toBeInTheDocument();

      const firstNameInput = screen.getByLabelText(/first name/i);
      await user.type(firstNameInput, 'John');

      expect(screen.queryByText('First name is required')).not.toBeInTheDocument();
    });
  });

  describe('Form submission', () => {
    it('submits form with valid data', async () => {
      const user = userEvent.setup();
      adoptionRequestService.createRequest.mockResolvedValue({ id: 1 });

      render(<AdoptionForm dogId={mockDogId} dogName={mockDogName} onSuccess={mockOnSuccess} />);

      await user.type(screen.getByLabelText(/first name/i), 'John');
      await user.type(screen.getByLabelText(/last name/i), 'Doe');
      await user.type(screen.getByLabelText(/email/i), 'john.doe@example.com');
      await user.click(screen.getByRole('radio', { name: /house/i }));
      await user.type(screen.getByLabelText(/household size/i), '3');
      await user.type(
        screen.getByLabelText(/why do you want to adopt/i),
        'I have always loved dogs and have a large backyard perfect for a playful companion. I work from home so I can spend lots of time with the dog.'
      );
      await user.type(
        screen.getByLabelText(/where will the dog stay/i),
        'At home with me while I work'
      );

      await user.click(screen.getByRole('button', { name: /submit adoption request/i }));

      await waitFor(() => {
        expect(adoptionRequestService.createRequest).toHaveBeenCalledWith({
          requesterFirstName: 'John',
          requesterLastName: 'Doe',
          requesterEmail: 'john.doe@example.com',
          housingType: 'HOUSE',
          householdSize: 3,
          motivation: 'I have always loved dogs and have a large backyard perfect for a playful companion. I work from home so I can spend lots of time with the dog.',
          daytimeLocation: 'At home with me while I work',
          dogId: mockDogId
        });
      });
    });

    it('calls onSuccess when submission is successful', async () => {
      const user = userEvent.setup();
      adoptionRequestService.createRequest.mockResolvedValue({ id: 1 });

      render(<AdoptionForm dogId={mockDogId} dogName={mockDogName} onSuccess={mockOnSuccess} />);

      await user.type(screen.getByLabelText(/first name/i), 'John');
      await user.type(screen.getByLabelText(/last name/i), 'Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.click(screen.getByRole('radio', { name: /house/i }));
      await user.type(screen.getByLabelText(/household size/i), '3');
      await user.type(
        screen.getByLabelText(/why do you want to adopt/i),
        'I have always loved dogs and have a large backyard perfect for a playful companion.'
      );

      await user.click(screen.getByRole('button', { name: /submit adoption request/i }));

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalledTimes(1);
      });
    });

    it('displays "Submitting..." while submitting', async () => {
      const user = userEvent.setup();
      adoptionRequestService.createRequest.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ id: 1 }), 100))
      );

      render(<AdoptionForm dogId={mockDogId} dogName={mockDogName} onSuccess={mockOnSuccess} />);

      await user.type(screen.getByLabelText(/first name/i), 'John');
      await user.type(screen.getByLabelText(/last name/i), 'Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.click(screen.getByRole('radio', { name: /house/i }));
      await user.type(screen.getByLabelText(/household size/i), '3');
      await user.type(
        screen.getByLabelText(/why do you want to adopt/i),
        'I have always loved dogs and have a large backyard perfect for a playful companion.'
      );

      await user.click(screen.getByRole('button', { name: /submit adoption request/i }));

      expect(screen.getByRole('button', { name: /submitting/i })).toBeInTheDocument();
    });

    it('disables button while submitting', async () => {
      const user = userEvent.setup();
      adoptionRequestService.createRequest.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ id: 1 }), 100))
      );

      render(<AdoptionForm dogId={mockDogId} dogName={mockDogName} onSuccess={mockOnSuccess} />);

      await user.type(screen.getByLabelText(/first name/i), 'John');
      await user.type(screen.getByLabelText(/last name/i), 'Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.click(screen.getByRole('radio', { name: /house/i }));
      await user.type(screen.getByLabelText(/household size/i), '3');
      await user.type(
        screen.getByLabelText(/why do you want to adopt/i),
        'I have always loved dogs and have a large backyard perfect for a playful companion.'
      );

      await user.click(screen.getByRole('button', { name: /submit adoption request/i }));

      const submitButton = screen.getByRole('button', { name: /submitting/i });
      expect(submitButton).toBeDisabled();
    });

    it('displays error when submission fails', async () => {
      const user = userEvent.setup();
      const errorMessage = 'Failed to submit adoption request';
      adoptionRequestService.createRequest.mockRejectedValue({
        response: { data: { message: errorMessage } }
      });

      render(<AdoptionForm dogId={mockDogId} dogName={mockDogName} onSuccess={mockOnSuccess} />);

      await user.type(screen.getByLabelText(/first name/i), 'John');
      await user.type(screen.getByLabelText(/last name/i), 'Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.click(screen.getByRole('radio', { name: /house/i }));
      await user.type(screen.getByLabelText(/household size/i), '3');
      await user.type(
        screen.getByLabelText(/why do you want to adopt/i),
        'I have always loved dogs and have a large backyard perfect for a playful companion.'
      );

      await user.click(screen.getByRole('button', { name: /submit adoption request/i }));

      expect(await screen.findByText(errorMessage)).toBeInTheDocument();
    });

    it('does not submit form if validation errors exist', async () => {
      const user = userEvent.setup();
      render(<AdoptionForm dogId={mockDogId} dogName={mockDogName} onSuccess={mockOnSuccess} />);

      await user.click(screen.getByRole('button', { name: /submit adoption request/i }));

      expect(adoptionRequestService.createRequest).not.toHaveBeenCalled();
    });
  });

  describe('Optional daytimeLocation field', () => {
    it('allows form submission without daytimeLocation', async () => {
      const user = userEvent.setup();
      adoptionRequestService.createRequest.mockResolvedValue({ id: 1 });

      render(<AdoptionForm dogId={mockDogId} dogName={mockDogName} onSuccess={mockOnSuccess} />);

      await user.type(screen.getByLabelText(/first name/i), 'John');
      await user.type(screen.getByLabelText(/last name/i), 'Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.click(screen.getByRole('radio', { name: /house/i }));
      await user.type(screen.getByLabelText(/household size/i), '3');
      await user.type(
        screen.getByLabelText(/why do you want to adopt/i),
        'I have always loved dogs and have a large backyard perfect for a playful companion.'
      );

      await user.click(screen.getByRole('button', { name: /submit adoption request/i }));

      await waitFor(() => {
        expect(adoptionRequestService.createRequest).toHaveBeenCalled();
        expect(mockOnSuccess).toHaveBeenCalled();
      });
    });
  });
});