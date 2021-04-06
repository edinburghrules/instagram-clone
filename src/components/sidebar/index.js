import useUser from "../../hooks/use-user";
import User from "./user";
import Suggestions from "./suggestions";

export default function Sidebar() {
  // useUser returns a user details object from firestore.
  const {
    user: { username, fullName, userId },
  } = useUser();
  return (
    <div className="p-4">
      <User username={username} fullname={fullName} />
      <Suggestions userId={userId} />
    </div>
  );
}
