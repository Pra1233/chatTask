function onSignup(e) {
  e.preventDefault();
  const name = document.querySelector(".name").value;
  const email = document.querySelector(".email").value;
  const password = document.querySelector(".password").value;
  const phone = document.querySelector(".phone").value;
  const obj = {
    name,
    email,
    password,
    phone,
  };
  //   onPost(obj); //function
  console.log(obj);
}

const onPost = async (obj) => {
  try {
    const res = await axios.post("http://localhost:4000/user/adduser", obj);
    alert(res.data.message);
    // window.location.href="../expense/index.html"
    window.location.href = "../Login/login.html";
    if (res.status === 201) {
    } else {
      throw new Error("Failed to Login");
    }
  } catch (e) {
    document.body.innerHTML += `<h3 style="color:red;">${e}</h3>`;
    console.log(e);
  }
};

//Login
