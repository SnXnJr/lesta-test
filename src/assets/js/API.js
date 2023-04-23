import data from './data.json';

const post = (type) => new Promise(resolve => {
    setTimeout(() => resolve( data[type] ), 1000)
})

export async function getData (type) {
    const resp = await post(type)
    console.log(resp);
}