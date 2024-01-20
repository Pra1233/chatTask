const socket = io("http://localhost:3000");
socket.on("data", (data) => {
  // console.log(data);
});

// GET MESSAGE
window.addEventListener("DOMContentLoaded", async () => {
  GetAllgroup(); //getallgroupfunction

  const token = localStorage.getItem("token");
  try {
    const res = await axios.get("http://localhost:3000/message/getmsg", {
      headers: { Authorization: token },
    });
    let arr = [];
    const userid = res.data.userid;

    res.data.message.forEach((e) => {
      arr.push({ id: e.UserId, message: e.message, name: e.name });
    });
    // console.log(arr,"arr");
    localStorage.setItem("messagearr", JSON.stringify(arr)); //obj to json string
    const temparr = JSON.parse(localStorage.getItem("messagearr")); //jsonstring to object

    temparr.forEach((e) => {
      console.log(e.message, e.id, e.name, "e.message,e.id,e.name");
      screenmsg(e.id, e.message, e.name, userid);
    });
  } catch (e) {
    showError(e);
  }
});

function scrollscreen() {
  const ulfirst = document.querySelector(".ul-first");
  ulfirst.scrollTop = ulfirst.scrollHeight;
}
function screenmsg(id, msg, name, userid) {
  // console.log("first33333333",id,msg,name,userid);
  const ul = document.querySelector(".ul");
  const p = document.createElement("p");
  if (id !== userid) {
    p.style.marginLeft = "30vw";
  } else {
    p.style.marginLeft = "0%";
  }
  p.innerHTML += ` <span class="msg-span">${msg}</span> <span class="span">${name}</span>`;
  ul.appendChild(p);
  scrollscreen();
}

//POST  //1
const PostMsg = async (obj) => {
  document.querySelector(".msg").value = "";
  const token = localStorage.getItem("token");
  try {
    const res = await axios.post("http://localhost:3000/message/postmsg", obj, {
      headers: { Authorization: token },
    });
    const name = res.data.msg.name;
    const message = res.data.msg.message;
    const id = res.data.msg.UserId;
    const userid = res.data.userid;
    console.log(res.data, "post-msg");
    screenmsg(id, message, name, userid);
  } catch (e) {
    console.log(e);
  }
};

const SendMsg = () => {
  const message = document.querySelector(".msg").value;
  const obj = { message };
  PostMsg(obj);
};

function showError(e) {
  console.log(e);
  document.body.innerHTML += `<h3 style="color:red;">${e}</h3>`;
}

function showGetcreatedgroup(groupname) {
  //showing created first group on screen
  const div1 = document.querySelector(".div1");
  const button = document.createElement("button");
  button.className = "div3btn";
  button.innerHTML += groupname + "-admin";
  div1.appendChild(button);
}

const AddUserInGroup = async (id, groupid) => {
  try {
    const token = localStorage.getItem("token");
    console.log(id, groupid);
    const group = {
      groupid,
      id,
    };
    console.log(id, groupid, group, "idgroup");
    const res = await axios.post(
      "http://localhost:3000/group/addusergroup",
      group,
      { headers: { Authorization: token } }
    );
    console.log(res.data.group);
  } catch (e) {
    console.log(e.message);
  }
};

function grpscreen(e, groupid) {
  //user
  let ulgrp = document.querySelector(".ulgrp");
  const li = document.createElement("li");
  li.className = "grpscreenli";
  const button = document.createElement("button");
  button.textContent = "Add";
  button.className = "add";
  button.addEventListener("click", function () {
    button.innerHTML = "Added";
    AddUserInGroup(e.id, groupid);
  });
  li.innerHTML = e.name;
  li.appendChild(button);
  ulgrp.appendChild(li);
}

//Group creation  //2
const creategrp = async () => {
  const grp = document.querySelector(".grpinput").value; //groupname input
  const obj = { grp };
  // console.log(obj);
  const token = localStorage.getItem("token");
  const res = await axios.post("http://localhost:3000/group/creategroup", obj, {
    headers: { Authorization: token },
  });

  const groupid = res.data.group.id;
  const groupname = res.data.group.groupname;

  showGetcreatedgroup(groupname);

  document.querySelector(".div3h2-users").innerHTML = "Users Available";
  res.data.user.forEach((e) => {
    console.log(e, "e");
    grpscreen(e, groupid);
  });
};

