import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "../Pages/auth/Login";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import configureStore from "redux-mock-store";

// Mock dependencies
jest.mock("react-hot-toast");
jest.mock("@/services/authApi", () => ({
  loginUser: jest.fn(),
}));
jest.mock("lucide-react", () => ({
  Eye: () => <div data-testid="eye-icon" />,
  EyeOff: () => <div data-testid="eye-off-icon" />,
  Loader2: () => <div data-testid="loader-icon" />,
}));

// Create a mock store
const mockStore = configureStore([]);
const store = mockStore({
  auth: {
    isAuthenticated: false,
    user: null,
  },
});

// Create a QueryClient
const queryClient = new QueryClient();

// Helper to render component with wrappers
const renderWithWrappers = (component) => {
  return render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>{component}</BrowserRouter>
      </QueryClientProvider>
    </Provider>,
  );
};

describe("Login Component", () => {
  beforeEach(() => {
    store.clearActions();
  });

  test("renders login form elements", () => {
    renderWithWrappers(<Login />);

    expect(screen.getByRole("heading", { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
  });

  test("validates empty inputs", async () => {
    renderWithWrappers(<Login />);

    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    expect(
      await screen.findByText(/Invalid email address/i),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Password must be at least 8 characters/i),
    ).toBeInTheDocument();
  });

  test("allows typing in email and password", () => {
    renderWithWrappers(<Login />);

    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
  });
});
