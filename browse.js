document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("browse-list");
  const searchInput = document.getElementById("search-input");

  function getUser() {
    return JSON.parse(localStorage.getItem("currentUser")) || null;
  }

  // ✅ Load & filter items
  function loadItems(filter = "") {
    const items = JSON.parse(localStorage.getItem("items")) || [];
    list.innerHTML = "";

    // 🔍 Filter items by title, category, or location
    const filtered = items.filter(item =>
      item.title.toLowerCase().includes(filter.toLowerCase()) ||
      item.category.toLowerCase().includes(filter.toLowerCase()) ||
      item.location.toLowerCase().includes(filter.toLowerCase())
    );

    if (filtered.length === 0) {
      list.innerHTML = `<p class="text-center text-muted">No items found.</p>`;
      return;
    }

    filtered.forEach(item => {
      const col = document.createElement("div");
      col.className = "col-md-4 mb-4";

      // 🪄 Highlight matched text
      const highlight = (text) => {
        if (!filter) return text;
        const regex = new RegExp(`(${filter})`, "gi");
        return text.replace(regex, `<mark>$1</mark>`);
      };

      col.innerHTML = `
        <div class="card shadow-sm border-0">
          <img src="${item.images[0]}" class="card-img-top" alt="${item.title}">
          <div class="card-body">
            <h5 class="card-title fw-bold text-primary">${highlight(item.title)}</h5>
            <p class="small text-muted mb-1">${highlight(item.location)}</p>
            <p class="fw-semibold mb-2">₹${item.rent} / month</p>
            <button class="btn btn-outline-primary w-100 mt-2 btn-view" data-id="${item.id}">
              View Details
            </button>

            <div class="details mt-3" style="display:none;">
              <p class="text-muted mb-1"><strong>Description:</strong> ${item.description}</p>
              <p class="text-muted mb-1"><strong>Category:</strong> ${item.category}</p>
              <p class="text-muted mb-1"><strong>Address:</strong> ${item.address}</p>
              
              <button class="btn btn-primary w-100 mt-2 btn-book" data-id="${item.id}">
                Book / Rent
              </button>

              <div class="booking-form mt-3" style="display:none;">
                <input type="text" class="form-control mb-2 name" placeholder="Your Name">
                <input type="text" class="form-control mb-2 phone" placeholder="Contact Number">
                <input type="text" class="form-control mb-2 duration" placeholder="Rental Duration (days)">
                <button class="btn btn-success w-100 btn-confirm-book">Confirm Booking</button>
              </div>
            </div>
          </div>
        </div>
      `;
      list.appendChild(col);
    });

    // 🎯 Handle View Details Toggle
    document.querySelectorAll(".btn-view").forEach(btn => {
      btn.addEventListener("click", e => {
        const details = e.target.closest(".card-body").querySelector(".details");
        details.style.display = details.style.display === "none" ? "block" : "none";
      });
    });

    // 📦 Handle Book button click
    document.querySelectorAll(".btn-book").forEach(btn => {
      btn.addEventListener("click", e => {
        const card = e.target.closest(".card-body");
        const bookingForm = card.querySelector(".booking-form");
        const user = getUser();

        if (user) {
          bookingForm.querySelector(".name").value = user.name || "";
          bookingForm.querySelector(".phone").value = user.phone || "";
        }

        bookingForm.style.display = "block";
      });
    });

    // ✅ Confirm Booking
    document.querySelectorAll(".btn-confirm-book").forEach(btn => {
      btn.addEventListener("click", e => {
        const card = e.target.closest(".card-body");
        const itemId = card.querySelector(".btn-book").dataset.id;
        const name = card.querySelector(".name").value.trim();
        const phone = card.querySelector(".phone").value.trim();
        const duration = card.querySelector(".duration").value.trim();

        if (!name || !phone || !duration) {
          alert("Please fill all booking details!");
          return;
        }

        const items = JSON.parse(localStorage.getItem("items")) || [];
        const selected = items.find(i => i.id == itemId);
        if (!selected) return;

        const booking = {
          id: Date.now(),
          itemId: selected.id,
          itemTitle: selected.title,
          owner: selected.owner,
          name,
          phone,
          duration,
          date: new Date().toLocaleDateString()
        };

        const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
        bookings.push(booking);
        localStorage.setItem("bookings", JSON.stringify(bookings));

        alert("✅ Booking confirmed!");
        card.querySelector(".booking-form").style.display = "none";
      });
    });
  }

  // 🔍 Live search listener
  searchInput.addEventListener("input", e => {
    const query = e.target.value.trim();
    loadItems(query);
  });

  // Initial load
  loadItems();
});
