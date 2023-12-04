const fs = require("fs");
const { Matrix } = require("ml-matrix");
const path = require("path");
let textFile = "test.txt";
let numUsers;
let users;
let numItems;
let items;
let matrix;
let userData = {};
let adjacencyList = {};
let itemPaths = {};
function readFile(file) {
  try {
    const fileContent = fs.readFileSync(textFile, "utf-8");
    const lines = fileContent.split("\n");
    [numUsers, numItems] = lines[0].split(" ").map(Number);
    users = lines[1].split(" ").map((user) => user.trim());
    items = lines[2].split(" ").map((item) => item.trim());
    for (let i = 0; i < numUsers; i++) {
      const userName = users[i];
      userData[userName] = { likedItems: [] };
      adjacencyList[userName] = [];
    }
    for (let i = 3; i < lines.length; i++) {
      const ratings = lines[i].split(" ").map((user) => user.trim());
      const currentUser = users[i - 3];
      for (let j = 0; j < ratings.length; j++) {
        if (ratings[j] == "1") {
          const currentItem = items[j];
          userData[currentUser].likedItems.push(currentItem);
          adjacencyList[currentUser].push(currentItem);
        }
      }
    }
    // console.log("Adjacency List", adjacencyList);
  } catch (err) {
    console.log("ERROR: reading file", err);
  }
}
function recommended() {
  const user1LikedItems = adjacencyList["User1"];
  const simUsers = new Set();
  user1LikedItems.forEach((u1Item) => {
    Object.entries(adjacencyList).forEach(([user, curItem]) => {
      if (user != "User1") {
        if (curItem.includes(u1Item)) {
          simUsers.add(user);
        }
      }
    });
  });
  // console.log("Similar Users", simUsers);
  const pItems = new Set();
  Object.entries(adjacencyList).forEach(([user, curItem]) => {
    if (simUsers.has(user)) {
      curItem.forEach((item) => {
        if (!pItems.has(item) && !user1LikedItems.includes(item)) {
          pItems.add(item);
        }
      });
    }
  });
  // console.log("Potential Items", pItems);
  const edgeList = [];
  for (const user in adjacencyList) {
    const likedItems = adjacencyList[user];
    likedItems.forEach((item) => {
      edgeList.push({ source: user, rec: item });
    });
  }
  // console.log("Edge List", edgeList);
  pItems.forEach((item) => {
    const pathCount = paths(edgeList, "User1", item, 3);
    itemPaths[item] = pathCount;
  });
  const sortedItemPaths = Object.keys(itemPaths).sort((a, b) => itemPaths[b] - itemPaths[a]);
  sortedItemPaths.forEach((item) => {
    console.log(`${item} (${itemPaths[item]})`);
  });
}
function paths(edgeList, startNode, targetNode, depth, visited = new Set(), currentPath = []) {
  visited.add(startNode);
  currentPath.push(startNode);
  let pathCount = 0;
  if (startNode === targetNode && currentPath.length === depth + 1) {
    console.log("Path found:", currentPath.join(" -> "));
    pathCount++;
  } else if (currentPath.length <= depth) {
    const neighbors = edgeList.filter((edge) => edge.source === startNode || edge.rec === startNode);
    for (const neighbor of neighbors) {
      const nextNode = neighbor.source === startNode ? neighbor.rec : neighbor.source;
      if (!visited.has(nextNode)) {
        pathCount += paths(edgeList, nextNode, targetNode, depth, new Set(visited), [...currentPath]);
      }
    }
  }
  return pathCount;
}
readFile(textFile);
recommended();
