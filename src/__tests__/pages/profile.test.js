import Profile from "../../pages/profile";
import { BrowserRouter as Router } from "react-router-dom";
import {
  waitFor,
  screen,
  render,
  fireEvent,
} from "@testing-library/react";
import {
  getUserProfileByUsername,
  getProfilePhotosByUserId,
  getIsLoggedInUserFollowingProfile,
} from "../../services/firebase";
import FirebaseContext from "../../context/firebase";
import UserContext from "../../context/user";
import useUser from "../../hooks/use-user";
import loggedInUserProfileFixture from "../../fixtures/logged-in-user";
import profilePhotosFixture from "../../fixtures/profile-photos";
import followedProfileFixture from "../../fixtures/profile-followed";
import notFollowedProfileFixture from "../../fixtures/profile-not-followed";
import { NOT_FOUND } from "../../constants/routes";

// Mocking modules.
jest.mock("../../services/firebase.js");
jest.mock("../../hooks/use-user.js");

// Mock function to replace history.push.
const mockHistoryPush = jest.fn();

// Mocking the react router module and replacing push method
// with mock function and useParams params as username.
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
  useParams: () => ({
    username: "steve",
  }),
}));

// Tests
describe("<Profile/>", () => {
  // Clear all mocks before each test is run
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // TEST=========================================================================================================================
  it("redirects to the not found page when a profile does not exist", async () => {
    // Mock function to replace getUserProfileByUsername firebase service call.
    await waitFor(() => {
      getUserProfileByUsername.mockImplementation(
        () => null
      );

      // Render the profile page successfully
      render(
        <Router>
          <FirebaseContext.Provider
            value={{
              firebase: {
                uid: loggedInUserProfileFixture.userId,
              },
            }}
          >
            <UserContext.Provider
              value={{
                user: {
                  uid: "u6VKNiPvkBdPxZIn14GBYK4Gy3T2",
                  displayName: "steve",
                },
              }}
            >
              <Profile />
            </UserContext.Provider>
          </FirebaseContext.Provider>
        </Router>
      );
    });

    // Check to see if redirect has happened.
    await waitFor(() => {
      expect(mockHistoryPush).toHaveBeenCalled();
      expect(mockHistoryPush).toHaveBeenCalledWith(
        NOT_FOUND
      );
    });
  });

  // TEST=========================================================================================================================
  it("renders the component with a logged in user and a profile the user is following. The user clicks the the unfollow button to unfollow the profile", async () => {
    await waitFor(() => {
      // Returns the logged in user profile data.
      useUser.mockImplementation(() => ({
        user: loggedInUserProfileFixture,
      }));

      // Returns the profile data
      getUserProfileByUsername.mockImplementation(
        () => followedProfileFixture
      );

      // Returns the profile photos data
      getProfilePhotosByUserId.mockImplementation(
        () => profilePhotosFixture
      );

      // Returns a boolean depending on the profile followers array
      // containing the logged in userId
      getIsLoggedInUserFollowingProfile.mockImplementation(
        () =>
          followedProfileFixture.followers.includes(
            loggedInUserProfileFixture.userId
          )
      );

      // Render the profile page successfully
      render(
        <Router>
          <FirebaseContext.Provider
            value={{
              firebase: {
                uid: loggedInUserProfileFixture.userId,
              },
            }}
          >
            <UserContext.Provider
              value={{
                user: {
                  uid: "u6VKNiPvkBdPxZIn14GBYK4Gy3T2",
                  displayName: "steve",
                },
              }}
            >
              <Profile />
            </UserContext.Provider>
          </FirebaseContext.Provider>
        </Router>
      );
    });

    await waitFor(() => {
      // Shows unfollow because logged in user follows this profile.
      expect(screen.getByText("Unfollow")).toBeTruthy();

      // Click on the unfollow button.
      fireEvent.click(
        screen.getByTestId("profile-follow-btn")
      );
    });

    // After clicking on unfollow button, button should now say follow.
    expect(screen.getByText("Follow")).toBeTruthy();
  });

  // TEST=========================================================================================================================
  it("renders the component with a logged in user and a profile the user is following. The user presses enter key to unfollow the profile", async () => {
    await waitFor(() => {
      useUser.mockImplementation(() => ({
        user: loggedInUserProfileFixture,
      }));
      getUserProfileByUsername.mockImplementation(
        () => followedProfileFixture
      );
      getProfilePhotosByUserId.mockImplementation(
        () => profilePhotosFixture
      );
      getIsLoggedInUserFollowingProfile.mockImplementation(
        () =>
          followedProfileFixture.followers.includes(
            loggedInUserProfileFixture.userId
          )
      );

      render(
        <Router>
          <FirebaseContext.Provider
            value={{
              firebase: {
                uid: loggedInUserProfileFixture.userId,
              },
            }}
          >
            <UserContext.Provider
              value={{
                user: {
                  uid: "u6VKNiPvkBdPxZIn14GBYK4Gy3T2",
                  displayName: "steve",
                },
              }}
            >
              <Profile />
            </UserContext.Provider>
          </FirebaseContext.Provider>
        </Router>
      );
    });

    await waitFor(() => {
      // Shows unfollow because logged in user follows this profile.
      expect(screen.getByText("Unfollow")).toBeTruthy();

      // Press enter when button is focussed to unfollow profile.
      fireEvent.keyDown(
        screen.getByTestId("profile-follow-btn"),
        { key: "Enter" }
      );
    });

    // Button should now say follow.
    expect(screen.getByText("Follow")).toBeTruthy();
  });

  // TEST=========================================================================================================================
  it("renders the component with a logged in user and a profile the user is NOT following. The user clicks the the follow button to follow the profile", async () => {
    await waitFor(() => {
      useUser.mockImplementation(() => ({
        user: loggedInUserProfileFixture,
      }));
      getUserProfileByUsername.mockImplementation(
        () => followedProfileFixture
      );
      getProfilePhotosByUserId.mockImplementation(
        () => profilePhotosFixture
      );
      getIsLoggedInUserFollowingProfile.mockImplementation(
        () =>
          notFollowedProfileFixture.followers.includes(
            loggedInUserProfileFixture.userId
          )
      );

      render(
        <Router>
          <FirebaseContext.Provider
            value={{
              firebase: {
                uid: loggedInUserProfileFixture.userId,
              },
            }}
          >
            <UserContext.Provider
              value={{
                user: {
                  uid: "u6VKNiPvkBdPxZIn14GBYK4Gy3T2",
                  displayName: "steve",
                },
              }}
            >
              <Profile />
            </UserContext.Provider>
          </FirebaseContext.Provider>
        </Router>
      );
    });

    await waitFor(() => {
      // Button should say follow because logged in user is NOT following this profile.
      expect(screen.getByText("Follow")).toBeTruthy();

      // Click on button to follow.
      fireEvent.click(
        screen.getByTestId("profile-follow-btn")
      );
    });

    // Button now shows unfollow.
    expect(screen.getByText("Unfollow")).toBeTruthy();
  });

  // TEST=========================================================================================================================
  it("renders the component with a logged in user and a profile the user is NOT following. The user presses the enter key to follow the profile", async () => {
    await waitFor(() => {
      useUser.mockImplementation(() => ({
        user: loggedInUserProfileFixture,
      }));
      getUserProfileByUsername.mockImplementation(
        () => followedProfileFixture
      );
      getProfilePhotosByUserId.mockImplementation(
        () => profilePhotosFixture
      );
      getIsLoggedInUserFollowingProfile.mockImplementation(
        () =>
          notFollowedProfileFixture.followers.includes(
            loggedInUserProfileFixture.userId
          )
      );

      render(
        <Router>
          <FirebaseContext.Provider
            value={{
              firebase: {
                uid: loggedInUserProfileFixture.userId,
              },
            }}
          >
            <UserContext.Provider
              value={{
                user: {
                  uid: "u6VKNiPvkBdPxZIn14GBYK4Gy3T2",
                  displayName: "steve",
                },
              }}
            >
              <Profile />
            </UserContext.Provider>
          </FirebaseContext.Provider>
        </Router>
      );
    });

    await waitFor(() => {
      // Button should say follow because logged in user is NOT following this profile.
      expect(screen.getByText("Follow")).toBeTruthy();

      // Press enter when button is focussed.
      fireEvent.keyDown(
        screen.getByTestId("profile-follow-btn"),
        { key: "Enter" }
      );
    });

    // Button now shows unfollow.
    expect(screen.getByText("Unfollow")).toBeTruthy();
  });
});
