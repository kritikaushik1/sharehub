document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("currentUser")) || null;
  if (!user) {
    alert("Please log in first!");
    window.location.href = "index.html";
    return;
  }

  // Elements
  const nameEl = document.getElementById("profile-name");
  const emailEl = document.getElementById("profile-email");
  const picEl = document.getElementById("profile-pic");
  const aboutEl = document.getElementById("about-text");
  const statItems = document.getElementById("stat-items");
  const statBookings = document.getElementById("stat-bookings");
  const statActive = document.getElementById("stat-active");
  const myItemsDiv = document.getElementById("my-items");
  const myBookingsDiv = document.getElementById("my-bookings");

  // Fill profile info
  nameEl.textContent = user.name || "Unnamed User";
  emailEl.textContent = user.email || "No email available";
  if (user.about) aboutEl.textContent = user.about;
  if (user.profilePic) picEl.src = user.profilePic;

  // Load uploaded items
  const items = JSON.parse(localStorage.getItem("items")) || [];
  const userItems = items.filter(i => i.owner === user.email || i.ownerName === user.name);
  statItems.textContent = userItems.length;

  if (userItems.length === 0) {
    myItemsDiv.innerHTML = `<p class="text-center text-muted">No items uploaded yet.</p>`;
  } else {
    myItemsDiv.innerHTML = "";
    userItems.forEach(item => {
      const col = document.createElement("div");
      col.className = "col-md-4";
      col.innerHTML = `
        <div class="card shadow-sm">
          <img src="${item.images[0] || 'https://via.placeholder.com/200'}" alt="">
          <div class="card-body">
            <h5 class="fw-bold">${item.title}</h5>
            <p class="small text-muted">${item.category}</p>
            <p><strong>₹${item.rent}</strong> / month</p>
            <button class="btn btn-outline-danger w-100 btn-delete" data-id="${item.id}">Delete</button>
          </div>
        </div>`;
      myItemsDiv.appendChild(col);
    });
  }

  // Delete uploaded item
  document.querySelectorAll(".btn-delete").forEach(btn => {
    btn.addEventListener("click", e => {
      const id = Number(e.target.dataset.id);
      const updated = items.filter(i => i.id !== id);
      localStorage.setItem("items", JSON.stringify(updated));
      window.location.reload();
    });
  });

  // Load bookings
  const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
  const myBookings = bookings.filter(b => b.email === user.email || b.name === user.name);
  statBookings.textContent = myBookings.length;
  statActive.textContent = Math.min(myBookings.length, 3); // placeholder active count

  if (myBookings.length === 0) {
    myBookingsDiv.innerHTML = `<p class="text-center text-muted">No bookings yet.</p>`;
  } else {
    myBookingsDiv.innerHTML = "";
    myBookings.forEach(b => {
      const col = document.createElement("div");
      col.className = "col-md-4";
      col.innerHTML = `
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <h5 class="fw-bold text-primary">${b.itemTitle}</h5>
            <p class="mb-1"><strong>Duration:</strong> ${b.duration} days</p>
            <p class="mb-1"><strong>Contact:</strong> ${b.phone}</p>
            <p class="text-muted small mb-0"><strong>Owner:</strong> ${b.owner}</p>
          </div>
        </div>`;
      myBookingsDiv.appendChild(col);
    });
  }

  // Edit Profile
  const editBtn = document.getElementById("edit-profile-btn");
  const saveBtn = document.getElementById("save-profile");
  const editName = document.getElementById("edit-name");
  const editPhone = document.getElementById("edit-phone");
  const editPic = document.getElementById("edit-pic");
  const editAbout = document.getElementById("edit-about");

  editBtn.addEventListener("click", () => {
    editName.value = user.name || "";
    editPhone.value = user.phone || "";
    editAbout.value = user.about || "";
    new bootstrap.Modal(document.getElementById("editModal")).show();
  });

  saveBtn.addEventListener("click", () => {
  user.name = editName.value.trim();
  user.phone = editPhone.value.trim();
  user.about = editAbout.value.trim();

  const file = editPic.files[0];

  const saveAndClose = () => {
    localStorage.setItem("currentUser", JSON.stringify(user));
    localStorage.setItem("loggedInUser", user.email);

    const modalEl = document.getElementById("editModal");
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();  // ✅ closes modal properly
    window.location.reload();
  };

  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      user.profilePic = e.target.result;
      saveAndClose(); // ✅ ensures modal closes after image load
    };
    reader.readAsDataURL(file);
  } else {
    saveAndClose();
  }
});

   

  // Logout
  document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "profile.html";
  });
});
