console.log("Hello World");

/* ============================================================
   JS CLASS — ONE-FILE WORKBOOK
   ------------------------------------------------------------
   How to use:
   - Each exercise is written as a comment (lines starting with //).
   - Write your JavaScript in the blank space under each one.
   - Use console.log(...) to print your answer.
   - Run this file with Node:   node workbook.js
     (or paste one exercise at a time into a lesson's Run box.)

   Sections:
     PART 1 — IF STATEMENTS        (1–10)
     PART 2 — COMBINED PROJECT     (1–20)
     PART 3 — STRINGS + INTERVIEW  (1–25)
   ============================================================ */

/* ============================================================
   PART 1 — IF STATEMENTS
   ============================================================ */

// ----- 1. Simple if -----
// Declare `let age = 16`. Write an if that logs "You can drive" when age >= 16.
let age = 15;
if (age >= 16) {
  console.log("you can drive");
} else {
  console.log("can't drive");
}
// ----- 2. if / else -----
// Declare `let isWeekend = true`. Log "Relax!" if it is the weekend, otherwise "Go to work".
let isWeekend = true;
if ((isWeekend = true)) {
  console.log("Relax!");
} else {
  console.log("Go to work");
}
// ----- 3. Even or odd -----
// Declare `let number = 7`. Use if/else and `number % 2 === 0` to log "even" or "odd".
let number = 7;
if (number % 2 === 0) {
  console.log("even");
} else {
  console.log("odd");
}
// ----- 4. Grade the score -----
// Declare `let score = 82`. Log the letter grade:
//   90+ -> "A", 80–89 -> "B", 70–79 -> "C", below 70 -> "F".
let score = 82;
if (score === 100 || score >= 90) {
  console.log("A");
} else if (score <= 89 || score >= 80) {
  console.log("B");
} else if (score <= 79 || score >= 70) {
  console.log("C");
} else if (score <= 69 || score >= 60) {
  console.log("D");
} else {
  console.log("F");
}

// ----- 5. Biggest of two -----
// Declare `let a = 14` and `let b = 9`. Log whichever is larger, or "equal" if they match.
let a = 14;
let b = 9;
if (a > b) {
  console.log("a");
} else if (b > a) {
  console.log("b");
} else {
  console.log("equal");
}

// ----- 6. Temperature advice -----
// Declare `let temp = 30`. Log:
//   above 28 -> "Wear shorts", 15 to 28 -> "Wear a jacket", below 15 -> "Wear a coat".
let temp = 30;
if (temp > 28) {
  console.log("Wear shorts");
} else if (temp > 15 || temp < 28) {
  console.log("Wear a jacket");
} else {
  console.log("Wear a coat");
}
// ----- 7. Login message -----
// Declare `let username = "admin"` and `let password = "1234"`.
// If both are correct, log "Welcome", otherwise "Access denied".
let username = "admin";
let password = "1234";
if (username === "admin" && password === "1234") {
  console.log("Welcome");
} else {
  console.log("Access denied");
}

// ----- 8. Positive, negative, zero -----
// Declare `let n = -5`. Log "positive", "negative", or "zero".
let n = -5;
if (n > 0) {
  console.log("positive");
} else if (n < 0) {
  console.log("negative");
} else {
  console.log("zero");
}

// ----- 9. Ticket price -----
// Declare `let age = 65`. Price: under 12 -> "$5", 12 to 64 -> "$12", 65+ -> "$8".
let age1 = 65;
if (age1 < 12) {
  console.log("$5");
} else if (age1 >= 12 && age1 <= 64) {
  console.log("$12");
} else {
  console.log("$8");
}
// ----- 10. Traffic light -----
// Declare `let light = "yellow"`. Log:
//   "green" -> "Go", "yellow" -> "Slow down", "red" -> "Stop", else -> "Invalid light".
let Light = "yellow";
if (Light === "green") {
  console.log("Go");
} else if (Light === "yellow") {
  console.log("Slow down");
} else if (Light === "red") {
  console.log("stop");
} else {
  console.log("Invalid light");
}
/* ============================================================
   PART 2 — COMBINED PROJECT (variables + operators + if)
   ============================================================ */

