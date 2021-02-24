
function renderExercisePlans() {
    $("#weeks").empty();
    $.ajax({
        url: "/populatedexercises",
        method: "GET"
    }).then(dbData => {
        console.log(dbData)
        dbData.forEach(plan => {
            // make a new div for each workout
            const newDiv = $("<div>", {style: "width: 25%; border: 2px solid blue"})
            const title = $("<h3>", {text: plan.name})
            const newUl = $("<ul>", {text: "Exercises"})
            newDiv.append(title)

            // name: String,
            // type: String,
            // weight: Number,
            // sets: Number,
            // reps: Number,
            // duration: Number 

            // loop through exercises and print each
            plan.exercises.forEach(exercise => {
                const newLi = $("<li>", { 
                    text:`Name: ${exercise.name}\n
                    Type: ${exercise.type}\n
                    Weight: ${exercise.weight}\n
                    Sets: ${exercise.sets}\n
                    Reps: ${exercise.reps}\n
                    Duration: ${exercise.duration}`
                })
                    newUl.append(newLi);
            })
            // Form to add new exercises to the week
            const newForm = $("<form>", {id: plan._id})
            const newBtn = $("<button>", {
                text: 'Add exercise',
                class: 'update-btn',
                'data-id': plan._id
            })

            const nameInput = $("<input>", {
                type: 'text',
                id: `name-${plan._id}`,
                placeholder: 'New Exercise name:'
            })

            const typeLabel = $("<label>", {
                for: `type-${plan._id}`,
                text: 'Type of Exercise: '
            })
            const typeInput = $("<input>", {
                type: 'text',
                id: `type-${plan._id}`
            })

            const weightLabel = $("<label>", {
                for: `weight-${plan._id}`,
                text: 'Weight used: '
            })
            const weightInput = $("<input>", {
                type: 'number',
                id: `weight-${plan._id}`
            })

            const setsLabel = $("<label>", {
                for: `sets-${plan._id}`,
                text: 'How many Sets?'
            })
            const setsInput = $("<input>", {
                type: 'number',
                id: `sets-${plan._id}`
            })

            const repsLabel = $("<label>", {
                for: `reps-${plan._id}`,
                text: 'How many Reps?'
            })
            const repsInput = $("<input>", {
                type: 'number',
                id: `reps-${plan._id}`
            })

            const durationLabel = $("<label>", {
                for: `duration-${plan._id}`,
                text: 'What was the duration of this workout?'
            })
            const durationInput = $("<input>", {
                type: 'number',
                id: `duration-${plan._id}`
            })

            newForm
            .append(nameInput)
            .append(typeLabel)
            .append(typeInput)
            .append(weightLabel)
            .append(weightInput)
            .append(setsLabel)
            .append(setsInput)
            .append(repsLabel)
            .append(repsInput)
            .append(durationLabel)
            .append(durationInput)
            .append(newBtn)

            newDiv
            .append(newUl)
            .append(newForm)

            $("#weeks").append(newDiv)
        })
    })
}
renderExercisePlans();

$("#new-week").on('submit', (event)=> {
    event.preventDefault();
    const weekName = $("#week-name").val().trim();
    console.log(weekName);
    $.ajax({
        url: "/api/weeks",
        method: "POST",
        data: {name: weekName}
    }).then(renderExercisePlans())
})

$("#weeks").on('click', ".update-btn",(event)=> {
    event.preventDefault();
    const weekId = event.target.dataset.id;
    console.log(weekId);
    const name = $(`#name-${weekId}`).val().trim()
    const type = $(`#type-${weekId}`).val().trim()
    const weight = parseInt($(`#weight-${weekId}`).val())
    const reps = parseInt($(`#reps-${weekId}`).val())
    const sets = parseInt($(`#sets-${weekId}`).val())
    const duration = parseInt($(`#duration-${weekId}`).val())

    const newObj = {
        name, type, weight, reps, sets, duration, weekId
    }
    console.log(newObj);

    $.ajax({
        url: "/api/exercises",
        method: "POST",
        data: newObj
    }).then(dbExercises => {
        console.log(dbExercises)
        renderExercisePlans();
    }).catch(err => {
        console.log(err)
    })
})