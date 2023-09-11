
const SendMsg=()=>{
 const message=document.querySelector('.msg').value;
 const obj={message};
 PostMsg(obj);
} 

function showError(e) {
  console.log(e);
  document.body.innerHTML += `<h3 style="color:red;">${e}</h3>`;
}

const creategrp=async()=>{
const grp=document.querySelector('.grpinput').value;
const obj={grp};
console.log(obj);
 const token = localStorage.getItem("token");
const res=await axios.post("http://localhost:3000/group/creategroup",obj,{headers:{Authorization:token}});
// console.log("res.data.group",res.data.group.id);
console.log("res.data.group",res.data.group.groupname);
const groupid=res.data.group.id;
const groupname=res.data.group.groupname;
console.log("res.data.user",res.data);

  showGetcreatedgroup(groupname);

document.querySelector('.div3h2-users').innerHTML="Users Available";
res.data.user.forEach(e=>{
  console.log(e,"eeee");
  grpscreen(e,groupid);
})

}

function grpscreen(e,groupid){
let ulgrp=document.querySelector('.ulgrp');
const li=document.createElement('li');
li.className="grpscreenli";
  const button = document.createElement('button');
  button.textContent = "Add";
  button.className='add';
  button.addEventListener('click',function(){
    button.innerHTML = "Added";
    Addgroup(e,groupid);
  })
    li.innerHTML=e.name;
    li.appendChild(button);
    ulgrp.appendChild(li);
}

//postUsergroup
const Addgroup=async(id,groupid)=>{
  try{
 const token = localStorage.getItem("token");
 const group={
  groupid,
  id
};
const res=await axios.post("http://localhost:3000/group/addusergroup",group,{headers:{Authorization:token}});
console.log(res.data.group);
  }
catch(e){
  console.log(e);
}

}

const GetAllgroup=async()=>{
  try{
 const token = localStorage.getItem("token");
const res=await axios.get("http://localhost:3000/group/getallgroup",{headers:{Authorization:token}});
console.log("231211",res);
res.data.groupname.forEach(groups=>{
  showGetAllgroup(groups.groupname,groups.id);
})

res.data.groupadmin.forEach(groupadmingrp=>{
   showGetAlladmingroup(groupadmingrp.groupname,groupadmingrp.id); 
})

res.data.restgroupname.forEach(e=>{
  console.log(e,"11111");
   showrestgroupname(e.groupname,e.id,e.adminid); 
})


  }
catch(e){
  console.log(e);
}
}
function showGetcreatedgroup(groupname){
 const div1=document.querySelector('.div1');
const button=document.createElement('button');
button.className="div3btn";
button.innerHTML+=groupname;
div1.appendChild(button); 
}

function showGetAllgroup(groupname,gid){
const div1=document.querySelector('.div3');
const li=document.createElement('div');
li.className="div1li";
li.innerHTML=` <h2 class="div1h2">${groupname}</h2> 
 <button  onclick="AdminClick('${groupname}','${gid}')"  
  style="color:green" class="admin">Click </button> `;
div1.appendChild(li);

// const button=document.createElement('button');
// button.className="div3btn";
// button.innerHTML+=groupname;
// div1.appendChild(button);
}

 const showrestgroupname= (groupname,id,adminid)=>{
const div4=document.querySelector('.div4');

const button=document.createElement('button');
const btn=document.createElement('button');
btn.innerHTML+="Join";
btn.onclick= async function(){
  btn.innerHTML="Joined";
  btn.color="blue";
 const token = localStorage.getItem("token");
console.log(groupname,id,adminid,"#@42242343");
try{
 const res=await axios.get(`http://localhost:3000/group/addrestgroupname/${id}`,{headers:{Authorization:token}}); 
//  console.log(res.data.groupname,'AAAAA');

 showGetAllgroup(res.data.groupname.groupname);
}
catch(e){
  console.log(e);
}
}
button.className="div3btn";
button.innerHTML+=groupname;
div4.appendChild(button);
div4.appendChild(btn);

// div4.appendChild(btn);
}
// restgroupname
async function AdminClick(gname,gid){
        const token = localStorage.getItem("token");
       document.querySelector('.ul').innerHTML=" ";
const response=await axios.get(`http://localhost:3000/message/getadminmsg/${gid}`,{headers:{Authorization:token}});
    console.log("response.data.message",response.data.message);
response.data.message.forEach(m=>{
  screen(m.message);
})
  console.log("g",gname,gid);
const button = document.querySelector('.send-btn');
button.onclick=function(){  //send msg button
const message=document.querySelector('.msg').value;
 const obj={message,gid};
  PostMsg(obj);
  
}
}


//   ///////////////////////////////////
function showGetAlladmingroup(groupname,gid){
const ul=document.querySelector('.div1');
const li=document.createElement('div');
li.className="div1li";
li.innerHTML=` <h2 class="div1h2">${groupname}</h2> 
 <button style="color:red" class="admin">admin</button>
   <button  onclick="AdminClick('${groupname}','${gid}')"  
  style="color:blue" class="admin ">Click
  </button>
  `;
ul.appendChild(li);
}



window.addEventListener('DOMContentLoaded',async()=>{
     GetAllgroup();
       const token = localStorage.getItem("token");
  try{
    const res=await axios.get("http://localhost:3000/message/getmsg",{headers:{Authorization:token}});
let arr=[];

    res.data.message.forEach(e=>{
      arr.push({id:e.id,message:e.message}); 
    })
    // console.log(arr,"arrrrr");
   localStorage.setItem('messagearr',JSON.stringify(arr));//obj to json string
const temparr=JSON.parse(localStorage.getItem('messagearr')); //jsonstring to object
// console.log(temparr,"temp");
temparr.forEach(e=>{
  console.log(e.message,e.id);
screen(e.message);
})
//  let last=temparr[temparr.length-1];
//  let lastid=last.id;
  // console.log(lastid)
// const resp=await axios.get(`http://localhost:3000/message/newmessage?lastpage=${lastid}`,{headers:{Authorization:token}});
  
}
  catch(e){
  showError(e);
  }


})
//   const getLoaded=async()=>{
//     document.querySelector('.ul').innerHTML='';
   
//       const token = localStorage.getItem("token");
//   try{
//     const res=await axios.get("http://localhost:3000/message/getmsg",{headers:{Authorization:token}});
// let arr=[];
//     res.data.message.forEach(e=>{
//       arr.push(e.message);
//       // screen(e.message);  
//     })
//    localStorage.setItem('message',arr);
// const temp=localStorage.getItem('message');
// // console.log(typeof(temp));//string
// const a=temp.split(",");
// a.forEach(e=>{
// screen(e);
// })

//   }
//   catch(e){
//   showError(e);
//   }
// }
// getLoaded();
// const a=setInterval(getLoaded,10000);
// clearInterval(a);

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