import React, { useEffect, useState } from "react";
import axios from "axios";
import useGetUser from "../../hooks/UserHooks/useGetUser";
import Loading from "../Loading/Loading";
import FormComponent from "./AddCard/FormComponent";
import styleCards from "./Cards.module.css";
import useAddCards from "./AddCard/useAddCards";

const MyCards = () => {
  const [cards, setCards] = useState([]);
  const { userInformation } = useGetUser(); 
  const { isClick, handleChange, handleSubmit, formValid, formData, closeForm, OpenAndCloseCard } = useAddCards();

  useEffect(() => {
    const fetchCards = async () => {
      if (userInformation) {
        const token = localStorage.getItem('token');
        try {
          const response = await axios.get('https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards/my-cards', {
            headers: {
              'x-auth-token': token
            },
          });
          setCards(response.data);
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchCards();
  }, [userInformation]);

  const addCardToList = (newCard) => {
    setCards((prevCards) => [newCard, ...prevCards]);
  };

  if (!userInformation || !cards) {
    return <Loading />;
  }

  return (
    <div>
      <div className="bodyCards">
        <div className={styleCards.container_cards}>
          <div className={styleCards.frontCard}>
            <h1 className={styleCards.stickTitle}>My Cards</h1>
            {cards.length === 0 && <div>No cards found</div>}
            <ul className={styleCards.listOfCards}>
              {cards.map((card) => (
                <li className={styleCards.item} key={card._id}>
                  <img
                    className={styleCards.imgCards}
                    src={card.image.url}
                    alt={card.image.alt}
                  />
                  <h2>{card.title}</h2>
                  <p className={styleCards.p}>{card.subtitle}</p>
                  <p className={styleCards.p}>{card.address.country}</p>
                </li>
              ))}
            </ul>
            {(userInformation.isAdmin || userInformation.isBusiness) && (
              <>
                <button onClick={OpenAndCloseCard}>+</button>
                {isClick && (
                  <FormComponent
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    formValid={formValid}
                    formData={formData}
                    closeForm={closeForm}
                    addCardToList={addCardToList}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCards;
