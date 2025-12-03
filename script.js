if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault(); 


        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('signup-error');

        let users = JSON.parse(localStorage.getItem('users')) || [];

        const userExists = users.find(user => user.email === email);
        if (userExists) {
            errorDiv.textContent = 'Email is already registered. PLease Log In.';
            errorDiv.style.color = 'red';
            errorDiv.style.marginTop = '10px';
            return; 
        }
        users.push({ username, email, password });
        localStorage.setItem('users', JSON.stringify(users));
        window.location.href = 'login.html';
    });
}
