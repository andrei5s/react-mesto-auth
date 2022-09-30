import React, { useState } from "react";
import { Link } from "react-router-dom";

const Register = (props) => {
  //const [password, setPassword] = React.useState("");
  //const [email, setEmail] = React.useState("");
  const [state, setState] = React.useState({
    email: '',
    password: '',
   // message: ''
  });

  const handleChange = e => {
    const { name, value } = e.target;

    setState(old =>({
      ...old,
      [name]: value,
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const { email, password } = state;
    props.onRegister(email, password)
   .catch(err => {
      console.log(err);
       setState(old => ({
        ...old,
        message: 'Что-то пошло не так!'
      }));
    });
  };


  /*const handlePasswordCahnge = (e) => {
    setPassword(e.target.value);
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    props.onRegister(email, password);
  };*/

 /* const handlePathChange = (newPath) => {
    props.onPathChange(newPath);
  };

  React.useEffect(() => {
    handlePathChange("/sign-up");
  }, []);*/

  return (
    <div className="registration">
      <h2 className="registration__title">Регистрация</h2>
      <form className="registration__form" onSubmit={handleSubmit}>
        <fieldset className="registration__info-input">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="registration__input"
            onChange={handleChange}
            value={state.email}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            className="registration__input"
            onChange={handleChange}
            value={state.password}
            required
          />
          <button
            className="registration__button"
            type="submit"
            aria-label="Зарегистрироваться"
           
          >
            Зарегистрироваться
          </button>
          <p className="registration__subtitle">
            Уже зарегистрированы?
            <Link to='sign-in' className="registration__link">Войти</Link>
          </p>
        </fieldset>
      </form>
    </div>
  );
}

export default Register;
