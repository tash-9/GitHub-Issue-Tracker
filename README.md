# Q&A

1️⃣ What is the difference between var, let, and const?
Ans: i) var doesn't respect Function scoped or blocks scoped. It can cause unexpected bugs due to hoisting.
    ii) let is block scoped{} where values of the scope can be changec.
    ii) const is also a block scoped where value cannot be reassigned.

2️⃣ What is the spread operator (...)?
Ans: Spread Operator (...) can copy an array, merge multiple arrays and makes it easy to pass values into functions. Example:
const newArr = [...arr];
const max = Math.max(...arr);

3️⃣ What is the difference between map(), filter(), and forEach()?
Ans: i)map() can transforms each array element & returns a new array
    ii)filter() can returns a new array with elements that satisfies a condition
    iii)find() can returns the only first element that matches a condition

4️⃣ What is an arrow function?
Ans: Arrow Function is const add = (a, b) => a + b;
It has short syntax, makes code cleaner

5️⃣ What are template literals?
Ans: Template literals are strings enclosed in backticks that allow variable interpolation and multi-line strings.

