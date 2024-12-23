import { useSelector } from "react-redux"
import { useRef, useState ,ref} from "react"
import {getDownloadURL, getStorage, uploadBytesResumable} from 'firebase/storage'
import app from "../firebase"
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, updateUserFailure,updateUserStart,updateUserSuccess } from "../redux/user/userSlice"
import { useDispatch } from "react-redux"
import {Link} from 'react-router-dom'

function Profile() {
  const fileRef =useRef(null)
  const {currentUser,loading,error} = useSelector((state)=>state.user)
  const [file,setFile] = useState(undefined)
  const [filePerc,setFilePerc]= useState(0)
  const [fileUploadError,setFileuploadError]=useState(false);
  const [formdata,setFormData]=useState({})
  const [updateSuccess,setUpdateSucess]=useState(false)
  const [showListingsError,setShowListingError] = useState(false);
  const [userListings,setUserListings]=useState([])
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

   const handleCheck =(e) => {
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
  }
   const handleDeleteUser = async ()=>{
     try{
      dispatch(deleteUserStart());
      const res = await fetch (`api/user/delete/${currentUser._id}`,{
        method : 'DELETE'
      })
      const data =  await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
     }catch{
       dispatch(deleteUserFailure(error.message))
     }
   }

   const handleSignOut =async ()=>{
      try{
        const res = await fetch ('/api/user/signout');
        const data = await res.json();
        if (data.success === false){
          dispatch(deleteUserFailure(data.message))
          return
        }
        dispatch(deleteUserSuccess(data));
      }catch(error){
        dispatch(deleteUserFailure(data.message));
      }
   }
   const handleshowListings = async ()=>{
    try{
      const res = await fetch (`/api/user/listing/${currentUser._id}`);
      const data = await res.json();
      if(data.success === false){
        setShowListingError(true)
        return
      }
      setUserListings(data);
    }catch (error){
      setShowListingError(true)
    }
   }
   
   const handleListingDelete = async (listingId) => {
    try{
      const res = await fetch(`/api/listing/delete/${listingId}`,{
        method : 'DELETE',
          });
        const data = await res.json()
        if(data.success === false){
          console.log(data.message);
          return;
        }
        setUserListings((prev) =>
        prev.filter ((listing)=> listing._id !== listingId)
        )

    }catch(error){
       console.log(error.message)
    }
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
        <Link className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95" to = {"/create-listing"}>Create Listing</Link>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">Delete account</span>
        <span onClick= {handleSignOut} className="text-red-700 cursor-pointer">Sign out</span>
      </div>
      
       <p className="text-green-700 mt-5">{updateSuccess ? 'User is updated sucessfully' : ''}</p>
       <button onClick={handleshowListings} className="text-green-700 w-full">Show listings</button>
       <p className="text-red-700 mt-5">{showListingsError ? 'Error showing listings' : ''}</p>

       {userListings && userListings.length > 0 && 
       <div className="flex flex-col gap-4">
        <h1 className="text-center mt-7 text-2xl font-semibold"> Your Listing </h1>
       {userListings.map((listing)=>{
        <div key ={listing._id} className=" border rounded-lg p-3 flex justify-between items-center gap-4">
          <Link to ={`/listing/${listing._id}`}>
          <img src={listing.imageURLs [0]} alt="listing cover" className="h-16 w-16 object-contain" /> 
          </Link>

          <Link className="text-slate-700 font-semibold  hover:underline truncate flex-1" to = {`/listing/${listing._id}`}>
          <p >{listing.name}</p>
          </Link>
          <div className="flex flex-col items-center">
            <button onClick={()=> handleListingDelete (_id)} className="text-red-700 uppercase">Delete</button>
            <Link to ={`/ipdate-listing/${listing._id}`}>
            <button className="text-green-700 uppercase">Edit</button>
            </Link>
          </div>
          </div>
        }) }
       </div>
      }
      </div>
  )
}
   
  
   


export default Profile