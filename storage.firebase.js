/*
 * storage.firebase.js — VALGFRI oppgradering for ekte deling mellom kolleger.
 *
 * storage.local.js (standard) lagrer alt kun på den enkelte enhet. Denne filen
 * gir samme window.storage-grensesnitt (get/set/delete/list), men lagrer
 * "delte" nøkler (shared=true) i Firebase Firestore i stedet for localStorage,
 * slik at alle ansatte som åpner appen ser samme bildata — akkurat som i
 * Claude.ai-versjonen. Personlige data ("Ditt navn", shared=false) lagres
 * fortsatt lokalt per enhet, siden appen ikke har innlogging.
 *
 * Denne filen er IKKE testet i produksjon herfra (krever et ekte Firebase-
 * prosjekt), men følger Firebase sitt offisielle, stabile "compat"-API slik
 * det er dokumentert av Firebase. Test grundig etter oppsett — se README.md
 * for fremgangsmåte steg for steg.
 *
 * SLIK TAS DEN I BRUK:
 * 1. Opprett et gratis Firebase-prosjekt (console.firebase.google.com) og
 *    slå på Firestore Database.
 * 2. Fyll inn firebaseConfig under med verdiene fra ditt prosjekt.
 * 3. I index.html: legg til Firebase SDK-scriptene (se kommentar nederst i
 *    denne filen) og bytt <script src="storage.local.js"> til
 *    <script src="storage.firebase.js">.
 * 4. Sett Firestore security rules slik at kun dere (f.eks. via et delt
 *    passord/App Check, eller Firebase Auth) kan lese/skrive — IKKE la
 *    databasen stå åpen for hele internett i produksjon.
 */
(function () {
  const firebaseConfig = {
    apiKey: "DIN_API_KEY",
    authDomain: "DITT-PROSJEKT.firebaseapp.com",
    projectId: "DITT-PROSJEKT",
    storageBucket: "DITT-PROSJEKT.appspot.com",
    messagingSenderId: "DITT_SENDER_ID",
    appId: "DIN_APP_ID"
  };

  if (typeof firebase === 'undefined') {
    console.error('Firebase SDK er ikke lastet inn. Se kommentar i storage.firebase.js.');
    return;
  }

  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  const COLLECTION = 'kjoretoy_shared';
  const NS = 'kjoretoy:';

  function localKey(key) { return NS + 'me:' + key; }

  async function get(key, shared) {
    if (!shared) {
      const raw = window.localStorage.getItem(localKey(key));
      return raw === null ? null : { key, value: raw, shared: false };
    }
    const doc = await db.collection(COLLECTION).doc(key).get();
    if (!doc.exists) return null;
    return { key, value: doc.data().value, shared: true };
  }

  async function set(key, value, shared) {
    if (!shared) {
      window.localStorage.setItem(localKey(key), value);
      return { key, value, shared: false };
    }
    await db.collection(COLLECTION).doc(key).set({ value, updatedAt: Date.now() });
    return { key, value, shared: true };
  }

  async function del(key, shared) {
    if (!shared) {
      const existed = window.localStorage.getItem(localKey(key)) !== null;
      window.localStorage.removeItem(localKey(key));
      return { key, deleted: existed, shared: false };
    }
    const ref = db.collection(COLLECTION).doc(key);
    const doc = await ref.get();
    const existed = doc.exists;
    await ref.delete();
    return { key, deleted: existed, shared: true };
  }

  async function list(prefix, shared) {
    // Brukes ikke av appen i dag (ingen kall til window.storage.list), men
    // implementert her for fullstendighet. Firestore støtter ikke "starts
    // with" direkte, så dette gjør et rekkevidde-søk på dokument-ID-en.
    if (!shared) {
      const p = localKey(prefix || '');
      const keys = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const lk = window.localStorage.key(i);
        if (lk && lk.startsWith(p)) keys.push(lk.slice(localKey('').length));
      }
      return { keys, prefix, shared: false };
    }
    const p = prefix || '';
    const end = p + '\uf8ff';
    const snap = await db.collection(COLLECTION)
      .orderBy(firebase.firestore.FieldPath.documentId())
      .startAt(p).endAt(end).get();
    return { keys: snap.docs.map((d) => d.id), prefix, shared: true };
  }

  window.storage = { get, set, delete: del, list };
})();

/*
 * SDK-scriptene som må legges til i <head> i index.html FØR denne filen,
 * dersom dere velger Firebase-oppgraderingen (compat-versjonen, ingen
 * bundler/npm nødvendig):
 *
 * <script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js"></script>
 * <script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore-compat.js"></script>
 * <script src="storage.firebase.js"></script>
 */
