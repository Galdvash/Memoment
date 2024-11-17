// controllers/eventController.js
import Event from "../models/eventModel.mjs";

// יצירת אירוע חדש
export const createEvent = async (req, res) => {
  try {
    const { eventName, date, location, description } = req.body;
    const userId = req.user._id;

    // אימות שדות נדרשים
    if (!eventName || !date || !location) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newEvent = new Event({
      user: userId,
      eventName,
      date,
      location,
      description,
    });

    await newEvent.save();

    res
      .status(201)
      .json({ message: "Event created successfully", eventId: newEvent._id });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Error creating event" });
  }
};

// קבלת אירוע לפי ID
export const getEventById = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ message: "Error fetching event" });
  }
};

// קבלת כל האירועים של המשתמש
export const getUserEvents = async (req, res) => {
  try {
    const userId = req.user._id;
    const events = await Event.find({ user: userId }).sort({ date: -1 });

    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Error fetching events" });
  }
};

// עדכון אירוע
export const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { eventName, date, location, description } = req.body;
    const userId = req.user._id;

    const event = await Event.findOne({ _id: eventId, user: userId });

    if (!event) {
      return res
        .status(404)
        .json({ message: "Event not found or not authorized" });
    }

    // עדכון השדות
    if (eventName) event.eventName = eventName;
    if (date) event.date = date;
    if (location) event.location = location;
    if (description) event.description = description;

    await event.save();

    res.status(200).json({ message: "Event updated successfully" });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Error updating event" });
  }
};

// מחיקת אירוע
export const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;

    const event = await Event.findOneAndDelete({ _id: eventId, user: userId });

    if (!event) {
      return res
        .status(404)
        .json({ message: "Event not found or not authorized" });
    }

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Error deleting event" });
  }
};

// פונקציה לקבלת כל האירועים עם האלבומים שלהם (כפי שהוזכר קודם)
export const getUserEventsWithAlbums = async (req, res) => {
  try {
    const userId = req.user._id;

    // שליפת האירועים של המשתמש
    const events = await Event.find({ user: userId }).lean();

    // שליפת האלבומים של המשתמש
    const albums = await Album.find({ user: userId }).lean();

    // שיוך האלבומים לאירועים
    const eventsWithAlbums = events.map((event) => {
      return {
        ...event,
        albums: albums.filter(
          (album) => album.event.toString() === event._id.toString()
        ),
      };
    });

    res.status(200).json(eventsWithAlbums);
  } catch (error) {
    console.error("Error fetching events and albums:", error);
    res.status(500).json({ message: "Error fetching events and albums" });
  }
};
