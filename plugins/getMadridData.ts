const URL_DATA = "https://idehodikxi.execute-api.eu-west-3.amazonaws.com/default/getMadridDatosFromEU";

import fetch from 'node-fetch';

export default async function getData(): Promise<any> {
    return await fetch(URL_DATA, { method: 'GET' }).then(res => res.json())
}