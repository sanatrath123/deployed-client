import { useEffect, useState } from 'react'
import './App.css'

interface UserType {
_id:string
name:string
email:string
password:string
rootDirID:string
}

interface newUserType {
  name:string | "" , email:string | ""
}

function App() {
const [users , setUsers] = useState<[UserType] | null>(null)
const [showUser , setShowUser] = useState<boolean>(false)
const [newUserPopUp , setPopup] = useState<boolean>(false)
const [newUserData , setNewData] = useState<newUserType>({name:"Sanat", email:"BOSS"})
const [isAuth, setIsAuth]= useState<boolean>(false)
const url = String(import.meta.env.VITE_Server_URL)
const GetUsers = async ()=>{
  try {
    const allUsers = await fetch(`${url}/user`,{
      credentials:'include'
    })
    const json = await allUsers.json()
    setUsers(json)
  } catch (error) {
    console.log("error while fetching the user", error)
  }
}

useEffect(()=>{
  if(showUser) GetUsers()
},[showUser])



const handelInputChange = (e:React.ChangeEvent<HTMLInputElement>,field:"name" | "email")=>{
 setNewData((prev)=>{
  return {...prev , [field]:e.target.value}
 })
}

const AddNewUser = async()=>{
try {
  const res = await fetch(`${url}/user`,{
    method:"POST", credentials:'include' ,headers:{
      "content-type" :"application/json"
    },body:JSON.stringify(newUserData)
   })
  
  if(res.status==201){
    setPopup(false)
  GetUsers()
  }
} catch (error) {
  console.log("erroe while post a new user", error)
}
}


const MakeAuth = async ()=>{
 try {
  const res = await fetch(`${url}/setCookies`, {
    credentials:'include'
  })
  if(res.status==200)cheeckAuth()
 } catch (error) {
  console.log("error setcookies", error)
 }
}

const cheeckAuth = async ()=>{
  const res =await fetch(`${url}/isAuth`, {
    credentials:'include'
  })
if(res.status==200)return setIsAuth(true)
  setIsAuth(false)
}

useEffect(()=>{
cheeckAuth()
},[])

  return (
   <div className='bg-black w-full min-h-screen flex flex-col  items-center gap-3 text-lg'>
<div className='flex gap-4'>
<button className={`w-40 h-20 rounded-xl ${isAuth ? " bg-green-400" : " bg-red-400"}  mt-10 cursor-pointer`} onClick={MakeAuth}
>MAKE AUTH</button>

<button className='w-40 h-20 rounded-xl bg-blue-400 mt-10 cursor-pointer' onClick={()=>setShowUser(!showUser)}
>SHOW ALL USERS</button>
<button className='w-40 h-20 rounded-xl bg-orange-400 mt-10 cursor-pointer' onClick={()=>setPopup(!newUserPopUp)}
>ADD NEW USER</button>

</div>
{
  newUserPopUp && <div className='w-80 py-2 gap-2 bg-white absolute top-1/4 flex flex-wrap justify-center items-center'>
  <button className='bg-gray-400 p-2 rounded-xl cursor-pointer ' onClick={()=>setPopup(false)}>close</button>

<input type="text" placeholder='Type Name' value={newUserData?.name} className='w-9/10 rounded-xl px-2 h-10 bg-pink-200' onChange={(e)=>handelInputChange(e ,'name')} />
<input type="text" placeholder='Type Email' value={newUserData?.email} className='w-9/10 rounded-xl px-2 h-10 bg-pink-200' onChange={(e)=>handelInputChange(e ,'email')} />
<button className='bg-yellow-400 p-2 rounded-xl cursor-pointer ' onClick={AddNewUser}>Create</button>
  </div>
}
    <ul className=' w-4/6 min-h-60 bg-gray-500 flex flex-wrap justify-center py-3'>

{ users?.length ?
  users?.map((user)=>(
    <li key={user._id} className='w-[90%] bg-white h-12 rounded-3xl flex justify-between items-center px-3 text-xl'>
  <span >{user.name}</span>
  <span >{user.email}</span>
  <span >{user._id}</span>
</li>  
  )) : <h2>NO USER EXIST</h2>
}
    </ul>

   </div>
  )
}

export default App
