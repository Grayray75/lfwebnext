// TODO: Rewrite this, replace with fetch?
function getResponse(url: string): Promise<any> {
    return new Promise(function (resolve, reject) {
        let request = new XMLHttpRequest();
        request.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(request.responseText);
            } else {
                console.warn('Something went wrong: ' + this.status);
                reject();
            }
        };
        request.onerror = function () {
            console.warn('Something went wrong: ' + this.status);
            reject();
        };

        request.open('GET', url, true);
        request.send();
    });
}

export async function getXml(url: string): Promise<Document> {
    let response = await getResponse(url);
    let parser = new DOMParser();
    return parser.parseFromString(response, 'application/xml');
}

export async function getHtml(url: string): Promise<Document> {
    let response = await getResponse(url);
    let parser = new DOMParser();
    return parser.parseFromString(response, 'text/html');
}

export async function getJson(url: string): Promise<any> {
    let response = await getResponse(url);
    return JSON.parse(response);
}
