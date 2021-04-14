import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { act } from "react-dom/test-utils";
import Dashboard from "../../pages/dashboard";
import UserContext from "../../context/user";
import FirebaseContext from "../../context/firebase";
import { getSuggestedProfiles } from "../../services/firebase";
import useUser from "../../hooks/use-user";
import usePhotos from "../../hooks/use-photos";
import userFixture from "../fixtures/logged-in-user";
import photosFixture from "../fixtures/timeline-photos";
import suggestedProfilesFixture from "../fixtures/suggested-profiles";

jest.mock("../../services/firebase");
jest.mock("../../hooks/use-user");
jest.mock("../../hooks/use-photos");

describe("<Dashboard />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the dashboard with a user profile and follows a user from the suggested profile, it also likes a photo, posts a comment and signs out", async () => {
    await act(async () => {
      usePhotos.mockImplementation(() => ({ photos: photosFixture }));
      getSuggestedProfiles.mockImplementation(() => suggestedProfilesFixture);
      useUser.mockImplementation(() => ({ user: userFixture }));

      render(
        <Router>
          <FirebaseContext.Provider
            value={{
              firebase: {
                auth: jest.fn(() => ({
                  signOut: jest.fn(() => Promise.resolve("Signed out!")),
                })),
              },
              FieldValue: {
                arrayUnion: jest.fn(),
                arrayRemove: jest.fn(),
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
              <Dashboard />
            </UserContext.Provider>
          </FirebaseContext.Provider>
        </Router>
      );

      await waitFor(async () => {
        expect(document.title).toEqual("Instagram");
        expect(screen.getByTitle("Sign Out")).toBeTruthy();
        expect(screen.getAllByText("raphael")).toBeTruthy();
        expect(screen.getAllByAltText("Instagram")).toBeTruthy();
        expect(screen.getByAltText("steve profile")).toBeTruthy();
        expect(screen.getAllByText("Saint George and the Dragon")).toBeTruthy();
        expect(screen.getByText("Suggested for you")).toBeTruthy();

        fireEvent.click(screen.getByText("Follow"));

        fireEvent.click(screen.getByTestId("photo-liked-494LKmaF03bUcYZ4xhNu"));

        fireEvent.keyDown(
          screen.getByTestId("photo-liked-494LKmaF03bUcYZ4xhNu"),
          {
            key: "Enter",
          }
        );

        fireEvent.click(screen.getByTestId("photo-liked-494LKmaF03bUcYZ4xhNu"));

        fireEvent.click(screen.getByTestId("focus-input-494LKmaF03bUcYZ4xhNu"));

        fireEvent.keyDown(
          screen.getByTestId("focus-input-494LKmaF03bUcYZ4xhNu"),
          {
            key: "Enter",
          }
        );

        fireEvent.change(
          screen.getByTestId("add-comment-494LKmaF03bUcYZ4xhNu"),
          { target: { value: "Amazing photo!" } }
        );

        fireEvent.submit(
          screen.getByTestId("add-comment-submit-494LKmaF03bUcYZ4xhNu")
        );

        expect(screen.getByText("Amazing photo!")).toBeTruthy();
      });

      fireEvent.click(screen.getByTitle("Sign Out"));

      fireEvent.keyDown(screen.getByTitle("Sign Out"), {
        key: "Enter",
      });
    });
  });
});
