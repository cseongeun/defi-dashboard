import firebase from 'firebase/app';
import 'firebase/firestore';

// firebase 정보
const firebaseConfig = {
  apiKey: 'AIzaSyAEjfx5XxXpG4u5ISwDp8bhN9pUFo1fM2w',
  authDomain: 'deflipboard-4fbc8.firebaseapp.com',
  projectId: 'deflipboard-4fbc8',
  storageBucket: 'deflipboard-4fbc8.appspot.com',
  messagingSenderId: '657480790406',
  appId: '1:657480790406:web:322ca5d6507c01e1a47c07',
  measurementId: 'G-YHZXWYT620',
};

// firebaseConfig로 firebase 시작
firebase.initializeApp(firebaseConfig);

// firebase 인스턴스 저장
const firestore = firebase.firestore();

export { firestore };
