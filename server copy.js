const fs = require("fs");
const { Matrix } = require("ml-matrix");
let textFile = "test2.txt";
let numUsers;
let users;
let numItems;
let items;
let matrix;
let userData = {};
let reverseUserDataIndex = {};
function readFile(file) {
  try {
    const fileContent = fs.readFileSync(textFile, "utf-8");
    const lines = fileContent.split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (i == 0) {
        [numUsers, numItems] = lines[i].split(" ").map(Number);
        matrix = new Matrix(numUsers, numItems);
      } else if (i == 1) {
        users = lines[i].split(" ");
        for (let i = 0; i < users.length; i++) {
          const userName = users[i].trim();
          userData[userName] = {
            rowNum: i,
            likedItems: [],
          };
          reverseUserDataIndex[i] = userName;
        }
      } else if (i == 2) {
        items = lines[i].split(" ").map((item) => item.trim());
      } else if (!lines[i].length == 0) {
        let ratings = lines[i].split(" ");
        for (let j = 0; j < ratings.length; j++) {
          matrix.set(i - 3, j, ratings[j]); // was ratings[j]
          if (ratings[j] == 1) {
            const currentUser = reverseUserDataIndex[i - 3].trim();
            userData[currentUser].likedItems.push(items[j]);
          }
        }
      }
    }
  } catch (err) {
    console.log("ERROR: reading file", err);
  }
}

function recommended() {
  let user1 = userData["User1"];
  console.log("User1 Liked Items", user1.likedItems);
  console.log("--------------------------");
  let similarUsers = Object.keys(userData).filter((userName) => userName !== "User1" && haveCommonItems(user1, userData[userName]));
  console.log("Similar Users", similarUsers);
  console.log("--------------------------");
  let potentialItems = getPotentialItems(similarUsers, user1.likedItems);
  console.log("Potential Items", potentialItems);
  console.log("--------------------------");
  let recItems = paths(similarUsers, potentialItems, user1.likedItems);
  console.log(recItems);
}
function paths(simUsers, pItems, u1LikedItems) {
  //loop through userdata, only consider sim Users, for each p item, count how many times it occurs
  let itemPaths = new Map(pItems.map((item) => [item, 0]));
  u1LikedItems.forEach((u1LikedItem) => {
    Object.keys(userData).forEach((username) => {
      //only consider similar users in the userData
      if (simUsers.includes(username)) {
        //gets all liked items from the currently selected similar user
        let curUserLikedItems = userData[username].likedItems;
        curUserLikedItems.forEach((item) => {
          let both = 0;
          if (u1LikedItem == item) {
            return;
          }
        });
        if (pItems.includes(item)) {
        }
        //only consider similar users in the userData
      }
      // if (simUsers.includes(username)) {
      //   let curUserLikedItems = userData[username].likedItems;
      //   curUserLikedItems.forEach((item) => {
      //     if (pItems.includes(item)) {
      //       itemPaths.set(item, itemPaths.get(item) + 1);
      //     }
      //   });
      // }
    });
  });

  return itemPaths;

  //   if (simUsers.includes(username)) {
  //     let curUserLikedItems = userData[username].likedItems;
  //     curUserLikedItems.forEach((item) => {
  //       if (pItems.includes(item)) {
  //         itemPaths.set(item, itemPaths.get(item) + 1);
  //       }
  //     });
  //   }
  // });
}
function getPotentialItems(simUsers, u1LikedItems) {
  let potentialItems = new Set();
  simUsers.forEach((userName) => {
    userData[userName].likedItems.forEach((item) => {
      if (!u1LikedItems.includes(item)) {
        potentialItems.add(item);
      }
    });
  });
  return Array.from(potentialItems);
}
function haveCommonItems(user1, user2) {
  return user1.likedItems.some((item) => user2.likedItems.includes(item));
}
readFile(textFile);
console.log("OG DATA", userData);
console.log("--------------------------");
recommended();

// let similarUsersWithLikedItems = Object.keys(userData)
//   .filter((userName) => userName !== "User1" && haveCommonItems(user1, userData[userName]))
//   .map((userName) => ({ userName, likedItems: userData[userName].likedItems }));
// console.log("Similiar Users");
// console.log(similarUsersWithLikedItems);
// let similarUsersWithLikedItems = Object.keys(userData)
//     .filter((userName) => userName !== "User1" && haveCommonItems(user1, userData[userName]))
//     .map((userName) => ({
//       userName,
//       likedItems: userData[userName].likedItems.filter((item) => !user1.likedItems.includes(item)),
//     }));
