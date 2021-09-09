const auth = firebase.auth();
const db = firebase.firestore();
let userName = "";

// All html elements
const signedOutSection = document.getElementById("whenSignedOutSection");
const signedInSection = document.getElementById("whenSignedInSection");
const newProductSection = document.getElementById("newProductSection");
const viewProductSection = document.getElementById("viewProductSection");

const signInWithGoogleBtn = document.getElementById("signInWithGoogleBtn");
const signInBtn = document.getElementById("signInBtn");
const signOutBtn = document.getElementById("signOutBtn");
const newProductBtn = document.getElementById("newProductBtn");
const viewProductBtn = document.getElementById("viewProductBtn");
const submitNewProductBtn = document.getElementById("submitNewProductBtn");

const newProductForm = document.getElementById("newProductForm");
const productNameInput = document.getElementById("productNameTxt");
const productPriceInput = document.getElementById("productPriceTxt");

console.log("debugging!");

const authProviderGoogle = new firebase.auth.GoogleAuthProvider();

signInWithGoogleBtn.onclick = () => {
  console.log("tying to login! with google");
  auth.signInWithPopup(authProviderGoogle);
};

signInBtn.onclick = () => {
  //TODO Implement Login without google email.
};

signOutBtn.onclick = () => auth.signOut();

newProductBtn.onclick = () => {
  newProductSection.hidden = false;
  viewProductSection.hidden = true;
};

viewProductBtn.onclick = () => {
  newProductSection.hidden = true;
  viewProductSection.hidden = false;
};

auth.onAuthStateChanged((user) => {
  if (user) {
    // signed in
    console.log("user state has been changed it is true !");
    signedInSection.hidden = false;
    signedOutSection.hidden = true;
    userName = String(user.displayName);
  } else {
    // not signed in
    console.log("user state has been changed it is false !");
    userName = "";
    signedInSection.hidden = true;
    signedOutSection.hidden = false;
  }
});

let thingsRef;
let unsubscribe;

auth.onAuthStateChanged((user) => {
  if (user) {
    // Database Reference
    thingsRef = db.collection("Products");
    submitNewProductBtn.onclick = (user) => {
      console.log("new product form has been submmited!");
      if (user) {
        const { serverTimestamp } = firebase.firestore.FieldValue;

        thingsRef.add({
          userName: userName,
          name: productNameInput.value,
          price: productPriceInput.value,
          createdAt: serverTimestamp(),
        });
      }
    };

    // Query
    unsubscribe = thingsRef
      .where("userName", "==", userName)
      .orderBy("createdAt") // Requires a query
      .onSnapshot((querySnapshot) => {
        const items = querySnapshot.docs.map((doc) => {
          return `<li>${doc.data().name}</li>`;
        });

        productsList.innerHTML = items.join("");
      });
  } else {
    // Unsubscribe when the user signs out
    unsubscribe && unsubscribe();
  }
});

