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
  } catch (error) {
    if (error.response) {
      if (error.response.status === 403) {
        alert("User already exists");
      } else {
        console.error("Server Error:", error.response.data);
        alert("An error occurred. Please try again later.");
      }
    } else if (error.request) {
      console.error("No response received:", error.request);
      alert("No response received from the server. Please try again later.");
    } else {
      console.error("Request Error:", error.message);
      alert("An error occurred. Please try again later.");
    }
  }
};

//Login
