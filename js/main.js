const predictForm = document.querySelector('#predictForm');
const mainWrapper = document.querySelector('#mainWrapper');
const historyWrapper = document.querySelector('#historyWrapper');

let predicts = JSON.parse(localStorage.getItem('predicts')) || [];
renderEl("history", predicts);

async function genderPredict(url) {
    const respons = await fetch(url)
    const data = respons.json();
    return data;
}

function renderEl(where, data) {
    switch (where) {
        case 'main':
            const template = `
                <div class="w-[300px] block rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
                    <div class="relative overflow-hidden bg-cover bg-no-repeat" data-te-ripple-init
                        data-te-ripple-color="light">
                        <img class="rounded-t-lg" src="${data.image}" alt="male" />
                        <a href="#!">
                            <div
                                class="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[hsla(0,0%,98%,0.15)] bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100">
                            </div>
                        </a>
                    </div>
                    <div class="p-6">
                        <h4 class="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
                            Name: ${data.name}
                        </h4>
                        <h5 class="mb-2 text-lg font-medium leading-tight text-neutral-800 dark:text-neutral-50">
                            Gender: ${data.gender}
                        </h5>
                        <h6 class="mb-2 text-md font-medium leading-tight text-neutral-800 dark:text-neutral-50">
                            Probability: ${data.probability}
                        </h6>
                    </div>
                </div>
            `
            mainWrapper.innerHTML = template;
            break;
        case 'history':
            historyWrapper.innerHTML = "";

            data.forEach((res, id) => {
                const template = `
                    <div class="w-[300px] block rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
                        <div class="w-[300px] h-[300px] relative overflow-hidden bg-cover bg-no-repeat" data-te-ripple-init
                            data-te-ripple-color="light">
                            <img class="w-full h-full rounded-t-lg" src="${res.image}" alt="male" />
                            <a href="#!">
                                <div
                                    class="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[hsla(0,0%,98%,0.15)] bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100">
                                </div>
                            </a>
                        </div>
                        <div class=" p-6">
                            <h4 class="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
                                Name: ${res.name}
                            </h4>
                            <h5 class="mb-2 text-lg font-medium leading-tight text-neutral-800 dark:text-neutral-50">
                                Gender: ${res.gender}
                            </h5>
                            <h6 class="mb-2 text-md font-medium leading-tight text-neutral-800 dark:text-neutral-50">
                                Probability: ${res.probability}
                            </h6>

                            <button
                                onclick="deleteEl(${id})"
                                type="button"
                                class="inline-block rounded bg-danger px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#dc4c64] transition duration-150 ease-in-out hover:bg-danger-600 hover:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.3),0_4px_18px_0_rgba(220,76,100,0.2)] focus:bg-danger-600 focus:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.3),0_4px_18px_0_rgba(220,76,100,0.2)] focus:outline-none focus:ring-0 active:bg-danger-700 active:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.3),0_4px_18px_0_rgba(220,76,100,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(220,76,100,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.2),0_4px_18px_0_rgba(220,76,100,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.2),0_4px_18px_0_rgba(220,76,100,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.2),0_4px_18px_0_rgba(220,76,100,0.1)]">
                                Delete
                            </button>
                        </div>
                    </div>
                `
                historyWrapper.innerHTML += template;
            });

            break;
    }
}

predictForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = e.target[0];

    mainWrapper.innerHTML = "<h1 class='text-center'>Loading...</h1>";
    historyWrapper.innerHTML = "";

    genderPredict(`https://api.genderize.io/?name=${name.value}`)
        .then((data) => {
            name.value = "";

            let predict = data;
            predict.gender == "male" ?
                predict.image = "https://pics.craiyon.com/2023-07-28/69063d18c2664d0a9244666be0dc493b.webp"
                :
                predict.image = "https://img.freepik.com/free-photo/portrait-young-beautiful-woman-with-smoky-eyes-makeup-pretty-young-adult-girl-posing-studio-closeup-attractive-female-face_186202-4439.jpg?size=626&ext=jpg&ga=GA1.1.1412446893.1705276800&semt=ais"

            predicts.push(predict);
            localStorage.setItem("predicts", JSON.stringify(predicts));

            renderEl("main", predict);
            renderEl("history", predicts);
        }).catch((err) => {
            console.log(err);
        })
})

function deleteEl(id) {
    let data = predicts.filter((predict, index) => index != id);

    predicts = data;
    localStorage.setItem("predicts", JSON.stringify(predicts));

    renderEl("history", predicts);
}
