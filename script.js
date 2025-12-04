// Ensure form element references exist
const signupForm = document.getElementById('signupForm');

if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault(); 

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const errorDiv = document.getElementById('signup-error');

        if (password !== confirmPassword) {
            errorDiv.textContent = 'Passwords do not match!';
            errorDiv.style.color = '#ff6b6b';
            errorDiv.style.marginTop = '10px';
            return;
        }

        let users = JSON.parse(localStorage.getItem('users')) || [];

        const userExists = users.find(user => user.email === email);
        if (userExists) {
            errorDiv.textContent = 'Email is already registered. Please Log In.';
            errorDiv.style.color = '#ff6b6b';
            errorDiv.style.marginTop = '10px';
            return; 
        }

        users.push({ 
            username: username,
            email: email,
            password: password
        });
        console.log(users);
        localStorage.setItem('users', JSON.stringify(users));


        errorDiv.textContent = 'Signup successful! Redirecting to login...';
        errorDiv.style.color = '#4caf50';
        errorDiv.style.marginTop = '10px';

        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    });
}

const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const nameorEmail = document.getElementById('nameoremail').value;
        const password = document.getElementById('password').value;
        const isAdminLogin = document.getElementById('admin-login').checked;
        const errorDiv = document.getElementById('login-error');

        // Admin login with hardcoded credentials
        if (isAdminLogin) {
            if (nameorEmail === 'admin' && password === 'admin123') {
                localStorage.setItem('CurrentAdmin', JSON.stringify({
                    username: 'admin',
                    role: 'admin'
                }));
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('loggedInEmail', 'admin@underdog.com');
                errorDiv.textContent = 'Admin login successful! Redirecting to...';
                errorDiv.style.color = '#4caf50';
                errorDiv.style.marginTop = '10px';

                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                errorDiv.textContent = 'Invalid admin credentials. Try username: admin, password: admin123';
                errorDiv.style.color = '#ff6b6b';
                errorDiv.style.marginTop = '10px';
            }
            return;
        }

        // Regular user login
        const users = JSON.parse(localStorage.getItem('users')) || [];

        const user = users.find(user => 
            (user.email === nameorEmail || user.username === nameorEmail) && user.password === password
        );

        if (user) {

            localStorage.setItem('CurrentUser', JSON.stringify(user));
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('loggedInEmail', user.email);
            errorDiv.textContent = 'Login successful! Redirecting to...';
            errorDiv.style.color = '#4caf50';
            errorDiv.style.marginTop = '10px';

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            errorDiv.textContent = 'Invalid username/email or password. Please try again.';
            errorDiv.style.color = '#ff6b6b';
            errorDiv.style.marginTop = '10px';
        }   
    });

    console.table(JSON.parse(localStorage.getItem('users')));
}

function updateNavigation() {
    // Prefer the explicit isLoggedIn flag, fallback to CurrentUser existence
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const CurrentUser = localStorage.getItem('CurrentUser');

    const loginItem = document.querySelector('.login-item');
    const signupItem = document.querySelector('.signup-item');
    const logoutItem = document.querySelector('.logout-item');
    const myaccountItem = document.querySelector('.myaccount-item');
    const cartIcon = document.querySelector('.cart-icon');

    const logged = isLoggedIn || !!CurrentUser;

    if (logged) {
        if (loginItem) loginItem.style.display = 'none';
        if (signupItem) signupItem.style.display = 'none';
        if (logoutItem) logoutItem.style.display = 'block';
        if (myaccountItem) myaccountItem.style.display = 'block';
        if (cartIcon) cartIcon.style.display = 'block';
    } else {
        if (loginItem) loginItem.style.display = 'block';
        if (signupItem) signupItem.style.display = 'block';
        if (logoutItem) logoutItem.style.display = 'none';
        if (myaccountItem) myaccountItem.style.display = 'none';
        if (cartIcon) cartIcon.style.display = 'none';
    }
}

// Delete account function
function deleteAccount() {
    const confirmDelete = confirm('Are you sure you want to delete your account? This action cannot be undone.');
    
    if (!confirmDelete) {
        return;
    }

    const currentUserData = localStorage.getItem('CurrentUser');
    if (!currentUserData) {
        alert('No user logged in.');
        return;
    }

    const currentUser = JSON.parse(currentUserData);
    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Remove the user from the users array
    users = users.filter(user => user.email !== currentUser.email);

    // Update localStorage
    localStorage.setItem('users', JSON.stringify(users));

    // Clear login state
    localStorage.removeItem('CurrentUser');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loggedInEmail');

    alert('Your account has been deleted successfully.');
    window.location.href = 'index.html';
}

// Global logout function (used by multiple pages)
function logout() {
    localStorage.removeItem('CurrentUser');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loggedInEmail');
    // keep other localStorage data (like menu) intact
    window.location.href = 'index.html';
}

// Ensure navigation updates on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateNavigation);
} else {
    updateNavigation();
}