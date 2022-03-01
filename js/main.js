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

let showMore = false;

async function loadData(search) {
    const res = await fetch(`https://openapi.programming-hero.com/api/phones?search=${search}`);
    const data = await res.json();
    await showData(data.data);
}

const showData = data => {
    document.getElementById('phone-container').innerHTML = '';
    const div = document.createElement('div');
    div.classList.add('g-5', 'row');

    data.forEach(el => {
        const childDiv = document.createElement('div');
        childDiv.classList.add('col-12', 'col-md-4');

        if (!showMore && data.indexOf(el) > 19) {
            childDiv.classList.add('d-none', 'extra-data');
        }

        childDiv.innerHTML = `
            <div class="bg-light card px-2 py-3">
                <div class="card-body">
                    <div><img class="d-block mx-auto rounded-3 w-50" src="${el.image}" alt="${el.phone_name}"></div>
                    <h4 class="card-title mb-0 mt-4">${el.phone_name}</h4>
                    <p class="card-text mt-2">${el.brand}</p>
                    <button class="btn btn-primary" onclick="loadDetails('${el.slug}')">Details</button>
                </div>
            </div>`;
        div.appendChild(childDiv);
    });

    if (data.length > 20) {
        const element = document.createElement('div');
        element.classList.add('col-12', 'col-md-4', 'px-2', 'py-3');

        if (showMore) {
            element.innerHTML = '<button class="btn" onclick="moreData()" id="more-or-less">Show less <i class="fa-solid fa-arrow-left"></i></button>';
        } else {
            element.innerHTML = '<button class="btn" onclick="moreData()" id="more-or-less">Show more <i class="fa-solid fa-arrow-right"></i></button>';
        }

        div.appendChild(element);
    }
    setTimeout(addData, 750, div);
};

const addData = div => {
    document.getElementById('loading-spinner').style.display = 'none';
    document.getElementById('not-found').style.display = 'none';
    document.getElementById('phone-container').appendChild(div);
};

async function loadDetails(slug) {
    const res = await fetch(`https://openapi.programming-hero.com/api/phone/${slug}`);
    const data = await res.json();
    await showDetails(data.data);
}

const showDetails = data => {
    const div = document.getElementById('details-container');
    div.innerHTML = `
    <div>
        <h3 class="fw-bold my-3">${data.name}</h3>
        <p class="my-1"><span>Brand:</span> ${data.brand}</p>
        <p class="my-1"><span>Release date:</span> ${data.releaseDate === '' ? 'unknown' : `${data.releaseDate}`}</p>
        <h5 class="fw-bold my-3">Main Features</h5>
        <ul>
            <li><span>Chipset:</span> ${data.mainFeatures.chipSet}</li>
            <li><span>Displaysize:</span> ${data.mainFeatures.displaySize}</li>
            <li><span>Memory:</span> ${data.mainFeatures.memory}</li>
            <li><span>Sensors:</span> ${arrayToString(data.mainFeatures.sensors)}</li>
            <li><span>Storage:</span> ${data.mainFeatures.storage}</li>
        </ul>
        ${data.others ? `
        <h5 class="fw-bold my-3">Others</h5>
        <ul>
            <li><span>Bluetooth:</span> ${data.others.Bluetooth}</li>
            <li><span>GPS:</span> ${data.others.GPS}</li>
            <li><span>NFC:</span> ${data.others.NFC}</li>
            <li><span>Radio:</span> ${data.others.Radio}</li>
            <li><span>USB:</span> ${data.others.USB}</li>
            <li><span>WLAN:</span> ${data.others.WLAN}</li>
        </ul>
        ` : ''}
    </div>
    <div class="text-end"><button type="button" class="btn btn-primary" data-bs-dismiss="modal">Ok</button></div>`;

    const modalDetails = new bootstrap.Modal(document.getElementById('modal-details'));
    modalDetails.show();
};

function arrayToString(array) {
    let returned = ``;
    if (array.length === 0) {
        returned += 'none';
    } else {
        for (const el of array) {
            returned += `${el}, `;
        }
    }
    return returned.slice(0, returned.length - 2);
}

const moreData = () => {
    if (showMore) {
        const extraData = document.getElementsByClassName('extra-data');
        console.log(extraData);
        Array.from(extraData).forEach(el => {
            el.classList.add('d-none');
        });
        document.getElementById('more-or-less').innerHTML = 'Show more <i class="fa-solid fa-arrow-right"></i>';
        showMore = false;
    } else {
        const extraData = document.getElementsByClassName('extra-data');
        console.log(extraData);
        Array.from(extraData).forEach(el => {
            el.classList.remove('d-none');
        });
        document.getElementById('more-or-less').innerHTML = '<i class="fa-solid fa-arrow-left"></i> Show less';
        showMore = true;
    }
};