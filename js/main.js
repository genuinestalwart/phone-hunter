window.addEventListener('load', () => {
    document.getElementById('search-button').addEventListener('click', () => {
        const search = document.getElementById('search-input').value;
        document.getElementById('phone-container').innerHTML = '';
        setTimeout(loadingSpinner, 125);

        if (search === '') {
            setTimeout(notFound, 625);
        } else {
            loadData(search);
        }
    });
});

const loadingSpinner = () => {
    document.getElementById('not-found').style.display = 'none';
    document.getElementById('loading-spinner').style.display = 'flex';
};

const notFound = () => {
    document.getElementById('loading-spinner').style.display = 'none';
    document.getElementById('not-found').style.display = 'block';
};

async function loadData(search) {
    const res = await fetch(`https://openapi.programming-hero.com/api/phones?search=${search}`);
    const data = await res.json();
    await showData(data.data.slice(0, 20));
}

const showData = data => {
    console.log(data);

    const div = document.createElement('div');
    div.classList.add('g-5', 'row');

    data.forEach(el => {
        const childDiv = document.createElement('div');
        childDiv.classList.add('col-12', 'col-md-4');
        childDiv.innerHTML = `
            <div class="bg-light card px-2 py-3 phone">
                <div class="card-body">
                <div><img class=" d-block mx-auto rounded-3 w-50" src="${el.image}" alt="${el.phone_name}"></div>
                <h4 class="card-title mt-4">${el.phone_name}</h4>
                <p class="card-text">${el.brand}</p>
                </div>
            </div>`;
        div.appendChild(childDiv);
    });

    setTimeout(addData, 750, div);
};

const addData = div => {
    document.getElementById('loading-spinner').style.display = 'none';
    document.getElementById('not-found').style.display = 'none';
    document.getElementById('phone-container').appendChild(div);
};