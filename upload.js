document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("upload-form");
  const imageInput = document.getElementById("item-images");
  const preview = document.getElementById("preview");
  const userItemsDiv = document.getElementById("user-items");
  const bookingList = document.getElementById("booking-list");

  let imageURLs = [];

  // Preview images
  imageInput.addEventListener("change", () => {
    preview.innerHTML = "";
    imageURLs = [];

    [...imageInput.files].forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        imageURLs.push(e.target.result);
        const img = document.createElement("img");
        img.src = e.target.result;
        img.className = "rounded border";
        img.style.width = "80px";
        img.style.height = "80px";
        img.style.objectFit = "cover";
        preview.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
  });

  // Submit new item
  form.addEventListener("submit", e => {
    e.preventDefault();

    const title = document.getElementById("item-title").value.trim();
    const description = document.getElementById("item-description").value.trim();
    const category = document.getElementById("item-category").value;
    const rent = document.getElementById("item-rent").value.trim();
    const address = document.getElementById("item-address").value.trim();
    const location = document.getElementById("item-location").value.trim();

    if (!imageURLs.length) return alert("Please upload at least one image!");

    const userEmail = localStorage.getItem("loggedInUser") || "guest@example.com";

    const item = {
      id: Date.now(),
      title,
      description,
      category,
      rent,
      address,
      location,
      images: imageURLs,
      owner: userEmail,
      date: new Date().toLocaleDateString()
    };

    const items = JSON.parse(localStorage.getItem("items")) || [];
    items.push(item);
    localStorage.setItem("items", JSON.stringify(items));

    alert("Item uploaded successfully!");
    form.reset();
    preview.innerHTML = "";
    loadUserItems();
  });

  // Load user's posted items
  function loadUserItems() {
    const userEmail = localStorage.getItem("loggedInUser") || "guest@example.com";
    const items = JSON.parse(localStorage.getItem("items")) || [];
    const userItems = items.filter(item => item.owner === userEmail);
    userItemsDiv.innerHTML = "";

    if (userItems.length === 0) {
      userItemsDiv.innerHTML = `<p class="text-muted text-center">No items uploaded yet.</p>`;
      return;
    }

    userItems.forEach(item => {
      const col = document.createElement("div");
      col.className = "col-md-4";
      col.innerHTML = `
        <div class="card shadow-sm border-0">
          <img src="${item.images[0]}" class="card-img-top" alt="${item.title}">
          <div class="card-body">
            <h5 class="card-title fw-bold text-primary">${item.title}</h5>
            <p class="card-text small text-muted mb-2">${item.description.slice(0, 60)}...</p>
            <p class="small mb-2"><strong>Rent:</strong> ₹${item.rent}/month</p>
            <button class="btn btn-outline-danger w-100 btn-delete" data-id="${item.id}">Delete</button>
          </div>
        </div>
      `;
      userItemsDiv.appendChild(col);
    });

    // Delete functionality
    document.querySelectorAll(".btn-delete").forEach(btn => {
      btn.addEventListener("click", e => {
        const id = Number(e.target.dataset.id);
        const updatedItems = items.filter(item => item.id !== id);
        localStorage.setItem("items", JSON.stringify(updatedItems));
        loadUserItems();
      });
    });
  }

  // Load bookings made by others
  function loadBookings() {
  const userEmail = localStorage.getItem("loggedInUser") || "guest@example.com";
  const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
  const items = JSON.parse(localStorage.getItem("items")) || [];

  // 🩹 Fix older bookings missing 'owner'
  bookings.forEach(b => {
    if (!b.owner && b.itemTitle) {
      const match = items.find(i => i.title === b.itemTitle);
      if (match && match.owner) b.owner = match.owner;
    }
  });
  localStorage.setItem("bookings", JSON.stringify(bookings));

  const userBookings = bookings.filter(b => b.owner === userEmail);

  bookingList.innerHTML = "";
  if (userBookings.length === 0) {
    bookingList.innerHTML = `<p class="text-muted text-center">No bookings yet.</p>`;
    return;
  }

  userBookings.forEach(b => {
    const col = document.createElement("div");
    col.className = "col-md-4";
    col.innerHTML = `
      <div class="card border-0 shadow-sm">
        <div class="card-body">
          <h6 class="fw-bold text-primary">${b.itemTitle}</h6>
          <p class="small text-muted mb-1"><strong>Booked By:</strong> ${b.name}</p>
          <p class="small mb-1"><strong>Contact:</strong> ${b.phone}</p>
          <p class="small mb-0"><strong>Duration:</strong> ${b.duration} days</p>
        </div>
      </div>
    `;
    bookingList.appendChild(col);
  });
}

  
  

  loadUserItems();
  loadBookings();
});
