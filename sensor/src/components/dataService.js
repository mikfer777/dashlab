export function getCountry() {
    return [
        {name: 'Afghanistan', code: 'AF'}, {name: 'Åland Islands', code: 'AX'}]
}

export function getSensorModule() {

    setTimeout(() => {
        {
            var url = '/api/sensormodules/'
            fetch(url)
                .then(resp => {
                    if (resp.status !== 200) {
                        console.log("error on fetch " + url)
                    }
                    return resp.json();
                }).then(data => {
                let result = [];
                console.log("fetch sensormodule" + data)
                for (var i = 0; i < data.length; i++) {
                    console.log(data[i])
                    result.push({name: data[i].name, code: data[i].sensor_uuid})
                    console.log(result[i])
                }
            })
        }
    }, 100)
}