const token = sessionStorage.getItem('token');

// Check if the token exists and is not expired
if (token) {
  const decodedToken = jwt.decode(token);
  const expirationTime = decodedToken.exp * 1000; // Convert expiration time to milliseconds

  // Calculate the remaining time until token expiration
  const currentTime = Date.now();
  const timeUntilExpiration = expirationTime - currentTime;

  // Schedule a function to be executed when the token expires
  setTimeout(() => {
    // Token has expired, perform necessary actions
    handleTokenExpiration();
  }, timeUntilExpiration);
}

function handleTokenExpiration() {
  // Token has expired, clear it from sessionStorage and perform additional actions
  sessionStorage.removeItem('token');
  // Perform any other actions or redirect the user to a login page, for example
  window.location.href = 'http://192.168.1.240:8080/index.html';
}
