const functions = require("firebase-functions");
const admin = require('firebase-admin');

admin.initializeApp();

exports.sendNotifications = functions.firestore.document('/messages/{documentId}')
    .onCreate((snap, context) => {
        
        functions.logger.info(context)

        const payload = {
            notification:{
                title:"Tienes mensajes nuevos",
                body:"Abre la aplicación para leer los mensajes."
            }
        }
        
        return admin.messaging().sendToTopic("chat", payload)
            .then(() => {
                const message = snap.data();
                message.notificated = true;
                return snap.ref.set(message, {merge: true});
            })
            .catch((error) => {
                functions.logger.error("Error send notification on create message: ", error)
            })

    });