// ----- 1. Movie ticket machine -----
// Variables: age, hasMembership (boolean).
//   under 12 OR over 65 -> "$6", member of any age -> "$8", everyone else -> "$12". Log the price.

let age2 = 34;
let hasMembership = true;
if (age2 <= 12 || age2 >= 65) {
  console.log("$6");
} else if ((hasMembership = false)) {
  console.log("$8");
} else {
  console.log("$12");
}

// ----- 2. Password strength -----
// Variable: password (string). Using password.length:
//   >= 12 -> "Strong", >= 8 -> "Medium", otherwise -> "Weak".

let passwords = "bayarmaahvselbaatar";
if (passwords.length >= 12) {
  console.log("Strong");
} else if (passwords.length >= 8) {
  console.log("Medium");
} else {
  console.log("Weak");
}
// ----- 3. Game level up -----
// let xp = 250, const levelUpAt = 200. If xp >= levelUpAt, log "Level up!" and reset xp to 0;
// otherwise log how much XP is left. Show xp before and after.
let xp = 20;
const levelUpAt = 200;
if (xp >= levelUpAt) {
  console.log("Level up!");
  xp = xp - levelUpAt;
  console.log(xp, "right");
} else {
  console.log(levelUpAt - xp, "hard");
}
// ----- 4. Tip calculator -----
// Variables: bill, serviceWasGood (boolean). Good -> 20% tip, otherwise 10%.
// Compute the tip and the total, log both.
let bill = 9;
serviceWasGood = false;
if (bill >= 20) {
  console.log("Good");
} else {
  console.log("10");
}
// ----- 5. Weather outfit -----
// Variables: temp, isRaining (boolean).
//   raining AND temp < 15 -> "Coat and umbrella", raining only -> "Umbrella",
//   temp > 28 -> "T-shirt", otherwise -> "Light jacket".
let temp1 = 5;
let isRaining1 = false;
if (temp1 < 15 && isRaining1 === false) {
  console.log("Coat and umbrella");
} else if (isRaining1 === true) {
  console.log("umbrella");
} else if (temp1 >= 28) {
  console.log("T-shirt");
} else {
  console.log("Light jacket");
}
// ----- 6. Exam pass with bonus -----
// Variables: score, attendedExtraClass (boolean).
// Pass if score >= 50, OR if score >= 45 AND attended the extra class. Log "Pass" or "Fail".
let scores = 46;
let attendedExtraClass = true;
if (scores >= 50) {
  console.log("Pass");
} else if (scores >= 45 && attendedExtraClass == true) {
  console.log("Pass");
} else {
  console.log("Fail");
}

// ----- 7. Cart discount -----
// Variables: total, isMember (boolean).
//   total >= 100 AND member -> 20% off, total >= 100 only -> 10% off, otherwise -> no discount.
// Log the final price.
let total = 120;
let isMember = true;
if (total >= 100 && isMember === true) {
  total = total * 0.8;
  console.log(total);
} else if (total >= 100 && isMember === false) {
  total = total * 0.9;
  console.log("total");
} else {
  console.log("no discount");
}
// ----- 8. Login system -----
// Variables: const correctUser, const correctPass, plus enteredUser, enteredPass, isLocked (boolean).
// Log "Welcome" only when NOT locked AND both username and password match. Otherwise "Login failed".
const correctUser = "hvn";
const correctPass = 1234;
let enteredUser = "hvn";
let enteredPass = 1234;
isLocked = true;
if (isLocked && correctUser === enteredUser && correctPass === enteredPass) {
  console.log("Welcome");
} else {
  console.log("Login failed");
}

