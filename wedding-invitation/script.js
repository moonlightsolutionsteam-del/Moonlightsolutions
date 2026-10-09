(function () {
  var W = window.WEDDING;
  var $ = function (id) { return document.getElementById(id); };
  var start = new Date(W.ceremonyStart);
  var end = new Date(W.ceremonyEnd);

  function text(id, value) { $(id).textContent = value; }
  function el(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    return e;
  }

  // Static content (textContent only, so config values are never parsed as HTML)
  text("name1", W.partner1);
  text("name2", W.partner2);
  text("footerNames", W.partner1 + " & " + W.partner2);
  text("message-text", W.message);
  text("heroDate", start.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" }));
  text("heroPlace", W.venueName + " · " + W.venueAddress);
  text("rsvp-note", "Kindly reply by " + W.rsvpBy + ".");
  $("mapLink").href = W.mapUrl;
  document.title = W.partner1 + " & " + W.partner2 + " | Wedding Invitation";

  W.events.forEach(function (ev) {
    var card = el("article", "card");
    card.appendChild(el("h3", null, ev.title));
    card.appendChild(el("p", "time", ev.time));
    card.appendChild(el("p", null, ev.where));
    card.appendChild(el("p", "note", ev.note));
    $("events").appendChild(card);
  });

  W.schedule.forEach(function (row) {
    var li = el("li");
    li.appendChild(el("span", "t", row[0]));
    li.appendChild(document.createTextNode(row[1]));
    $("timeline").appendChild(li);
  });

  // Countdown
  function tick() {
    var box = $("countdown");
    var diff = start - new Date();
    if (diff <= 0) { box.textContent = "Today is the day!"; return; }
    var parts = [
      ["Days", Math.floor(diff / 864e5)],
      ["Hours", Math.floor(diff / 36e5) % 24],
      ["Mins", Math.floor(diff / 6e4) % 60],
      ["Secs", Math.floor(diff / 1e3) % 60]
    ];
    box.textContent = "";
    parts.forEach(function (p) {
      var d = el("div");
      d.appendChild(el("b", null, String(p[1])));
      d.appendChild(el("small", null, p[0]));
      box.appendChild(d);
    });
  }
  tick();
  setInterval(tick, 1000);

  // Add to calendar (.ics download)
  function ics(d) { return d.toISOString().replace(/[-:]|\.\d{3}/g, ""); }
  function esc(s) { return String(s).replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n"); }
  $("addCal").addEventListener("click", function () {
    var lines = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Moonlight Solutions//Wedding//EN",
      "BEGIN:VEVENT",
      "UID:" + ics(start) + "@moonlightsolutions",
      "DTSTAMP:" + ics(new Date()),
      "DTSTART:" + ics(start),
      "DTEND:" + ics(end),
      "SUMMARY:" + esc(W.partner1 + " & " + W.partner2 + " Wedding"),
      "LOCATION:" + esc(W.venueName + ", " + W.venueAddress),
      "END:VEVENT", "END:VCALENDAR"
    ];
    var url = URL.createObjectURL(new Blob([lines.join("\r\n")], { type: "text/calendar" }));
    var a = el("a");
    a.href = url;
    a.download = "wedding.ics";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  // RSVP: opens the guest's email app with a prefilled reply
  $("rsvpForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var f = e.target;
    var status = $("rsvpStatus");
    if (!f.name.value.trim()) { status.textContent = "Please enter your name."; f.name.focus(); return; }
    var body = [
      "Name: " + f.name.value.trim(),
      "Guests: " + f.guests.value,
      "Response: " + f.attending.value,
      "Message: " + f.note.value.trim()
    ].join("\n");
    var subject = "RSVP - " + W.partner1 + " & " + W.partner2 + " Wedding";
    window.location.href = "mailto:" + W.rsvpEmail +
      "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    status.textContent = "Thank you! Please send the email that just opened to confirm.";
  });
})();
