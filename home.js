import { auth } from './firebaseConfig.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js';

document.addEventListener('DOMContentLoaded', () => {
  // Create and style the loading indicator
  const loadingIndicator = document.createElement('div');
  loadingIndicator.id = 'loading';
  loadingIndicator.style.position = 'fixed';
  loadingIndicator.style.top = '0';
  loadingIndicator.style.left = '0';
  loadingIndicator.style.width = '100%';
  loadingIndicator.style.height = '100%';
  loadingIndicator.style.backgroundColor = 'white';
  loadingIndicator.style.color = 'black';
  loadingIndicator.style.display = 'flex';
  loadingIndicator.style.justifyContent = 'center';
  loadingIndicator.style.alignItems = 'center';
  loadingIndicator.style.zIndex = '9999';
  loadingIndicator.innerText = 'Loading...';
  document.body.appendChild(loadingIndicator);

  // Hide page content initially
  document.body.style.visibility = 'hidden';

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const role = user.email === 'muhammadnadeem34949@gmail.com' ? 'admin' : 'user';
      const redirectUrl = role === 'admin' ? 'admin.html' : 'user.html';
      
      // Redirect only if not already on the correct page
      if (window.location.pathname.split('/').pop() !== redirectUrl) {
        window.location.replace(redirectUrl);
      } else {
        // Show content if already on the correct page
        document.body.style.visibility = 'visible';
        loadingIndicator.style.display = 'none';
      }
    } else {
      // User is not authenticated, show content
      document.body.style.visibility = 'visible';
      loadingIndicator.style.display = 'none';
    }
  });
});
