let Person = class {
    static count = 0;

    constructor(firstName, lastName, country) {
        this.id = Person.count++;
        this.firstName = firstName;
        this.lastName = lastName;
        this.country = country;
    }
}

let people = [];
let tableRowsCount = 1;

async function generatePeople(input) {
    let res = await fetch(`http://www.filltext.com/?rows=${input}&firstName={firstName}&lastName={lastName}&country={country}&pretty=true`);
    let body = await res.json();

    let tempArray = appendArrays(body);

    console.log(`people: `);
    console.log(people);

    updateTable(tempArray);
}

// Append new people to tempArray array
function appendArrays(body) {
    let tempArray = []; // This array stores the newly-generated people

    for (let i in body) {
        tempArray.push(new Person(body[i].firstName, body[i].lastName, body[i].country));
        people.push(tempArray[i]);
    }
    return tempArray;
}

function getpeople() {
    return people;
}

// Adds the newly generated people to the existing HTML table
function updateTable(data) {
    let table = document.getElementById("myTable");

    switch (data.constructor.name) {
        case 'Person': {
            let row = table.insertRow(tableRowsCount++);

            row.insertCell(0).innerHTML = data.id;
            row.insertCell(1).innerHTML = data.firstName;
            row.insertCell(2).innerHTML = data.lastName;
            row.insertCell(3).innerHTML = data.country;
        }
            break;

        case 'Array': {
            for (let i in data) {
                let row = table.insertRow(tableRowsCount++);

                row.insertCell(0).innerHTML = data[i].id;
                row.insertCell(1).innerHTML = data[i].firstName;
                row.insertCell(2).innerHTML = data[i].lastName;
                row.insertCell(3).innerHTML = data[i].country;
            }
        }
            break;

        default:
            console.log("Error updating table");
            break;
    }

    document.getElementById("count").innerHTML = Person.count;
}

// Select a random person from people array
function selectRandom() {
    if (people.length == 0) {
        console.log('people array is empty');
        return;
    }

    const num = Math.floor(Math.random() * people.length);

    console.log(`Random person selected: id ${people[num].id}`);
    alert(getPersonInfo(people[num]));
}

function getPersonInfo(person) {
    return `${person.id} - ${person.firstName} ${person.lastName} \t country: ${person.country}`;
}

// TODO -- change input type to form with submit button
function addManually() {
    let first = document.getElementById('manualFirst').value;
    let last = document.getElementById('manualLast').value;
    let country = document.getElementById('manualCountry').value;

    if (first.length == 0 || last.length == 0 || country.length == 0) {
        console.log('Error manually adding new person');
        return;
    }

    let p = new Person(first, last, country);

    people.push(p);

    updateTable(p);
    document.getElementById('manualAddPanel').style.display = 'none';
}

function showManualPanel() {
    document.getElementById('manualFirst').value = null;
    document.getElementById('manualLast').value = null;
    document.getElementById('manualCountry').value = null;

    document.getElementById('manualAddPanel').style.display = 'initial';
}