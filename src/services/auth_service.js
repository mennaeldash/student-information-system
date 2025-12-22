// src/services/auth_service.js
export async function login(student_id, password) {
  try {
    const response = await fetch('https://eelu-test.runasp.net/api/authentication_conntroller/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_id, password }),
    });

    const text = await response.text();
    let data;
    try { data = text ? JSON.parse(text) : null; } catch { data = text; }

    if (!response.ok) {
      const err = new Error(`HTTP ${response.status}`);
      err.status = response.status;
      err.body = data;
      throw err;
    }
    return data; // غالبًا { token?, profile? }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}
