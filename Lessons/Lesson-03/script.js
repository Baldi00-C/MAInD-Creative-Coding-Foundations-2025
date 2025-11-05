const addButton = document.getElementById('add-btn');
const ListButton  = document.getElementById('List-view-btn');
const cardButton = document.getElementById('Card-view-btn');

const taskInput = document.getElementById('task-input');
const TaskInput = document.getElementById('task-list-container');

// event Listeners
//List
ListButton.addEventListener('click', () => {
    console.log("List view button pressed!!!!")

    taskList.classList.remove('card-view');
    taskList.classList.add('list-view');
     })

     const funzioneA = () => {
     }

     funzioneA();
     
//Card
cardButton.addEventListener('click', () => {'click' , () => {
    console.log("Card view button pressed!!!!")
    taskList.classList.remove('list-view');
    taskList.classList.add('card-view');
        }


 //Add
addButton.addEventListener('click', () => {

    console.log("Add button pressed!!!!");

    const inputValue = taskInput.value;

    console.log(inputValue);

    const listElement = document.createElement('li')
    
    listElement.innerHTML = inputValue;
    
    document.elementByIf('task-list-container').appendChild(listElement);

    TaskInput.value=''

 })

