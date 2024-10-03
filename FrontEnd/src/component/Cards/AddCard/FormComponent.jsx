import React from 'react';
import styleForm from './FormComponent.module.css';
import axios from 'axios';

const FormComponent = ({ handleChange, handleSubmit, formValid, formData, closeForm, addCardToList }) => {
  const token = localStorage.getItem('token');

  const addCard = async () => {
    if (!token) {
      console.error('No token found in localStorage');
      return;
    }

    try {
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards',
        headers: {
          'x-auth-token': token,
        },
        data: {
          title: formData.title,
          subtitle: formData.subtitle,
          description: formData.description,
          phone: formData.phone,
          email: formData.email,
          web: formData.web,
          image: {
            url: formData.image.url,
            alt: formData.image.alt
          },
          address: {
            city: formData.city,
            country: formData.country,
            state: formData.state,
            street: formData.street,
            houseNumber: formData.houseNumber,
            zip: formData.zip,
          },
        },
      };

      const response = await axios(config);
      console.log('Card added successfully:', response.data);

      // Update card list automatically
      addCardToList(response.data);

      closeForm(); // Close the form after the card is added successfully
    } catch (error) {
      console.error('Error adding card:', error);
    }
  };

  return (
    <div className={styleForm.container}>
      <div className={styleForm.containerForm}>
        <button className={styleForm.btn} onClick={closeForm}>X</button>
        <form className={styleForm.form} onSubmit={handleSubmit}>
          <div className={styleForm.section}>
            <label className={styleForm.label}>Title*:</label>
            <br />
            <input
              className={styleForm.input}
              type="text"
              name="title"
              required
              onChange={handleChange}
            />
            <label className={styleForm.label}>Subtitle*:</label>
            <br />
            <input
              className={styleForm.input}
              type="text"
              name="subtitle"
              required
              onChange={handleChange}
            />
          </div>
          <label>Description*:</label>
          <input
            className={styleForm.input}
            type="text"
            name="description"
            required
            onChange={handleChange}
          />
          <hr />
          <div className={styleForm.section}>
            <label className={styleForm.label}>Phone*:</label>
            <input
              className={styleForm.input}
              type="tel"
              name="phone"
              required
              onChange={handleChange}
            />
            <label className={styleForm.label}>Email*:</label>
            <input
              className={styleForm.input}
              type="email"
              name="email"
              required
              onChange={handleChange}
            />
          </div>
          <label>Web (URL for the website):</label>
          <input
            className={styleForm.input}
            type="url"
            name="web"
            onChange={handleChange}
          />
          <hr />
          <div className={styleForm.section}>
            <label className={styleForm.label}>Image URL:</label>
            <input
              className={styleForm.input}
              type="url"
              name="image.url"
              onChange={handleChange}
         
            />
            <label className={styleForm.label}>Image Alt:</label>
            <input
              className={styleForm.input}
              type="text"
              name="image.alt"
              onChange={handleChange}
         
            />
          </div>
          <hr />
          <div className={styleForm.section}>
            <label>City*:</label>
            <input
              className={styleForm.input}
              type="text"
              name="city"
              required
              onChange={handleChange}
            />
            <hr />
            <label>Country*:</label>
            <input
              className={styleForm.input}
              type="text"
              name="country"
              required
              onChange={handleChange}
            />
          </div>
          <label>State:</label>
          <input
            className={styleForm.input}
            type="text"
            name="state"
            onChange={handleChange}
          />
          <hr />
          <div className={styleForm.section}>
            <label>Street*:</label>
            <input
              className={styleForm.input}
              type="text"
              name="street"
              required
              onChange={handleChange}
            />
            <label>House Number*:</label>
            <input
              className={styleForm.input}
              type="text"
              name="houseNumber"
              required
              onChange={handleChange}
            />
          </div>
          <label>Zip*:</label>
          <input
            className={styleForm.input}
            type="text"
              name="zip"
  
              onChange={handleChange}
          />
          <hr />
          <button onClick={addCard} type="button" disabled={!formValid} style={{ cursor: formValid ? 'pointer' : 'not-allowed' }}>Send</button>
        </form>
      </div>
    </div>
  );
};

export default FormComponent;
