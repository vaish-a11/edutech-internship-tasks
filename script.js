const users = [
  {
    name: "John Doe",
    age: 22
  },

  {
    name: "Alice Smith",
    age: 25
  },

  {
    name: "Michael Johnson",
    age: 21
  },

  {
    name: "Sophia Brown",
    age: 24
  }
];

const loadBtn = document.getElementById("loadBtn");

const userList = document.getElementById("userList");

loadBtn.addEventListener("click", () => {

  userList.innerHTML = "";

  users.forEach((user) => {

    const li = document.createElement("li");

    li.textContent =
      `${user.name} - Age: ${user.age}`;

    userList.appendChild(li);

  });

});