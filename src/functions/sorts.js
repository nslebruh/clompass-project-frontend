const dateSort = (data, sort) => {
    let x;
    if (sort !== 0) {
        if (sort === 1) {
            x = data.sort((a, b) => {
                return new Date(a.due_date) > new Date(b.due_date) ? 1 : -1;
            });
        } else {
            x = data.sort((a, b) => {
                return new Date(a.due_date) < new Date(b.due_date) ? 1 : -1;
            });
        }
    } else {
        x = data
    }
    return x
}

const nameSort = (data, sort) => {
    let x;
    if (sort !== 0) {
        if (sort === 1) {
            x = data.sort((a, b) => {
                return a.name > b.name ? 1 : -1;
            });
        } else {
            x = data.sort((a, b) => {
                return a.name < b.name ? 1 : -1;
            });
        }
    } else {
        x = data
    }
    return x
}
const statusSort = (data, sort) => {

}

const typeSort = (data, sort) => {

}

const classSort = (data, sort) => {

}

const showOnlySubject = (data, subject) => {
    let x;
    x = data.filter((element) => {
        return element.subject_code === subject
    })
    return x
}

const showOnlyStatus = (data, status) => {
    let x;
    x = data.filter((element) => {
        return element.submission_status === status
    })
    return x
}

const showOnlyYear = (data, year) => {

}
export {dateSort, nameSort, statusSort, typeSort, classSort, showOnlySubject, showOnlyStatus, showOnlyYear}