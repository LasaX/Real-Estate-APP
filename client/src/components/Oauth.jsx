import {GoogleAuthProvider,getAuth,signInWithpopup, GoogleAuthProvider} from 'firebase/auth';
import {app} from '../firebase.js'
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';

export default function Oauth() {
    const dispatch = useDispatch();
     const handleGoogleClick =async ()=>{
        try{
            const Provider = new GoogleAuthProvider()
            const auth = getAuth(app)
            const result = await signInWithpopup(auth,Provider)

            const res= await fetch ('/api/auth/google',{
                method : 'POST',
                headers :{
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({
                    name: result.user.displayName,email : result.user.email,photo :result.user.photoURL
                })
            });
            const data =await res.json();
            dispatch(signInSuccess(data));

        }catch(error){
            console.log('coudnt sign with google',error);
        }
     }




  return (
    <button onClick = {handleGoogleClick} type ='button' className="bg-red-800 text-white p-3 rounded-lg uppercase hover:opacity-95">Continue with google</button>
  )
}
 