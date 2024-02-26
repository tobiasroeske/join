// Initialisierungsfunktion, die beim Laden der Seite aufgerufen wird
async function init() {
    try {
        // Laden der Benutzerdaten aus dem Speicher
        await loadUsers();
    } catch (error) {
        console.error('Error initializing:', error);
        // Fehlerbehandlung, falls das Laden fehlschlägt
    }
}

async function login() {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    // Überprüfen, ob das E-Mail- und Passwortfeld nicht leer sind
    if (email.trim() === '' || password.trim() === '') {
        alert('Please enter email and password');
        return;
    }

    try {
        // Laden der Benutzerdaten aus dem lokalen Speicher
        let users = JSON.parse(await getItem('users'));

        // Suchen nach einem Benutzer mit der angegebenen E-Mail-Adresse
        let user = users.find(u => u.email === email);

        // Überprüfen, ob der Benutzer gefunden wurde und das Passwort übereinstimmt
        if (user && user.password === password) {
            // Erfolgreiche Anmeldung
            alert('Login successful');
            // Weiterleitung zur Startseite oder einer anderen gewünschten Seite
            window.location.href = 'summary.html';
        } else {
            // Fehlermeldung bei falscher E-Mail-Adresse oder Passwort
            alert('Incorrect email or password');
        }
    } catch (error) {
        console.error('Error:', error);
        // Fehlermeldung bei einem Fehler beim Laden der Benutzerdaten
        alert('An error occurred. Please try again later.');
    }
}


