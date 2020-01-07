class Person {
    static id = 0;

    constructor(firstName, lastName) {
        this.id = Person.id++;
        this.first = firstName;
        this.last = lastName;
        // Generates a random email base on first name and a random number
        this.email = this.first.toLowerCase() + Math.floor(Math.random() * 255) + '@gmail.com';
    }
}

var arr = [];
// Fetch a list of random names
async function getNames(num) {
    let res = await fetch(`http://www.filltext.com/?rows=${num}&fname={firstName}&lname={lastName}&pretty=true`);
    let body = await res.json();
    let tempArray = [];


    for (let i in body) {
        tempArray.push(new Person(body[i].fname, body[i].lname));
        arr.push(tempArray[i]);
    }

    console.log("Global array: ", arr);
    console.log("Temp array: ", tempArray);

    updateTable(tempArray);
}

function updateTable(namesArr) {
    var table = document.getElementById("table");

    for (let i of namesArr) {
        var row = table.insertRow(1);

        for (let j = 0; j < 4; j++) {
            var cell = row.insertCell(j);
            switch (j) {
                case 0:
                    cell.innerHTML = `${i.id}`;
                    break;
                case 1:
                    cell.innerHTML = `${i.first}`;
                    break;
                case 2:
                    cell.innerHTML = `${i.last}`;
                    break;
                case 3:
                    cell.innerHTML = `${i.email}`;
                    break;
            }
        }
    }

    document.getElementById("count").innerHTML = arr.length;    // Update count
}


let random = () => {
    let randomNum = Math.floor(Math.random() * arr.length);

    alert(`${arr[randomNum].first} ${arr[randomNum].last}`);
    console.log(`Random person's ID is ${arr[randomNum].id} \nArray size: ${arr.length}`);
};