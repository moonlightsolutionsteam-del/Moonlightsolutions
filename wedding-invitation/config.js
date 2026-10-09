// Edit this file to personalise the invitation. No other file needs to change.
window.WEDDING = {
  partner1: "Aria",
  partner2: "Julian",
  // Local time of the ceremony, ISO format (no timezone = viewer's local time)
  ceremonyStart: "2027-06-12T16:00:00",
  ceremonyEnd: "2027-06-12T17:00:00",
  venueName: "The Garden Pavilion",
  venueAddress: "123 Moonlight Avenue, Your City",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=123+Moonlight+Avenue",
  message:
    "With joyful hearts and the blessings of our families, we invite you to " +
    "celebrate the beginning of our forever. Your presence will make our day complete.",
  events: [
    { title: "Ceremony", time: "4:00 PM", where: "The Garden Pavilion", note: "Please be seated by 3:45 PM" },
    { title: "Cocktail Hour", time: "5:00 PM", where: "The Terrace", note: "Drinks & canapés" },
    { title: "Reception", time: "6:30 PM", where: "Grand Ballroom", note: "Dinner, toasts & dancing" }
  ],
  schedule: [
    ["3:30 PM", "Guests arrive"],
    ["4:00 PM", "Ceremony begins"],
    ["5:00 PM", "Cocktail hour"],
    ["6:30 PM", "Dinner & toasts"],
    ["8:00 PM", "First dance & party"],
    ["11:30 PM", "Farewell"]
  ],
  rsvpBy: "May 12, 2027",
  // RSVPs open the guest's email app addressed here until a backend is connected.
  rsvpEmail: "moonlightsolutionsteam@gmail.com"
};
