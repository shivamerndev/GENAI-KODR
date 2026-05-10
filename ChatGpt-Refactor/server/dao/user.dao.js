import userModel from "../models/user.model.js"

const findUser = async (data) => {

    const user = await userModel.findOne(data)
    return user;
}

const createUser = async (data) => {
    const newUser = await userModel.create(data)
    return newUser
}

export { findUser, createUser }