// ----- 9. BMI category -----
// Variables: weight (kg), height (m). bmi = weight / (height * height). Log:
//   below 18.5 -> "Underweight", 18.5–24.9 -> "Normal", 25–29.9 -> "Overweight", 30+ -> "Obese".
let weight = 100;
let height = 1.75;
let bmi = weight / (height * height);
if (bmi < 18.5) {
  console.log("Underweight");
} else if ((bmi >= 18.5) & (bmi <= 24.9)) {
  console.log("Normal");
} else if ((bmi >= 25) & (bmi <= 29.9)) {
  console.log("Overweight");
} else {
  console.log("Obese");
}

// ----- 10. Mini ATM -----
// let balance = 500, let withdrawAmount = 200, const dailyLimit = 300.
// Allow only when withdrawAmount <= balance AND withdrawAmount <= dailyLimit.
//   allowed -> subtract from balance, log "Success" + new balance;
//   too much -> "Insufficient funds"; over limit -> "Over daily limit".
let balance = 50;
let withdrawAmount = 400;
const dailyLimit = 300;
if (withdrawAmount <= balance && withdrawAmount <= dailyLimit) {
  console.log("success");
} else if (withdrawAmount <= balance && withdrawAmount <= dailyLimit) {
  console.log("Over daily limit");
} else {
  console.log("balance");
}
// ----- 11. Leap year check -----
// Variable: year. Leap when divisible by 4 AND (not divisible by 100 OR divisible by 400).
// Use % with && and ||. Log "Leap year" or "Normal year". Test with 2000, 1900, 2024.
// let year = 1900
// if(year % 4 === 0 && year % 400===0 || year % 100 !==0|| year % 400 === 0 ){console.log("Normal year")}
// else{console.log("Leap year")}
// ----- 12. FizzBuzz (one number) -----
// Variable: n. divisible by 3 AND 5 -> "FizzBuzz", by 3 only -> "Fizz", by 5 only -> "Buzz",
// otherwise -> the number itself. Test with 15, 9, 10, 7.
let num = 7;
if (num % 3 === 0 && num % 5 === 0) {
  console.log("FizzBuzz");
} else if (num % 3 === 0) {
  console.log("Fizz");
} else if (num % 5 === 0) {
  console.log("Buzz");
} else {
  console.log("num");
}
// ----- 13. Rock paper scissors -----
// Variables: player1, player2 (strings: "rock", "paper", "scissors").
// Log "Player 1 wins", "Player 2 wins", or "Tie". rock>scissors, scissors>paper, paper>rock.
// let players1 = "rock";
// let player2 = "paper";
// let players = "scissors";
// if ("rock" > "scissors" ||  "scissors" > "paper" && "paper" > "rock") {
//   console.log("Player 1 wins");
// } else if (  "paper" < "rock" || "rock" < "scissors" &&  "scissors" < "paper") {
//   console.log("Player 2 wins");
// } else {
//   console.log("Tie");
// }
// ----- 14. Triangle type -----
// Variables: sides a, b, c. First check valid triangle (each side < sum of other two).
// invalid -> "Not a triangle"; all equal -> "Equilateral"; exactly two equal -> "Isosceles";
// all different -> "Scalene".
let sides2 = a;
let sides = b;
let side1 = "c";
if (a > "c" && b > "c" && a === b) {
  console.log("triangle");
} else if (a < "c" && b < "c" && a < b) {
  console.log("not triangle");
} else if (a === b && b === "c" && "c" === a) {
  console.log("equilateral");
} else if (a === b && b === a) {
  console.log("Isosceles");
} else {
  console.log("scalene");
}

// ----- 15. 12-hour clock -----
// Variable: hour (0–23). Convert to 12-hour and log like "3 PM".
//   0 -> "12 AM", 12 -> "12 PM", 1–11 -> "AM", 13–23 -> subtract 12 and add "PM".
// Test with 0, 9, 12, 18.
let hours = 18;
if (hours === 0) {
  console.log("12 AM");
} else if (hours === 12) {
  console.log("12PM");
} else if (hours >= 1 && hours <= 11) {
  console.log("AM");
} else if (hours >= 13 && hours <= 23) {
  console.log("subtract 12");
} else {
  console.log("PM");
}

