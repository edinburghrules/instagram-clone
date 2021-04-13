import React from "react";
import {
  render,
  fireEvent,
  waitFor,
  screen,
  waitForDomChange,
} from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { act } from "react-dom/test-utils";
import SignUp from "../../pages/signup";
import FirebaseContext from "../../context/firebase";
import { doesUsernameExist } from "../../services/firebase";
import * as ROUTES from "../../constants/routes";

// Mock history push
const mockHistoryPush = jest.fn();

// Mock react router dom but 'overriding' push to use mock history push.
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

// Mocking the firebase services module
jest.mock("../../services/firebase");

// Tests
describe("<SignUp />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the sign up page with a form submission and signs a user up", async () => {
    // Mock firebase object
    const firebase = {
      firestore: jest.fn(() => ({
        collection: jest.fn(() => ({
          set: jest.fn(() => Promise.resolve("User added")),
        })),
      })),
      auth: jest.fn(() => ({
        createUserWithEmailAndPassword: jest.fn(() => ({
          user: {
            updateProfile: jest.fn(() => Promise.resolve("I am signed up!")),
          },
        })),
      })),
    };

    // Render the component to test
    render(
      <Router>
        <FirebaseContext.Provider value={{ firebase }}>
          <SignUp />
        </FirebaseContext.Provider>
      </Router>
    );

    // Form inputs
    const usernameInput = screen.getByPlaceholderText("Username");
    const fullnameInput = screen.getByPlaceholderText("Full name");
    const emailInput = screen.getByPlaceholderText("Email address");
    const passwordInput = screen.getByPlaceholderText("Password");

    // No other user with username
    doesUsernameExist.mockImplementation(() => Promise.resolve(false));

    // Form input onChange setting field to values
    fireEvent.change(usernameInput, {
      target: { value: "sean" },
    });

    fireEvent.change(fullnameInput, {
      target: { value: "Sean Adamson" },
    });

    fireEvent.change(emailInput, {
      target: { value: "sean@gmail.com" },
    });

    fireEvent.change(passwordInput, {
      target: { value: "password" },
    });

    // Submitting
    fireEvent.submit(screen.getByTestId("sign-up"));

    // Assertions
    expect(document.title).toEqual("Sign Up - Instagram");
    expect(doesUsernameExist).toHaveBeenCalled();
    expect(doesUsernameExist).toHaveBeenCalledWith("sean");

    await waitFor(() => {
      expect(mockHistoryPush).toHaveBeenCalledWith(ROUTES.DASHBOARD);
      expect(usernameInput.value).toBe("sean");
      expect(fullnameInput.value).toBe("Sean Adamson");
      expect(emailInput.value).toBe("sean@gmail.com");
      expect(passwordInput.value).toBe("password");
      expect(screen.queryByTestId("error")).toBeFalsy();
    });
  });

  it("renders the sign up page but an error is present (username exists)", async () => {
    doesUsernameExist.mockImplementation(() => Promise.resolve(true));

    const firebase = {
      firestore: jest.fn(() => ({
        collection: jest.fn(() => ({
          set: jest.fn(() => Promise.resolve("User added")),
        })),
      })),
      auth: jest.fn(() => ({
        createUserWithEmailAndPassword: jest.fn(() => ({
          user: {
            updateProfile: jest.fn(() => Promise.resolve("I am signed up!")),
          },
        })),
      })),
    };

    render(
      <Router>
        <FirebaseContext.Provider value={{ firebase }}>
          <SignUp />
        </FirebaseContext.Provider>
      </Router>
    );

    const usernameInput = screen.getByPlaceholderText("Username");
    const fullnameInput = screen.getByPlaceholderText("Full name");
    const emailInput = screen.getByPlaceholderText("Email address");
    const passwordInput = screen.getByPlaceholderText("Password");

    fireEvent.change(usernameInput, {
      target: { value: "sean" },
    });

    fireEvent.change(fullnameInput, {
      target: { value: "Sean Adamson" },
    });

    fireEvent.change(emailInput, {
      target: { value: "sean@gmail.com" },
    });

    fireEvent.change(passwordInput, {
      target: { value: "password" },
    });

    fireEvent.submit(screen.getByTestId("sign-up"));

    await waitFor(() => {
      expect(doesUsernameExist).toHaveBeenCalled();
      expect(doesUsernameExist).toHaveBeenCalledWith("sean");
      expect(usernameInput.value).toBe("");
      expect(fullnameInput.value).toBe("");
      expect(emailInput.value).toBe("");
      expect(passwordInput.value).toBe("");
    });
  });

  it("renders the sign up page but an error is present", async () => {
    doesUsernameExist.mockImplementation(() => Promise.resolve(false));

    const firebase = {
      auth: jest.fn(() => ({
        createUserWithEmailAndPassword: jest.fn(() =>
          Promise.reject(new Error("Badly formatted email"))
        ),
      })),
    };

    render(
      <Router>
        <FirebaseContext.Provider value={{ firebase }}>
          <SignUp />
        </FirebaseContext.Provider>
      </Router>
    );

    const usernameInput = screen.getByPlaceholderText("Username");
    const fullnameInput = screen.getByPlaceholderText("Full name");
    const emailInput = screen.getByPlaceholderText("Email address");
    const passwordInput = screen.getByPlaceholderText("Password");

    fireEvent.change(usernameInput, {
      target: { value: "sean" },
    });

    fireEvent.change(fullnameInput, {
      target: { value: "Sean Adamson" },
    });

    fireEvent.change(emailInput, {
      target: { value: "seangmail.com" },
    });

    fireEvent.change(passwordInput, {
      target: { value: "password" },
    });

    fireEvent.submit(screen.getByTestId("sign-up"));

    await waitFor(() => {
      expect(mockHistoryPush).not.toHaveBeenCalledWith(ROUTES.DASHBOARD);
      expect(usernameInput.value).toBe("");
      expect(fullnameInput.value).toBe("");
      expect(emailInput.value).toBe("");
      expect(passwordInput.value).toBe("");
      expect(screen.queryByTestId("error")).toBeTruthy();
    });
  });
});
