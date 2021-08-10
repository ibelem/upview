const show = () => {
    const sgn = document.querySelector('#sgn');
    const sgd = document.querySelector('#sgd');
    const myRequest = new Request('./src/upview.json');
    const myRequest2 = new Request('./src/upview2.json');
    let signumber = ''
    let sig = ''
    let totalsigned = 0

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
            $("#"+i).html(t);
        }
        sgd.innerHTML = "<h3>已网签</h3>" + u
        totalsigned = g.length
        $("#sed").html(g.length)
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

        $("#total").html(data.total)
        $("#b1").html(data.b1)
        $("#b2").html(data.b2)
        let notsed = parseInt(data.total) - parseInt(totalsigned)
        $("#notsed").html(notsed)
        let sedp = parseInt(totalsigned)*100/parseInt(data.total)
        $("#sedp").html(sedp.toFixed(1) + '%')
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

const showFSTable = (tbodyid) => {
    $("#"+tbodyid + ' td').each(function( index ) {
        $(this).html($(this).attr('id'))
    })
}

$(document).ready(function () {
    insertTable("49", "48", "_4849")
    insertTable("69", "68", "_6869")
    insertTable("75", "74", "_7475")
    insertTable("76", "77", "_7677")
    insertTable("75", "74", "_7475")
    insertTable("79", "78", "_7879")
    insertTable("81", "80", "_8081")
    showFSTable("_345")
    showFSTable("_121314")
    showFSTable("_272829")
    showFSTable("_394041")
    showFSTable("_454647")
    show();
})
