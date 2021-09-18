const show = () => {
    const sgn = document.querySelector('#sgn');
    const sgd = document.querySelector('#sgd');
    const myRequest = new Request('./src/upview_v2.json');
    const myRequest2 = new Request('./src/upview2.json');
    let signumber = ''
    let totalsigned = 0
    let datenumber = []
    let datelabels = []

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

        let t2 = data.registered.toString()
        let g2 = t2.split(",");
        g2 = g2.sort();
        let u2 = "";
        for(let i of g2) {
            console.log(i)
            let q = "<span>" + i + "</span>"
            u2 += q

            i = i.replace('(复式)', '')
            $("#"+i).addClass("registered");
            let t = $("#"+i).html();
            $("#"+i).html(t);
        }

        sgd.innerHTML = "<br><h3 class='registered'>已在交易中心预告登记</h3><div>预告登记具有物权效力。制约开发商把已出售的住房再次出售或者进行抵押。随申办市民云'我的不动产'可查询。预告登记的前提是开发商已把房子的抵押从银行解押，这时房子是干净的，归到你名下，才能办购房贷款，银行再把你的当押金，给你放款。</div>" + u2 + "<h3 class='signed'>已网签 / 已签完预售合同</h3><div>网签、备案不具物权效力。只跟开发商签合同没做预告登记的会存在风险，虽然合同签了，在法律上这个房子还是归开发商所有，房子还是被开发商抵押给银行了。</div>" + u;
        totalsigned = g.length + g2.length
        $("#sed").html(g.length + g2.length)
        $("#red").html(g2.length)
        let redp = parseInt(g2.length)*100/503
        $("#redp").html(redp.toFixed(1) + '%')
    })
    .catch(console.error);

    fetch(myRequest2)
    .then(response => response.json())
    .then(data => {
        // daily = data.daily
        datenumber = data.date
        datelabels = data.labels
        // for(var d in daily) {
        //     let dd = daily[d]
        //     let ddd = dd.date + ': ' + dd.number + '<br>';
        //     signumber += ddd;
        // }
        // signumber = `<h3>每日网签数:</h3>` + signumber
        // sgn.innerHTML = signumber

        $("#total").html(data.total)
        $("#b1").html(data.b1)
        $("#b2").html(data.b2)
        let notsed = parseInt(data.total) - parseInt(totalsigned)
        $("#notsed").html(notsed)
        let sedp = parseInt(totalsigned)*100/parseInt(data.total)
        $("#sedp").html(sedp.toFixed(1) + '%')

        var ctx = document.querySelector('#chart').getContext('2d');
        let chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: datelabels,
                datasets: [{
                    label: '每日网签数',
                    data: datenumber,
                    fill: false,
                    borderColor: '#ED2553',
                    tension: 0.1
                }]
            },        
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    })
    .catch(console.error);

    
}

const insertTable = (unit1, unit2, tbodyid) => {
    let row, html = '';
    for(let t = 18; t>0; t--) {
        row = `<tr>
                <td id="${unit1}-${t}02">${unit1}-${t}02</td>
                <td id="${unit1}-${t}01">${unit1}-${t}01</td>
                <td id="${unit2}-${t}02">${unit2}-${t}02</td>
                <td id="${unit2}-${t}01">${unit2}-${t}01</td>
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
    insertTable("77", "76", "_7677")
    insertTable("79", "78", "_7879")
    insertTable("81", "80", "_8081")
    showFSTable("_345")
    showFSTable("_121314")
    showFSTable("_272829")
    showFSTable("_394041")
    showFSTable("_454647")
    show();
})