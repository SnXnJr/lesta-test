import data from './data.json';

const post = (type) => new Promise(resolve => {
    setTimeout(() => resolve( data[type] ), 1000)
})

const template = (data) => {
    if (!data) return;
    const name = data?.name ? '<h1>'+data.name+'</h1>' : '';
    let images = '<div class="images">';
    data.images && data?.images.forEach(i =>  images += '<div class="images__item"><img src="'+i[0]+'"><span>'+i[1]+'</span></div>');
    images += '</div>';
    let rows = '';
    data.values && data?.values.forEach(i =>  rows += '<tr><td>'+i[0]+'</td><td>'+i[1]+'</td></tr>')
    const content = `
        ${name}
        ${data.images && data?.images ? images : ''}
        <table>
            <tbody>
                ${rows}
            </tbody>
        </table>
    `;

    return content;
    
}

export async function getData (type) {
    const wrapper = document.querySelector('.content-js .inner');
    wrapper.classList.add('active');
    const resp = await post(type)
    const html = await template(resp)
    wrapper.innerHTML = html;
    wrapper.classList.remove('active');
}