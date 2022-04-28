export const fetchData1 =(url_api) => {
    return new Promise((resolve, reject) => {
        const xhttp = new XMLHttpRequest();
        xhttp.open('GET', url_api, true);
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState === 4) {
                (xhttp.status === 200)
                  ? resolve(JSON.parse(xhttp.responseText))
                  : reject( new Error(`Error with XMLHttp request
                  status: ${xhttp.status}`, url_api))
            }
        }
        xhttp.send();
    });
}

export const fetchData = async (url_api) => {
    const response = await fetch(url_api);
    const data = await response.json();

    return data;
}