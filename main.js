/***********************************************************************/
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

            //console.log('login ok');
        });
});

// Google Login
const googleBtn = document.querySelector('#googleLogin');
googleBtn.addEventListener('click', () => {
    console.log('google click');
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then(result => {
            //console.log(result);

            // Limpia el formulario
            loginForm.reset();

            // Cerrar (ocultar) el modal
            $('#loginModal').modal('hide');
        })
        .catch(err => {
            console.log(err);
        })
});

// Facebook Login
const facebookBtn = document.querySelector('#facebookLogin');
facebookBtn.addEventListener('click', () => {
    console.log('facebook click');
    const provider = new firebase.auth.FacebookAuthProvider();
    auth.signInWithPopup(provider)
        .then(result => {
            //console.log(result);

            // Limpia el formulario
            loginForm.reset();

            // Cerrar (ocultar) el modal
            $('#loginModal').modal('hide');
        })
        .catch(err => {
            console.log(err);
        })
});

/***********************************************************************/
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

            //console.log('signup ok');
        });
});

/***********************************************************************/
// LOGOUT
const logout = document.querySelector('#logout');

logout.addEventListener('click', e => {
    e.preventDefault();

    auth.signOut().then(() => {
        console.log('logout ok');
    });
});

/***********************************************************************/
// NOTES
const notesList = document.querySelector('.notes');

const showNotes = data => {
    let html = '';
    html += `
            <button type="button" class="btn btn-info" data-toggle="modal" data-target="#newNoteModal">
                Nueva Nota
            </button>
            <br/>
        `
    if (data.length) {
        data.forEach(doc => {
            const noteId = doc.id;
            const note = doc.data();
            const li = `
                <li class="list-group-item mt-2 border border-secondary rounded">
                    <h5>${note.title}</h5>
                    <p>${note.text}</p>
                    <button type="button" class="btn btn-danger" onclick="handleDelete('${noteId}')">
                        Borrar
                    </button>
                </li>
            `;
            html += li;
        });
        notesList.innerHTML = html;
    } else {
        html += '<p>No hay notas para mostrar.</p>';
        notesList.innerHTML = html;
    }
}

/***********************************************************************/
// AUTH EVENTS
let currentUser;
const login = document.querySelector('#login');
const signup = document.querySelector('#signup');

auth.onAuthStateChanged(user => {
    if (user) {
        currentUser = user;

        //console.log('auth: signin');
        //console.log(user.uid);

        fs.collection('users/' + user.uid + '/notes')
            .get()
            .then((snapshot) => {
                //console.log(snapshot.docs);
                showNotes(snapshot.docs);
            });

        // Actualiza estilo display de enlaces navbar
        login.style.display = "none";
        signup.style.display = "none";
        logout.style.display = "block";
    } else {
        //console.log('auth: signout');

        // Actualiza estilo display de enlaces navbar
        login.style.display = "block";
        signup.style.display = "block";
        logout.style.display = "none";

        // Borra notas y muestra msj
        notesList.innerHTML = '<p>No estás logueado. Inicia sesión para ver tus notas.</p>';
    }
});

/***********************************************************************/
// NEW NOTE FORM
const newNoteForm = document.querySelector('#newNote-form');

newNoteForm.addEventListener('submit', async e => {
    e.preventDefault();

    const newNoteTitle = document.querySelector('#newNote-title').value;
    const newNoteText = document.querySelector('#newNote-text').value;

    //console.log(newNoteTitle, newNoteText);

    try {
        // Agregar nota a BD
        await fs.collection('users/' + currentUser.uid + '/notes').add({
            title: newNoteTitle,
            text: newNoteText
        });
        //console.log("new note added");

        // Limpia el formulario
        newNoteForm.reset();

        // Cerrar (ocultar) el modal
        $('#newNoteModal').modal('hide');

        // Actualizar lista de notas desde BD
        const notesRef = await fs.collection('users/' + currentUser.uid + '/notes');
        notesRef.get()
            .then((snapshot) => {
                //console.log(snapshot.docs);
                showNotes(snapshot.docs);
            });
    } catch (error) {
        console.error(error);
    }
});

// Eliminar nota
const handleDelete = async (noteId) => {
    try {
        // Borrar nota de BD
        await fs.collection('users/' + currentUser.uid + '/notes').doc(noteId).delete();

        //console.log("note deleted");

        // Actualizar lista de notas desde BD
        const notesRef = await fs.collection('users/' + currentUser.uid + '/notes');
        notesRef.get()
            .then((snapshot) => {
                //console.log(snapshot.docs);
                showNotes(snapshot.docs);
            });
    } catch (error) {
        console.error(error);
    }

}
