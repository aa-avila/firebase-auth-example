// LOGIN
const loginForm = document.querySelector('#login-form');

loginForm.addEventListener('submit', e => {
    e.preventDefault();

    const email = document.querySelector('#login-email').value;
    const password = document.querySelector('#login-password').value;

    auth
        .signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            // Limpia el formulario
            loginForm.reset();
            // Cerrar (ocultar) el modal
            $('#loginModal').modal('hide');

            console.log('login ok');
        });
});

// Google Login
const googleBtn = document.querySelector('#googleLogin');
googleBtn.addEventListener('click', () => {
    console.log('google click');
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then(result => {
            console.log(result);
            // Limpia el formulario
            loginForm.reset();
            // Cerrar (ocultar) el modal
            $('#loginModal').modal('hide');
        })
        .catch(err => {
            console.log(err);
        })
});

// SIGNUP
const signupForm = document.querySelector('#signup-form');

signupForm.addEventListener('submit', e => {
    e.preventDefault();

    const email = document.querySelector('#signup-email').value;
    const password = document.querySelector('#signup-password').value;

    auth
        .createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            // Limpia el formulario
            signupForm.reset();

            // Cerrar (ocultar) el modal
            $('#signupModal').modal('hide');

            console.log('signup ok');
        });
});

// LOGOUT
const logout = document.querySelector('#logout');

logout.addEventListener('click', e => {
    e.preventDefault();

    auth.signOut().then(() => {
        console.log('logout ok');
    });
});


// NOTES
const notesList = document.querySelector('.notes');

const showNotes = data => {
    if (data.length) {
        let html = '';
        data.forEach(doc => {
            const note = doc.data();
            const li = `
                <li class="list-group-item">
                    <h5>${note.title}</h5>
                    <p>${note.text}</p>
                </li>
            `;
            html += li;
        });
        notesList.innerHTML = html;
    } else {
        notesList.innerHTML = '<p>No hay notas para mostrar.</p>';
    }
}

// AUTH EVENTS
const login = document.querySelector('#login');
const signup = document.querySelector('#signup');


auth.onAuthStateChanged(user => {
    if (user) {
        console.log('auth: signin');
        fs.collection('notes')
            .get()
            .then((snapshot) => {
                console.log(snapshot.docs);
                showNotes(snapshot.docs);
            });

        // Actualiza estilo display de enlaces navbar
        login.style.display = "none";
        signup.style.display = "none";
        logout.style.display = "block";
    } else {
        console.log('auth: signout');
        // Actualiza estilo display de enlaces navbar
        login.style.display = "block";
        signup.style.display = "block";
        logout.style.display = "none";

        // Borra notas y muestra msj
        notesList.innerHTML = '<p>No estás logueado. Inicia sesión para ver tus notas.</p>';
    }
});
