function onLogin(e) {
  e.preventDefault();
  const email = document.querySelector(".email").value;
  const password = document.querySelector(".password").value;
  const obj = {
    email,
    password,
  };
  console.log(obj);
  onPostLogin(obj);
}

const onPostLogin = async (obj) => {
  try {
    const response = await axios.post("http://localhost:3000/user/login", obj);

    document.body.innerHTML += `<h3 style="color:green;">${response.data.message}</h3>`;
    alert(response.data.message);
    localStorage.setItem("token", response.data.token);
    window.location.href = "../chat/chat.html";
  } catch (e) {
    if (e.response.status === 401) {
      alert("Password is Incorrect");
    } else if (e.response.status === 404) {
      alert("User Doesnt Exist");
    } else {
      alert("Internal Server Error");
    }

    console.log(e);
  }
};

function forgotPassword() {
  window.location.href = "../ForgotPassword/forgot.html";
}