// When we click on chat on User Admin group
const AdminClick = async (gname, gid) => {
  const token = localStorage.getItem("token");
  const h3 = document.querySelector(".h3");
  h3.innerHTML = "Groupname - " + gname;
  h3.style.textAlign = "center";
  h3.style.color = "blue";
  document.querySelector(".ul").innerHTML = "";
  try {
    const response = await axios.get(
      `http://localhost:3000/message/getadminmsg/${gid}`,
      { headers: { Authorization: token } }
    );
    console.log("response.data.message", response.data);
    const userid = response.data.userid;
    const username = response.data.name;
    response.data.message.forEach((m) => {
      // console.log(m.UserId,m.message,m.name,userid,"m.UserId,m.message,m.name,userid");
      screenmsg(m.UserId, m.message, m.name, userid);
    });

    const button = document.querySelector(".send-btn"); //send msg button
    button.onclick = function () {
      const message = document.querySelector(".msg").value;
      const obj = { message, gid };
      socket.emit("send-chat-message", message, username); ///socket
      PostMsg(obj);
    };
  } catch (e) {
    console.log(e);
  }
};

function showNotAdminGroup(groupname, gid) {
  //connected group
  const div1 = document.querySelector(".div3");
  const li = document.createElement("div");
  li.className = "div1li";
  li.innerHTML = ` <h2 class="div1h2">${groupname}</h2> 
 <button  onclick="AdminClick('${groupname}','${gid}')"  
  style="color:green" class="admin chat">Chat </button> `;
  div1.appendChild(li);
}

function showGetAlladmingroup(groupname, gid) {
  //admin group
  const ul = document.querySelector(".div1");
  const li = document.createElement("div");
  li.className = "div1li";
  li.innerHTML = ` <h2 class="div1h2">${groupname}</h2> 
 <span style="color:red" class="admin">admin</span>
   <button  onclick="AdminClick('${groupname}','${gid}')"  
  style="color:blue" class="admin ">Chat
  </button>
    <button  onclick="AdminUsers('${groupname}','${gid}')"   style="color:orange" 
  class="admin seconduser" >Users</button>`;
  ul.appendChild(li);
}

//not connected to connected group
const showrestgroupname = (groupname, id) => {
  const div4 = document.querySelector(".div4"); //notconnected group

  const button = document.createElement("button");
  const btn = document.createElement("button");
  btn.innerHTML += "Join";
  btn.onclick = async function () {
    btn.style.display = "none";
    const div3btn = document.querySelector(".div3btn");
    div3btn.style.display = "none";
    const token = localStorage.getItem("token");
    // console.log(groupname,id,adminid,"#@42242343");
    try {
      const res = await axios.get(
        `http://localhost:3000/group/addrestgroupname/${id}`,
        { headers: { Authorization: token } }
      );
      //  console.log(res.data.groupname,'AAAAA');

      showNotAdminGroup(res.data.groupname.groupname);
    } catch (e) {
      console.log(e);
    }
  };
  button.className = "div3btn";
  button.innerHTML += groupname;
  div4.appendChild(button);
  div4.appendChild(btn);

  // div4.appendChild(btn);
};

const GetAllgroup = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:3000/group/getallgroup", {
      headers: { Authorization: token },
    });
    // console.log("231211",res);
    console.log(res.data.admingroupname);
    console.log(res.data.notadmingroupname, "not");

    res.data.admingroupname.forEach((e) => {
      showGetAlladmingroup(e.groupname, e.id);
    });

    res.data.notadmingroupname.forEach((e) => {
      // user connected group
      showNotAdminGroup(e.groupname, e.id);
    });

    const notconnectedgroup = res.data.notconnectedgroupname;
    if (notconnectedgroup) {
      //exist
      notconnectedgroup.forEach((e) => {
        showrestgroupname(e.groupname, e.id);
      });
    }
  } catch (e) {
    console.log(e);
  }
};

