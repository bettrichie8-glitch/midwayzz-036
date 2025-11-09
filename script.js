const BOSS_NUMBER = "254724821099";
const MADAM_NUMBER = "254726954750";

function openBookingModal(target) {
  const modal = document.getElementById("bookingModal");
  modal.classList.remove("hidden");
  if(target) {
    document.getElementById("bk_target").value = target;
  }
}

function closeBookingModal() {
  document.getElementById("bookingModal").classList.add("hidden");
}

// Booking form submit
document.getElementById("bookingForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("bk_name").value.trim();
  const phone = document.getElementById("bk_phone").value.trim();
  const checkin = document.getElementById("bk_checkin").value;
  const nights = document.getElementById("bk_nights").value;
  const target = document.getElementById("bk_target").value;

  if (!name || !phone || !checkin) {
    alert("Please fill all required fields!");
    return;
  }

  const ref = "MW" + Math.floor(Math.random() * 9000 + 1000);
  const message =
    `Hello 👋%0A%0AI would like to book a room at MIDWAYZZ.%0A%0A` +
    `Booking Ref: ${ref}%0A` +
    `Name: ${name}%0A` +
    `Phone: ${phone}%0A` +
    `Check-in: ${checkin}%0A` +
    `Nights: ${nights}%0A%0A` +
    `Please confirm availability.`;

  const number = target === "madam" ? MADAM_NUMBER : BOSS_NUMBER;
  const waLink = `https://wa.me/${number}?text=${message}`;
  window.open(waLink, "_blank");

  closeBookingModal();
  document.getElementById("bookingForm").reset();
});

// Floating WhatsApp buttons direct chat
document.querySelector(".whatsapp-float.boss").addEventListener("click", () => {
  const waLink = `https://wa.me/${BOSS_NUMBER}?text=Hi Boss 👋`;
  window.open(waLink, "_blank");
});

document.querySelector(".whatsapp-float.madam").addEventListener("click", () => {
  const waLink = `https://wa.me/${MADAM_NUMBER}?text=Hi Madam Boss 👋`;
  window.open(waLink, "_blank");
});

// Welcome popup
window.onload = function () {
  setTimeout(() => {
    document.getElementById("welcomePopup").classList.remove("hidden");
  }, 3000);
};

function closePopup() {
  document.getElementById("welcomePopup").classList.add("hidden");
}
