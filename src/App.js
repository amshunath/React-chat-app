import logo from './logo.svg';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth'
import {useCollectionData} from 'react-firebase-hooks/firestore'

firebase.initializeApp({
  apiKey: "AIzaSyBiFW7GvlNvJayGLT4WGkPntEPz8Njyz7Q",
  authDomain: "chat-a-2df67.firebaseapp.com",
  projectId: "chat-a-2df67",
  storageBucket: "chat-a-2df67.appspot.com",
  messagingSenderId: "888266027396",
  appId: "1:888266027396:web:50f2b36e02c2c57036edd1",
  measurementId: "G-Z4B5Y3W13D"
})

const auth=firebase.auth();
const firestore=firebase.firestone();

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header>
        <h1>Chat Portal</h1>
        {(auth.currentUser) ? <p>{auth.currentUser.displayName}</p> : <></>}
        <SignOut /> 
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
    </>
  );

}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  );
}

function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt', 'asc');

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL} = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: "smooth" });
  }

  return (
  <>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <div ref={dummy}></div>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Enter your message here!" />

      <button type="submit" disabled={!formValue}><img src = "sendImage.png" alt = "Ent"/></button>

    </form>
  </>);
}

function ChatMessage(props) {
  const { text, uid, photoURL} = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
  <>
    <div className={`message ${messageClass}`}>
      {/* <img src={photoURL || "noProfile.jpg"} alt = "NO_IMG"/> */}
      <img src={photoURL} referrerPolicy="no-referrer" alt = "NO_IMG"/>
      {/* <p>{displayName || "UserName not avail"}</p> */}
      <p>{text}</p>
    </div>
  </>);
}

export default App;
