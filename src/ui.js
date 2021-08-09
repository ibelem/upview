const show = () => {
    const sgn = document.querySelector('#sgn');
    const sgd = document.querySelector('#sgd');
    const myRequest = new Request('./src/upview.json');
    const myRequest2 = new Request('./src/upview2.json');
    let signumber = ''
    let sig = ''

    fetch(myRequest)
    .then(response => response.json())
    .then(data => {
        let t = data.signed.toString()
        let g = t.split(",");
        g = g.sort();
        let u = "";
        for(let i of g) {
            console.log(i)
            let q = "<span>" + i + "</span>"
            u += q

            i = i.replace('(复式)', '')
            $("#"+i).addClass("signed");
            let t = $("#"+i).html();
            $("#"+i).html(t + "已网签");
        }
        sgd.innerHTML = "<h3>已网签</h3>" + u
    })
    .catch(console.error);

    fetch(myRequest2)
    .then(response => response.json())
    .then(data => {
        let daily = data.daily
        for(var d in daily) {
            let dd = daily[d]
            let ddd = dd.date + ': ' + dd.number + '<br>';
            signumber += ddd;
        }
        signumber = `<h3>每日网签数:</h3>` + signumber
        sgn.innerHTML = signumber
    })
    .catch(console.error);
}

const insertTable = (unit1, unit2, tbodyid) => {
    let row, html = '';
    for(let t = 18; t>0; t--) {
        row = `<tr>
                <td id="${unit2}-${t}02">${unit2}-${t}02</td>
                <td id="${unit2}-${t}01">${unit2}-${t}01</td>
                <td id="${unit1}-${t}02">${unit1}-${t}02</td>
                <td id="${unit1}-${t}01">${unit1}-${t}01</td>
            </tr>`
        html += row;
    }
    $("#"+tbodyid).html(html)
}

$(document).ready(function () {
    insertTable("49", "48", "_4849")
    insertTable("69", "68", "_6869")
    insertTable("75", "74", "_7475")
    insertTable("76", "77", "_7677")
    insertTable("75", "74", "_7475")
    insertTable("79", "78", "_7879")
    insertTable("81", "80", "_8081")
    
    show();
})