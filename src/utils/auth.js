// Demo-only authentication helpers.
// This project is frontend-only, so "authentication" is simulated using
// localStorage. No real security is implemented here — this is for
// demonstration purposes as part of a college project.

const USERS_KEY = 'fincentral_users';
const SESSION_KEY = 'fincentral_session';

// Get all registered demo users
export function getUsers() {
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Seed a default demo account the first time the app runs, so the
// login page always has something to demonstrate with.
export function ensureDemoUser() {
  const users = getUsers();
  const exists = users.some((u) => u.email === 'demo@fincentral.com');
  if (!exists) {
    users.push({
      fullName: 'Harshita Sharma',
      email: 'demo@fincentral.com',
      phone: '+91 98765 43210',
      dob: '1998-04-12',
      address: '221 MG Road, Bengaluru, Karnataka',
      password: 'Demo@1234',
      accountNumber: '5021489934521',
      ifsc: 'FCBL0001234',
      branch: 'Bengaluru — Koramangala Branch',
      accountType: 'Savings Account',
      accountOpened: '2021-03-18',
      accountStatus: 'Active',
    });
    saveUsers(users);
  }
}

export function registerUser(user) {
  const users = getUsers();
  if (users.some((u) => u.email.toLowerCase() === user.email.toLowerCase())) {
    return { success: false, message: 'An account with this email already exists.' };
  }
  const newUser = {
    ...user,
    accountNumber: generateAccountNumber(),
    ifsc: 'FCBL0001234',
    branch: 'Bengaluru — Koramangala Branch',
    accountType: 'Savings Account',
    accountOpened: new Date().toISOString().slice(0, 10),
    accountStatus: 'Active',
  };
  users.push(newUser);
  saveUsers(users);
  return { success: true };
}

function generateAccountNumber() {
  let num = '';
  for (let i = 0; i < 13; i++) num += Math.floor(Math.random() * 10);
  return num;
}

export function loginUser(email, password) {
  const users = getUsers();
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!user) {
    return { success: false, message: 'Incorrect email or password.' };
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify({ email: user.email }));
  return { success: true, user };
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser() {
  const session = localStorage.getItem(SESSION_KEY);
  if (!session) return null;
  const { email } = JSON.parse(session);
  const users = getUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export function isAuthenticated() {
  return !!localStorage.getItem(SESSION_KEY);
}

export function updateUser(email, updates) {
  const users = getUsers();
  const index = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
  if (index === -1) return null;
  users[index] = { ...users[index], ...updates };
  saveUsers(users);
  return users[index];
}

export function changePassword(email, currentPassword, newPassword) {
  const users = getUsers();
  const index = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
  if (index === -1) return { success: false, message: 'User not found.' };
  if (users[index].password !== currentPassword) {
    return { success: false, message: 'Current password is incorrect.' };
  }
  users[index].password = newPassword;
  saveUsers(users);
  return { success: true };
}
