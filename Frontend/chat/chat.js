
const SendMsg=()=>{
 const message=document.querySelector('.msg').value;
 const obj={message};
 PostMsg(obj);
} 

function showError(e) {
  console.log(e);
  document.body.innerHTML += `<h3 style="color:red;">${e}</h3>`;
}
window.addEventListener('DOMContentLoaded',async()=>{
      const token = localStorage.getItem("token");
  try{
    const res=await axios.get("http://localhost:3000/message/getmsg",{headers:{Authorization:token}});
    res.data.message.forEach(e=>{
      screen(e.message);
    })
  }
  catch(e){
  showError(e);
  }
})

const PostMsg=async(obj)=>{
  document.querySelector('.msg').value='';
  const token=localStorage.getItem("token");
 try{
const res=await axios.post("http://localhost:3000/message/postmsg",
  obj, { headers: { Authorization: token }},
  );
 screen(res.data.msg.message);
 }   
catch(e){
    console.log(e);
}
}


function screen(data){
  const ul=document.querySelector('.ul');
  const li=document.createElement('li');
  li.innerHTML+=`${data}`;
  ul.appendChild(li);

}