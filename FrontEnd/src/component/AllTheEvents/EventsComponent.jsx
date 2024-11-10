import React, { useState } from "react";
import stylesEvents from "./EventsComponent.module.css"; // Use CSS module

const EventsComponent = () => {
  const [isDashboardOpen, setDashboardOpen] = useState(false);

  const toggleDashboard = () => {
    setDashboardOpen(!isDashboardOpen);
  };

  return (
    <div className={stylesEvents.eventsContainer}>
      <h1 className={stylesEvents.eventsTitle}>All Events</h1>

      <div className={stylesEvents.eventsHeader}>
        {/* Add any content for the header if needed */}
      </div>

      <button
        className={stylesEvents.dashboardToggle}
        onClick={toggleDashboard}
      >
        {isDashboardOpen ? "Close Dashboard" : "Open Dashboard"}
      </button>

      {isDashboardOpen && (
        <div className={stylesEvents.dashboard}>Dashboard content here</div>
      )}

      <div className={stylesEvents.cardsSection}>
        {/* Event cards will go here */}
      </div>
    </div>
  );
};

export default EventsComponent;
