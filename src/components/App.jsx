import React from "react";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import CurrentUserContext from "../contexts/currentUserContext";
import { api } from "../utils/Api";
import EditProfilePopup from "./EdtProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import Register from "./Register";
import Login from "./Login";
import * as auth from "../utils/auth";
import InfoToolTip from "./InfoToolTip";
import ProtectedRoute from "./ProtectedRoute";
import { useState } from "react";

function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [cards, setCards] = React.useState([]);
  const [currentUser, setCurrentUser] = React.useState({});

  const [email, setEmail] = React.useState("");
  const history = useHistory();
  const [isInfoToolTipPopupOpen, setInfoToolTipPopupOpen] =
    React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  

  React.useEffect(() => {
    setIsLoading(true);

    Promise.all([api.getProfile(), api.getInitialCards()])
      .then(([currentUserData, cards]) => {
        setCurrentUser(currentUserData);
        setCards(cards);
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  }, []);

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(!isEditAvatarPopupOpen);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(!isEditProfilePopupOpen);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(!isAddPlacePopupOpen);
  }

  function handleCardClick(card) {
    setSelectedCard({
      link: card.link,
      name: card.name,
    });
  }

  function handleLikeClick(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api
      .changeLikeCardStatus(card._id, isLiked)
      .then((newCardSomeLike) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCardSomeLike : c))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  React.useEffect(() => {
    function handleEscClose(evt) {
      if (evt.key === "Escape") {
        closeAllPopups();
      }
    }
    document.addEventListener("keydown", handleEscClose);

    return () => {
      document.removeEventListener("keydown", handleEscClose);
    };
  }, []);

  React.useEffect(() => {
    function handleOverlayClose(evt) {
      if (evt.target.classList.contains("popup_opened")) {
        closeAllPopups();
      }
    }
    document.addEventListener("click", handleOverlayClose);

    return () => {
      document.removeEventListener("click", handleOverlayClose);
    };
  }, []);

  React.useEffect(() => {
    setIsLoading(true);

   if (loggedIn) api
      .getProfile()
      .then((currentUserData) => {
        setCurrentUser(currentUserData);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false)); 
  }, [loggedIn]);

  function handleUpdateUser({ name, about }) {
    api
      .editProfile({ name, about })
      .then((currentUserData) => {
        setCurrentUser(currentUserData);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateAvatar({ avatar }, onSuccess) {
    api
      .setAvatar({ avatar })
      .then((currentUserData) => {
        setCurrentUser(currentUserData);
        onSuccess();
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleAddPlaceSubmit(name, link) {
    api
      .addCard({ name: name, link: link })
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const closeAllPopups = () => {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard(null);
    setInfoToolTipPopupOpen(false);
  };

  React.useEffect(() => {
  const tokenCheck = () => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      auth.checkToken(jwt).then((res) => {
        if (res?.data?.email) {
          setEmail(res.data.email);
          setLoggedIn(true);
          history.push('/');             
        }      
      }).catch(err => console.log(err));
    }
     
  };
  tokenCheck();
}, []);

  const handleLogin = (email, password) => {
   return auth.login(email, password)
    .then((data) => {
      if (!data?.token) {
        return Promise.reject('No data');
        }
        localStorage.setItem('jwt', data.token);
        setEmail(email);
        setLoggedIn(true);

    })
  }

  React.useEffect(() => {
    if (!loggedIn) return;

   //setEmail(email);
    history.push('/');

  }, [loggedIn]);


  const handleRegister = (email, password) => {
   return auth.register(email, password)
    .then((res) => {
      console.log(res);
      setInfoToolTipPopupOpen(true);
      setIsSuccess(true);
      history.push('/sign-in')
    })
    .catch(err => {
      console.log(err);
      setInfoToolTipPopupOpen(true);
      setIsSuccess(false);
    });
  }

  function handleSignOut() {
    localStorage.removeItem("jwt");
    setCurrentUser({});
    setLoggedIn(false);
    history.push('/sign-in');


  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      
     <div className="body">
        <div className="page">
       <Header email={email} onSignOut={handleSignOut} />
          <Switch>
          <ProtectedRoute
              exact
              path='/'
              loggedIn={loggedIn}
            >
            <Main
             onEditAvatar={handleEditAvatarClick}
             onEditProfile={handleEditProfileClick}
             onAddPlace={handleAddPlaceClick}
             onCardClick={handleCardClick}
             onCardLike={handleLikeClick}
             onCardDelete={handleCardDelete}
             cards={cards}
             isLoading={isLoading}
             />
             </ProtectedRoute>
          <Route path='/sign-in'>
            <Login onLogin={handleLogin} />
          </Route>
          <Route path='/sign-up'>
            <Register onRegister={handleRegister} />
          </Route>
          <Route>
          { loggedIn ? <Redirect to='/' /> : <Redirect to='/sign-in' /> }
            </Route>
            </Switch>
            <Footer />
           
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
          />
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlaceSubmit}
          />

          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
          />
          <PopupWithForm
            name={`delete`}
            title={`Вы уверены?`}
            buttonText="Да"
          />
          <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        </div>
        <InfoToolTip
          isOpen={isInfoToolTipPopupOpen}
          onClose={closeAllPopups}
          isSuccess={isSuccess}
        />
      </div>
      
    </CurrentUserContext.Provider>
  );
}

export default App;
