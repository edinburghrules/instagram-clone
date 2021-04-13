import NotFound from "../../pages/not-found";
import { BrowserRouter as Router } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import FirebaseContext from "../../context/firebase";
import UserContext from "../../context/user";

describe("<NotFound/>", () => {
  it("renders the not found page with no user signed in", async () => {
    render(
      <Router>
        <FirebaseContext.Provider value={{ firebase: null }}>
          <UserContext.Provider value={{ user: null }}>
            <NotFound />
          </UserContext.Provider>
        </FirebaseContext.Provider>
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText("Not Found!"));
      expect(document.title).toBe("Not Found - Instagram");
    });
  });

  it("renders the not found page with user signed in", async () => {
    render(
      <Router>
        <FirebaseContext.Provider value={{ firebase: null }}>
          <UserContext.Provider value={{ user: { uid: 1234 } }}>
            <NotFound />
          </UserContext.Provider>
        </FirebaseContext.Provider>
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText("Not Found!"));
      expect(document.title).toBe("Not Found - Instagram");
    });
  });
});
