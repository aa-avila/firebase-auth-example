# firebase-auth-example
### Ejemplo de autenticación mediante el servicio de Firebase Authentication

- Permite crear cuentas e ingresar mediante correo y contraseña, y también mediante Google y Facebook.

- Además, se implementó una sencilla app de "Notas" a modo de demostración, utilizando Firestore como base de datos y backend.

- Gracias a Auth y al uso de las reglas de Firestore, los datos están protegidos, de modo tal que cada usuario puede leer y escribir únicamente sus propios datos.

**Reglas utilizadas:**
```
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    match /users/{userId} {
    	allow read, write: if request.auth.uid == userId;
    	}
    }
  }
```

- Por útlimo, se utilizó Javascript junto con Bootstrap 4 para crear la interfaz de usuario.

**Link a la app:**
https://aa-avila.github.io/firebase-auth-example/


