import { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import FirebaseContext from "../context/firebase";

function Login() {
  const history = useHistory();
  const { firebase } = useContext(FirebaseContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const isInvalid = password === "" || email === "";

  function handleLogin() {}

  useEffect(() => {
    document.title = "Login - Instagram";
  }, []);

  return <div>LOGIN</div>;
}

export default Login;
