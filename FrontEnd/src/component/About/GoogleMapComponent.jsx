import React from 'react';
import { GoogleMap } from '@react-google-maps/api';
const clientId = "738992764931-l8coi7l2mhtbg1ll6ck5au9lell05dd0.apps.googleusercontent.com"

const GoogleMapComponent = () => {
  
  return (
    <div>
     <GoogleMap
     clientId={clientId}
     buttonText="Login"
     />
    </div>
  );
};

export default GoogleMapComponent;

