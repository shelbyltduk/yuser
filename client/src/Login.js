import React, {useState} from 'react';
import client from './feathers';
import Button from "@mui/material/Button";

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();

  function updateField(cb) {
    return ev => {
      cb(ev.target.value);
    };
  }

  function login() {
    return client
      .authenticate({
        strategy: 'local',
        email,
        password,
      })
      .catch(err => setError(err));
  }

  function signup() {
    return client
      .service('users')
      .create({email, password})
      .then(() => login());
  }

  return (
    <main className="login container">
      <div className="row">
        <div className="col-12 col-6-tablet push-3-tablet text-center heading">
          <h1 className="font-100">Login/Registration</h1>
          <p>{error && error.message}</p>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-6-tablet push-3-tablet col-4-desktop push-4-desktop">
          <form className="form">
            <fieldset>
              <input
                className="block"
                type="email"
                name="email"
                placeholder="email"
                onChange={updateField(setEmail)}
              />
            </fieldset>

            <fieldset>
              <input
                className="block"
                type="password"
                name="password"
                placeholder="password"
                onChange={updateField(setPassword)}
              />
            </fieldset>

            <div style={{justifyContent: "center", display: "flex", alignItems: "center", marginRight: "20px", marginLeft: "20px"}}>
              <Button onClick={() => login()} variant="outlined">Login</Button>
              <Button onClick={() => signup()} variant="outlined">Registration</Button>
            </div>

          </form>
        </div>
      </div>
    </main>
  );
};

export default Login;