//UserAdminGroup -ButtonUsers
const AdminUsers = async (gname, gid) => {
  // socket.emit('new-user', {groupId,userId})
  console.log(gname, gid);
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `http://localhost:3000/users/adminusers/${gid}`,
      { headers: { Authorization: token } }
    );
    //name,userid
    const user = res.data.user;
    console.log(user);
    user.forEach((user) => {
      secondTimeUserPrint(user.name, user.id, gid);
    });
  } catch (e) {
    console.log(e);
  }
};

const pageopen = document.querySelector(".pageopen");
pageopen.style.display = "none";

const RemoveUser = async (userid, gid) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `http://localhost:3000/group/removeuser/${gid}/${userid}`,
      { headers: { Authorization: token } }
    );
  } catch (e) {
    console.log(e);
  }
};

const secondTimeUserPrint = (name, userid, gid) => {
  const pageopen = document.querySelector(".pageopen");
  pageopen.style.display = "block";
  const ulfirst = document.querySelector(".ul-first");
  ulfirst.scrollTop = 0;

  const closeBtn = document.getElementById("closeBtn");
  const newPage = document.querySelector(".new-page");
  closeBtn.addEventListener("click", () => {
    newPage.style.display = "none";
    location.reload();
  });

  const div = document.createElement("div");
  div.className = "makeadmindiv";
  const span = document.createElement("span");
  span.className = "makeadminspan";
  span.innerHTML += name;
  const button = document.createElement("button");
  button.textContent = "MakeAdmin";
  const delbutton = document.createElement("button");
  delbutton.textContent = "RemoveUser";
  delbutton.addEventListener("click", () => {
    if (delbutton.textContent === "RemoveUser") {
      delbutton.textContent = "UserRemoved";
      RemoveUser(userid, gid);
    }
  });
  div.appendChild(span);
  div.appendChild(button);
  div.appendChild(delbutton);
  newPage.append(div);

  button.addEventListener("click", () => {
    if (button.textContent == "MakeAdmin") {
      button.textContent = "RemoveAdmin";
      MakeAdmin(userid, gid);
    } else if (button.textContent == "RemoveAdmin") {
      button.textContent = "MakeAdmin";
      RemoveAdmin(userid, gid);
    }
  });
};

const MakeAdmin = async (userid, gid) => {
  console.log(userid, gid);
  try {
    const token = localStorage.getItem("token");
    await axios.get(
      `http://localhost:3000/group/promoteadmin/${gid}/${userid}`,
      { headers: { Authorization: token } }
    );
  } catch (e) {
    console.log(e);
  }
};
const RemoveAdmin = async (userid, gid) => {
  console.log(userid, gid);
  try {
    const token = localStorage.getItem("token");
    await axios.get(
      `http://localhost:3000/group/removeadmin/${gid}/${userid}`,
      { headers: { Authorization: token } }
    );
  } catch (e) {
    console.log(e);
  }
};
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

const searchText = async () => {
  const token = localStorage.getItem("token");
  const search = document.querySelector(".searchtext").value;
  const res = await axios.get(
    `http://localhost:3000/group/searchtext/${search}`,
    { headers: { Authorization: token } }
  );
  console.log(res.data, "res.data.users");

  res.data.forEach((e) => {
    showsearchText(e.id, e.name);
  });
};

const showsearchText = (uid, name) => {
  const div1 = document.querySelector(".searchdiv");
  const p = document.createElement("h2");
  p.className = "div1li";
  p.innerHTML += `${name} `;
  div1.appendChild(p);
};

function screen(msg, name) {
  const ul = document.querySelector(".ul");
  const p = document.createElement("p");
  p.style.marginLeft = "60%";
  p.innerHTML += ` <span class="msg-span">${msg}</span> <span class="span">${name}</span>`;
  ul.appendChild(p);
  scrollscreen();
}

socket.on("chat-message", (msg) => {
  console.log(msg);
  screen(msg.message, msg.username);
});
