const handleError = (func) => (...arg) => {
    try {
        return Promise.resolve(func(arg))
    } catch (error) {
        console.log(error, "error")
        return error
    }
}

export default handleError