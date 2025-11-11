const API = "http://localhost:4000/api";
let user = null;

document.getElementById("loginBtn").addEventListener("click", login);

async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const res = await fetch(`${API}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (res.status === 401 || data.error) {
    document.getElementById("loginMsg").textContent = "❌ Invalid credentials!";
    return;
  }

  user = data;
  document.getElementById("loginSection").style.display = "none";
  document.getElementById("portalSection").style.display = "block";
  document.getElementById("userName").textContent = user.username;

  loadCourses();
  loadMyCourses();
}

async function loadCourses() {
  const res = await fetch(`${API}/courses`);
  const data = await res.json();
  const container = document.getElementById("courses");
  container.innerHTML = "";

  data.forEach((c) => {
    const div = document.createElement("div");
    div.className = "course";
    div.innerHTML = `<span>${c.code} - ${c.title} (${c.enrolled}/${c.capacity})</span>`;
    const btn = document.createElement("button");
    btn.textContent = "Register";
    btn.onclick = () => registerCourse(c.id);
    div.appendChild(btn);
    container.appendChild(div);
  });
}

async function loadMyCourses() {
  if (!user) return;
  const res = await fetch(`${API}/users/${user.id}/registrations`);
  const data = await res.json();
  const container = document.getElementById("myCourses");
  container.innerHTML = "";

  data.forEach((c) => {
    const div = document.createElement("div");
    div.className = "course";
    div.innerHTML = `<span>${c.code} - ${c.title}</span>`;
    const btn = document.createElement("button");
    btn.textContent = "Unregister";
    btn.classList.add("red");
    btn.onclick = () => unregisterCourse(c.id);
    div.appendChild(btn);
    container.appendChild(div);
  });
}

async function registerCourse(courseId) {
  if (!user) {
    alert("⚠️ Please login first!");
    return;
  }

  try {
    const res = await fetch(`${API}/users/${user.id}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId }),
    });

    const data = await res.json();

    if (data.error) {
      alert("⚠️ " + data.error);
      return;
    }

    alert("✅ Registered Successfully!");
    loadCourses();
    loadMyCourses();
  } catch (err) {
    console.error("Register error:", err);
    alert("❌ Failed to register. Check console for details.");
  }
}

async function unregisterCourse(courseId) {
  if (!user) return;

  try {
    await fetch(`${API}/users/${user.id}/unregister`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId }),
    });

    alert("🗑️ Unregistered Successfully!");
    loadCourses();
    loadMyCourses();
  } catch (err) {
    console.error(err);
  }
}
