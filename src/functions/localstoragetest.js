const validateLocalStorageData = (timestamp = 1651536000000) => {
    try {
        let data = localStorage.getItem("clompass-data")
        data = JSON.parse(data)
        if (data.timestamp <= timestamp) {
            saveLocalStorageData()
        } 
    } catch (err) {
        console.log(err)
        saveLocalStorageData()
    }
}

const getLocalStorageData = (key = null) => {
    let x;
    try {
        let data = localStorage.getItem("clompass-data")
        data = JSON.parse(data)
        if (key) {
            x = data[key]
        } else {
            x = data
        }
        
    } catch (err) {
        console.log(err)
        saveLocalStorageData()
    }
    return x;
}

const saveLocalStorageData = (d = null) => {
    console.log(d)
    let data;
    try {
        if (!d) {
            data = {
                timestamp: new Date().valueOf(),
                schedule_url: "",
                schedule_data: {},
                learning_tasks: {},
                subjects: {},
                student_info: {
                    chronicles: {}
                },
            }
        } else {
            let x = getLocalStorageData()
            data = {
                ...x,
                timestamp: new Date().valueOf(),
            };
            
            Object.keys(d).forEach(key => {
                console.log(key)
                data[key] = d[key]
            })
        }
        
    } catch  (err) {
        console.log(err)
        data = {
            timestamp: new Date().valueOf(),
            schedule_url: "",
            schedule_data: {},
            learning_tasks: {},
            subjects: {},
            student_info: {
                chronicles: {}
            },
        }
    }
    console.log(data)
    localStorage.setItem('clompass-data', JSON.stringify(data))
}
const clearLocalStorageData = (key=null) => {
    let data;
    if (key === null) {
        data = {
                timestamp: new Date().valueOf(),
                schedule_url: "",
                schedule_data: {},
                learning_tasks: {},
                subjects: {},
                student_info: {
                    chronicles: {}
                },
            }
    } else {
        data = getLocalStorageData()
        if (key === "schedule_url") {
            data[key] = ""
        } else if (key === "student_info") {
            data[key] = {chronicles: {}}
        } else {
            data[key] = {}
        }
    }
    console.log(data)
    localStorage.setItem('clompass-data', JSON.stringify(data))
}

export {getLocalStorageData, validateLocalStorageData, saveLocalStorageData, clearLocalStorageData};