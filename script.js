// Event data is stored in the HTML cards; this array stores registrations.
const registrations = [];

const cards = document.querySelectorAll(".event-card");
const selectedEventInput = document.querySelector("#selectedEvent");
const selectedText = document.querySelector("#selectedText");
const form = document.querySelector("#registrationForm");
const nameInput = document.querySelector("#fullName");
const emailInput = document.querySelector("#email");
const groupInput = document.querySelector("#group");
const agreementInput = document.querySelector("#agreement");

function showError(input, errorId, message) {
  document.querySelector(`#${errorId}`).textContent = message;
  if (input) input.classList.toggle("input-error", message !== "");
}

function validateForm() {
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const group = groupInput.value.trim();
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  showError(nameInput, "nameError", name.length < 3 ? "Enter at least 3 characters." : "");
  showError(emailInput, "emailError", !validEmail ? "Enter a valid email address." : "");
  showError(groupInput, "groupError", group === "" ? "Enter your student group." : "");
  showError(null, "agreementError", !agreementInput.checked ? "You must agree to the rules." : "");
  showError(null, "eventError", selectedEventInput.value === "" ? "Please select an event." : "");

  return name.length >= 3 && validEmail && group !== "" && agreementInput.checked && selectedEventInput.value !== "";
}

function selectEvent(card) {
  cards.forEach(function (item) { item.classList.remove("selected-event"); });
  card.classList.add("selected-event");
  selectedEventInput.value = card.dataset.event;
  selectedText.textContent = `Selected: ${card.dataset.event}`;
  showError(null, "eventError", "");
}

cards.forEach(function (card) {
  card.querySelector(".select-button").addEventListener("click", function () {
    selectEvent(card);
  });
});

document.querySelector("#themeButton").addEventListener("click", function () {
  document.body.classList.toggle("dark-theme");
  this.textContent = document.body.classList.contains("dark-theme") ? "Light theme" : "Dark theme";
});

nameInput.addEventListener("input", function () {
  document.querySelector("#nameCount").textContent = `${this.value.length} characters`;
  if (this.value.trim().length >= 3) showError(nameInput, "nameError", "");
});

emailInput.addEventListener("input", function () {
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value.trim())) showError(emailInput, "emailError", "");
});

groupInput.addEventListener("input", function () {
  if (this.value.trim() !== "") showError(groupInput, "groupError", "");
});

agreementInput.addEventListener("change", function () {
  if (this.checked) showError(null, "agreementError", "");
});

form.addEventListener("submit", function (event) {
  event.preventDefault();
  if (!validateForm()) return;

  const registration = {
    name: nameInput.value.trim(),
    event: selectedEventInput.value,
    group: groupInput.value.trim()
  };
  registrations.push(registration);

  document.querySelector("#successMessage").textContent = `${registration.name}, you are registered for ${registration.event}!`;
  const item = document.createElement("li");
  item.textContent = `${registration.name} — ${registration.event} (${registration.group})`;
  document.querySelector("#registrationList").appendChild(item);

  form.reset();
  document.querySelector("#nameCount").textContent = "0 characters";
  cards.forEach(function (card) { card.classList.remove("selected-event"); });
  selectedText.textContent = "No event selected";
});

async function loadGuests() {
  const status = document.querySelector("#guestStatus");
  const list = document.querySelector("#guestList");
  const button = document.querySelector("#loadGuestsButton");
  list.textContent = "";
  status.textContent = "Loading guests...";
  button.disabled = true;

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!response.ok) throw new Error("Request failed");
    const guests = await response.json();

    guests.slice(0, 5).forEach(function (guest) {
      const card = document.createElement("article");
      card.classList.add("guest-card");

      const name = document.createElement("h3");
      name.textContent = guest.name;
      const email = document.createElement("p");
      email.textContent = guest.email;
      const website = document.createElement("a");
      website.href = `https://${guest.website}`;
      website.target = "_blank";
      website.textContent = guest.website;

      card.append(name, email, website);
      list.appendChild(card);
    });
    status.textContent = "Five guests loaded successfully.";
  } catch (error) {
    status.textContent = "Could not load guests. Please try again later.";
  } finally {
    button.disabled = false;
  }
}

document.querySelector("#loadGuestsButton").addEventListener("click", loadGuests);