// ----- 16. Shipping cost -----
// Variables: weight (kg), isExpress (boolean), isMember (boolean).
// Base: weight <= 1 -> $5, weight <= 5 -> $10, otherwise -> $20.
// If isExpress, double base. Then if isMember, take $3 off (never below $0). Log final cost.
let weight1 = 4
let isExpress = true
let isMember1 = true
if(weight1 <= 1 && isExpress === true && isMember1 === true){
  console.log("5$")
}else if(weight1 <=5 && isExpress === false && isMember1 === false){
console.log("10$")
} else{
  console.log("20$")
}
// ----- 17. Progressive tax -----
// Variable: income. first $10,000 -> 0%, $10,001–$30,000 -> 10% on that portion,
// above $30,000 -> 20% on that portion. Log total tax. Test with 5000, 20000, 50000.
let income = 50000
if(income<=10000){
  income = income*1
  console.log(income)
}else if(income > 10001 && income <30000){
  income= income*0.9
  console.log(income)
}else if(income> 30000){
  income = income*0.8
  console.log(income)
}
// ----- 18. Password validator -----
// Variables: password (string), confirmPassword (string). Log "Valid" only when ALL true:
//   length >= 8, NOT equal to "password", AND matches confirmPassword.
// Otherwise a specific reason: "Too short", "Too common", or "Does not match" (in that order).
let password1 = "123456789"
let confirmPassword= "123456789"
if(password1.length<8){
  console.log("Too short")
}else if(password1=== "password"){
  console.log("Too common")
}else if(password1 !== confirmPassword){
  console.log("Does not match")
}else{
  console.log("Valid")
}
// ----- 19. Concert pricing -----
// Variables: age, day (string), hasVipCode (boolean). Start price $50.
//   under 18 OR 65+ -> half price; day is "Tuesday" -> $10 off (after age discount);
//   hasVipCode -> add flat $30 at the end. Log the final price.
let nas = 14
let prices= "$50"
let udur = "Tuesday"
let hasVipCode = true
if(nas < 18 || nas >65 && udur=== "Monday" && hasVipCode === false){
  console.log("half price")
}else if(nas < 18 || nas >65 && udur === "Tuesday" && hasVipCode === false){
  prices= prices/2*0.9
  console.log(prices)
}else if(hasVipCode=== true && nas < 18 || nas >65 && udur === "Tuesday"){
  prices+=30
  console.log(prices)
}
// ----- 20. Vending machine -----
// const price = 150 (cents), insertedAmount (cents), isSoldOut (boolean). In order:
//   isSoldOut -> "Sold out" and stop; insertedAmount < price -> log how much more is needed;
//   exact -> "Enjoy your drink!"; too much -> "Enjoy your drink!" AND change (insertedAmount - price).

/* ============================================================
   PART 3 — STRINGS + INTERVIEW ROUND
   ------------------------------------------------------------
   Tools: .length .toUpperCase() .toLowerCase() text[i] .charAt()
          .includes() .indexOf() .slice() .substring() .trim() + (join)
   Convert: String(n)  Number(s)  (n).toString()  "" + n  isNaN(Number(x))
   ============================================================ */

// ----- 1. How long is the word? -----
// word (string). Log word.length. if longer than 5 -> "Long word", else "Short word".
// Test "sun" and "elephant".

// ----- 2. Loud and quiet -----
// name (string). Log it with .toUpperCase() and with .toLowerCase().

// ----- 3. First and last letter -----
// word (string). Log word[0] and word[word.length - 1]. Test "hello" -> h and o.

// ----- 4. Cut a piece (slice) -----
// word = "JavaScript". Log word.slice(0, 4) and word.slice(4).

