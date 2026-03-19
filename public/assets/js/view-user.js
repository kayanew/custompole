// const viewUsersBtn = document.getElementById('ftch-users');
// viewUsersBtn.addEventListener('click', () => {
//     fetch('../../backend/users/viewUsers.php',{
//         method: "POST"
//     }) 
//         .then(response => {
//             if (!response.ok) throw new Error('Network response was not ok');
//             return response.json(); 
//         })
//         .then(data => {
//             displayUsers(data);
//         })
//         .catch(err => {
//             console.error('Fetch error:', err);
//         });
// });

// function displayUsers(listofUsers){
//     const infoTable = document.getElementById('userInfo-table');
//     infoTable.innerHTML = `<thead>
//         <th>id</th>
//         <th>Name</th>
//         <th>Email</th>
//         <th>Action</th>
//       </thead>`;
//     listofUsers.forEach(user => {
//         const userInfo = document.createElement('tbody');
//         userInfo.innerHTML = `<td>${user.id}</td><td>${user.name}</td><td>${user.email}</td>
//         <td><button>Delete</button></td>`;
//         infoTable.appendChild(userInfo);
//     });
// }