import { useSelector } from "react-redux"
import { useRef, useState ,ref} from "react"
import {getDownloadURL, getStorage, uploadBytesResumable} from 'firebase/storage'
import app from "../firebase"
import { updateUserFailure,updateUserStart,updateUserSuccess } from "../redux/user/userSlice"
import { useDispatch } from "react-redux"

function Profile() {
  const fileRef =useRef(null)
  const {currentUser,loading,error} = useSelector((state)=>state.user)
  const [file,setFile] = useState(undefined)
  const [filePerc,setFilePerc]= useState(0)
  const [fileUploadError,setFileuploadError]=useState(false);
  const [formdata,setFormData]=useState({})
  const [updateSuccess,setUpdateSucess]=useState(false)
  const dispatch = useDispatch()

  useRef(()=>{
    if(file){
      handleFileUpload(file);
    }
  },[file]);
   
  const handleFileUpload =(file) =>{
    const storage =getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef=ref(storage,fileName);
    const uploadTask= uploadBytesResumable(storageRef,file);
    
    uploadTask.on('state_changed',
      (snapshot)=> {
        const progress = (snapshot.bytesTransferred /
          snapshot.totalBytes) * 100;
          setFilePerc(Math.round(progress));
        
      },
    
    (error)=>{
     setFileuploadError(true);
    },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
      setFormData({...formdata,avatar : downloadURL}))
    }
  );
  }

   const handleChange =(e) => {
    setFormData({...formdata,[e.target.id ]: e.traget.value})
   }

   const handleSubmit = async(e) =>{
    e.preventDefault();
    try{
      dispatch(updateUserStart());
      const res = await fetch (`api/user/update/${currentUser._id}`,
        {
          method : 'POST',
          headers : {
            'content-Type' : 'application/json',

          },
          body : JSON.stringify(formdata),
        }

      );
      const data = await res.json();
      if(data.success === false){
        dispatch(updateUserFailure(data.message))
        return;
      }
      dispatch(updateUserSuccess(data))
      setUpdateSucess(true)

   }catch(error){
    dispatch(updateUserFailure(error.message));

   }
  
   
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit ={handleSubmit} className="flex flex-col">
        <input onChange={(e)=> setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept="image/.*" />
        <img onClick={()=> fileRef.current.click()} src ={formdata.avatar || currentUser.avatar} alt="profile"
        className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"/>
       
        <p className="text-sm self-center">
          {fileUploadError ? 
        (<span className="text-red-700">Error image upload</span>) :
        filePerc > 0 && filePerc <100 ? (
        <span className= 'text-slate-700'>{`uploading ${filePerc}`}</span>) :
        filePerc === 100 ? (
          <span className = 'text-green-700'>image sucessfully uploaded </span>) :( '') 
      }
      </p>
        <input type="text " placeholder="username" defaultValue={currentUser.username} id="username" className="border p-3 rounded-lg"onChange={handleCheck} />
        <input type="text " placeholder="email" defaultValue={currentUser.email} id="email" className="border p-3 rounded-lg" onChange={handleCheck}/>
        <input type="password " placeholder="password" id="password" className="border p-3 rounded-lg" onChange={handleCheck} />
        <button disabled ={loading} className="bg-slate-700 text-white rounded-lg disabled:opacity-80">{loading ? 'loading..' : 'Update'}</button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
       <p className="text-red-700">{error ? error : ''}</p>
       <p className="text-green-700 mt-5">{updateSuccess ? 'User is updated sucessfully' : ''}</p>
    </div>
  )
}
}
export default Profile