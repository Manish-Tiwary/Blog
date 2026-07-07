// Base client authorization fetch header constructor
export async function authenticatedFetch(url, options = {}) {
  let token = localStorage.getItem("access_token");
  options.headers = {
    ...options.headers,
    "Authorization": `Bearer ${token}`,
  };
  let res = await fetch(url, options);
  if (res.status === 401) {
    const refresh = localStorage.getItem("refresh_token");
    const refreshRes = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    if (refreshRes.ok) {
      const refreshData = await refreshRes.json();
      localStorage.setItem("access_token", refreshData.access);
      options.headers["Authorization"] = `Bearer ${refreshData.access}`;
      res = await fetch(url, options);
    } else {
      localStorage.clear();
      window.location.href = "/login";
    }
  }
  return res;
}