// ----- 5. Is it an email? -----
// email (string). if email.includes("@") -> "Looks like an email", else "Not an email".
// Test "sam@mail.com" and "sam.com".

// ----- 6. Full name builder -----
// firstName, lastName (strings). Join with a space using + into fullName.
// Log fullName and fullName.length.

// ----- 7. Valid username -----
// username (string). Valid only when length >= 3 AND <= 15.
// Log "Valid username" or "Invalid username".

// ----- 8. Same word? (ignore case) -----
// a, b (strings). if a.toLowerCase() === b.toLowerCase() -> "Match", else "No match".
// Test "Hello" and "hello".

// ----- 9. Clean the spaces (trim) -----
// raw = "   hi there   ". clean = raw.trim(). Log clean and clean.length. Compare to raw.length.

// ----- 10. Find a letter (indexOf) -----
// word (string). word.indexOf("a"). if -1 -> "No letter a", else "Found a at position " + ...
// Test "banana" and "sky".

// ----- 11. Phone area code -----
// phone (10-char string like "5551234567"). Log "Area code: " + phone.slice(0, 3).
// if phone.length is not exactly 10 -> "Invalid number".

// ----- 12. Password rule (length + word) -----
// password (string). "Strong" only when length >= 8 AND NOT contains "password"
// (!password.toLowerCase().includes("password")). Otherwise "Weak".

// ----- 13. Initials -----
// firstName, lastName (strings). first letters uppercase, join with + and dots -> "M.J.".
// "maria" + "jones" -> "M.J.".

// ----- 14. Capitalize a name -----
// name = "maria". Join name[0].toUpperCase() with name.slice(1) -> "Maria".

// ----- 15. Tiny palindrome check -----
// word (3-letter string like "mom"). Reverse with word[2]+word[1]+word[0], compare with ===.
// Log "Palindrome" or "Not a palindrome". Test "mom" and "cat".

// --- Interview round: Numbers <-> Strings ---

// ----- 16. Count the digits -----
// n (number). String(n).length. if more than 3 digits -> "Big number", else "Small number".
// Test 42 and 10000.

// ----- 17. Sum the two digits -----
// n (2-digit number like 47). s = String(n). Number(s[0]) + Number(s[1]). Log the sum.
// if sum is exactly 10 -> "Round". Test 47 and 55.

// ----- 18. First and last digit -----
// n (3-digit number). s = String(n). Log Number(s[0]) and Number(s[s.length - 1]).
// if equal -> "Same ends". Test 363 and 481.

// ----- 19. Reverse a 3-digit number -----
// n (3-digit number). s = String(n). reversed = Number(s[2] + s[1] + s[0]). Log it.
// Test 123 -> 321.

// ----- 20. Palindrome number -----
// n (3-digit number). Build reversed like #19, compare to n with ===.
// Log "Palindrome" or "Not a palindrome". Test 121 and 123.

// ----- 21. Contains a lucky 7? -----
// n (number). if String(n).includes("7") -> "Lucky!", else "No luck". Test 1700 and 2024.

// ----- 22. Glue two numbers -----
// a = 12, b = 34. Number(String(a) + String(b)) -> 1234. Log it, then log typeof the result.

// ----- 23. Pad the clock -----
// minute (0–59). if String(minute).length === 1 add "0" in front. Log like "05" or "42".
// Test 5 and 42.

// ----- 24. Cents to price tag -----
// cents (3+ digit number like 150). s = String(cents).
// rest = s.slice(s.length - 2); dollars = s.slice(0, s.length - 2).
// Log "$" + dollars + "." + rest -> "$1.50". Test 150 and 905.

// ----- 25. Is this string a number? -----
// input (string like "42" or "hello"). if isNaN(Number(input)) -> "Invalid input";
// otherwise turn it into a number, double it, log the result. Test "21" and "abc".

/* ============================================================
   End of workbook. Nice work!
   ============================================================ */
