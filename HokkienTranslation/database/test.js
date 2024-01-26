import { addTranslation, getTranslation } from "./Database.js";

async function testAdd() {
  await addTranslation("Thank you", "感谢");
  console.log("Translation added");
}

async function testGet() {
  await getTranslation();
}

// Running the tests
testAdd().then(() => {
  setTimeout(() => {
    testGet();
  }, 3000); // 3 seconds delay
});
