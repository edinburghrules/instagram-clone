import { render, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { act } from "react-dom/test-utils";
import Login from "../../pages/login";
import FirebaseContext from "../../context/firebase";
import * as ROUTES from "../../constants/routes";

// Mock history returns a new default jest mock function.
const mockHistoryPush = jest.fn();

// Creating a mock react router, requireActual requires actual module,
// to not be mocked and then we assign push property from history the mockHistoryPush.
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

// Login page test
describe("<Login />", () => {
  // Before each test, clear all mocks.
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test for successful login.
  it("renders the login in page with a form submission and logs the user in", async () => {
    // Mock function to mock the successful sign in.
    const succeededToLogin = jest.fn(() => Promise.resolve("I am signed in!"));

    // Mock firebase object, with auth property to replicate auth().signInWithEmailAndPassword and succeed.
    const firebase = {
      auth: jest.fn(() => ({
        signInWithEmailAndPassword: succeededToLogin,
      })),
    };

    // The component wrapped with Router and Firebase so we have access to things the Login
    // component needs e.g. <Link>, firebase etc.
    const { getByTestId, getByPlaceholderText, queryByTestId } = render(
      <Router>
        <FirebaseContext.Provider value={{ firebase }}>
          <Login />
        </FirebaseContext.Provider>
      </Router>
    );

    await act(async () => {
      // Set the value of the email address field to 'karl@gmail.com'.
      await fireEvent.change(getByPlaceholderText("Email address"), {
        target: { value: "karl@gmail.com" },
      });

      // Set the value of the password field to 'password'.
      await fireEvent.change(getByPlaceholderText("Password"), {
        target: { value: "password" },
      });

      // Once email and password have been input, submit.
      fireEvent.submit(getByTestId("login"));

      // Once all of the above, expect below to all be truthy.
      expect(document.title).toEqual("Login - Instagram");
      expect(succeededToLogin).toHaveBeenCalled();
      expect(succeededToLogin).toHaveBeenCalledWith(
        "karl@gmail.com",
        "password"
      );

      // Wait for succeedToLogin and expect the below.
      await waitFor(() => {
        expect(mockHistoryPush).toHaveBeenCalledWith(ROUTES.DASHBOARD);
        expect(getByPlaceholderText("Email address").value).toBe(
          "karl@gmail.com"
        );
        expect(getByPlaceholderText("Password").value).toBe("password");
        expect(queryByTestId("error")).toBeFalsy();
      });
    });
  });

  // Test for unsuccessful login.
  it("renders the login in page with a form submission and fails to log a user in", async () => {
    // Mock function to mock the successful sign in.
    const failToLogin = jest.fn(() =>
      Promise.reject(new Error("Cannot sign in"))
    );

    // Mock firebase object, with auth property to replicate auth().signInWithEmailAndPassword and fail.
    const firebase = {
      auth: jest.fn(() => ({
        signInWithEmailAndPassword: failToLogin,
      })),
    };

    // The component wrapped with Router and Firebase so we have access to things the Login
    // component needs e.g. <Link>, firebase etc.
    const { getByTestId, getByPlaceholderText, queryByTestId } = render(
      <Router>
        <FirebaseContext.Provider value={{ firebase }}>
          <Login />
        </FirebaseContext.Provider>
      </Router>
    );

    await act(async () => {
      // Set the value for the email address field.
      await fireEvent.change(getByPlaceholderText("Email address"), {
        target: { value: "karl.com" },
      });

      // Set the value for the password field.
      await fireEvent.change(getByPlaceholderText("Password"), {
        target: { value: "password" },
      });

      // Submit once the above is done.
      fireEvent.submit(getByTestId("login"));

      // Assertions after the above has been done.
      expect(document.title).toEqual("Login - Instagram");
      expect(failToLogin).toHaveBeenCalled();
      expect(failToLogin).toHaveBeenCalledWith("karl.com", "password");
      expect(failToLogin).rejects.toThrow("Cannot sign in");

      // Assertions for falied login.
      await waitFor(() => {
        expect(mockHistoryPush).not.toHaveBeenCalledWith(ROUTES.DASHBOARD);
        expect(getByPlaceholderText("Email address").value).toBe("");
        expect(getByPlaceholderText("Password").value).toBe("");
        expect(queryByTestId("error")).toBeTruthy();
      });
    });
  });
});
