$(document).ready(function () {
    $('#title').autocomplete({
        source: async function (request, response) {
            let data = await fetch(`https://verificare-cod-caen.herokuapp.com/search?query=${request.term}`)
                .then(results => results.json())
                .then(results => results.map(result => {
                    return {
                        label: `${result.codCaen} ${result.denumire} ${result.punctaj}`,
                        value: `${result.codCaen} ${result.denumire}`,
                        id: result._id
                    }
                }))
            response(data)
            //console.log(response)
        },
        minLength: 2,
        select: function (event, ui) {
            console.log(ui.item.id)
            fetch(`https://verificare-cod-caen.herokuapp.com/get/${ui.item.id}`)
                .then(result => result.json())
                .then(result => {
                    console.log(Object.values(result));
                    const resArray = Object.values(result)
                    const keyArray = Object.keys(result)
                    // $('#info').empty()
                    $("#info").append(`<li><span class="styleAuto"> Cod CAEN:</span> ${resArray[1]}</li>`)
                    $("#info").append(`<li><span class="styleAuto"> Denumire:</span> ${resArray[2]}</li>`)
                    $("#info").append(`<li ><span class="styleAuto" id='score'> Punctaj: ${resArray[3]}</span></li>`)

                    if (resArray[3] == '+20p') {
                        document.getElementById('score').style.backgroundColor = 'green'
                        document.getElementById('score').style.color = 'white'
                    }

                    if (resArray[3] == '+15p') {
                        document.getElementById('score').style.backgroundColor = 'yellow'
                    }
                    if (resArray[3] == '+10p') {
                        document.getElementById('score').style.backgroundColor = 'lightblue'
                    }
                    if (resArray[3] == 'NEELIGIBIL') {
                        document.getElementById('score').style.backgroundColor = 'red'
                        document.getElementById('score').style.color = 'white'
                    }
                })
        }
    })
})