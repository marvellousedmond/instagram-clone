import { createContext, useContext, useEffect, useState } from "react";
import { sendPasswordResetEmail, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth, db } from "../Firebase/firebase"
import { addDoc, collection } from "firebase/firestore";

const UserContext = createContext({});

export const useUserContext = () => useContext(UserContext)

export const UserContextProvider = ({ children }) => {

  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState()
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        user ? setCurrentUser(user) : setCurrentUser(null)
        setError("")
        setLoading(false)
    })
    return unsubscribe
  }, [])

  async function registerUser(email, name, password){
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: "https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"
      })
      return await addDoc(collection(db, "profile"), {
        username: name,
        email: email,
        imgUrl: "https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"
      });

    } catch (error) {
      setError(error.message)    
    }
    setLoading(false);
  }

  async function signInUser(email, password){
    setLoading(true)
    try{
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      setError(error.message)    
    }
    setLoading(false);
    
  }

  async function signInWithGoogle(email, password){
    setLoading(true)
    const provider = new GoogleAuthProvider() 
    try{
      await signInWithPopup(auth, provider)
    } catch (error) {
      setError(error.message)    
    }
    setLoading(false);
    
  }

  async function logoutUser() {
    await signOut(auth)
  }

  async function forgetPassword(email) {
    const resetPassword = await sendPasswordResetEmail(auth, email)
  }

  const contextValue = {
    currentUser,
    loading,
    error,
    setLoading,
    registerUser,
    signInWithGoogle,
    signInUser,
    logoutUser,
    forgetPassword,
  };
  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
