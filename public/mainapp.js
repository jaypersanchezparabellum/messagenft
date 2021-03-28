document.getElementById("createphone").addEventListener('click', createPhone);
document.getElementById("deploynewcontract").addEventListener('click', deployNewContract)

function createPhone() {
    //alert("create phone");
    let PHONE = document.getElementById('phonenumber').value;
    let IMEI = document.getElementById('imei').value;
    const URL = `http://localhost:3000/createphone?phone=${PHONE}&imei=${IMEI}`
    var xhr = new XMLHttpRequest();
    xhr.open('POST', URL, true);

    //set headers
    xhr.setRequestHeader('Content-Type', 'application/json')
    //xhr.setRequestHeader("Transfer-Encoding", "chunked")
    
    //set response time

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            console.log(xhr.response);
        }
    }
    xhr.send();
}

function deployNewContract() {
    
}