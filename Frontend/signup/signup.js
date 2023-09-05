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
  onPost(obj); //function
  console.log(obj);
}

const onPost = async (obj) => {
  try {
    const res = await axios.post("http://localhost:3000/user/signup", obj);

    if (res.status === 201) {
      alert(res.data.message);
      window.location.href = "../Login/login.html";
    }
  } catch (e) {
    if (e.message === "Request failed with status code 403") {
      alert("User already exist");
    } else document.body.innerHTML += `<h3 style="color:red;">${e}</h3>`;

    // console.log(e);
  }
};

//Login
