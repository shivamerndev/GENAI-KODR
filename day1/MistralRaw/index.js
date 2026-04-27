import { invokeAI } from "./ai.js"
import readline from "readline/promises"

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})


const messages = []

while (true) {
    const userInput = await rl.question("You: ")

    messages.push({
        role: "user",
        content: userInput
    })

    const aiMessage = await invokeAI(messages)

    console.log("response from AI : ", aiMessage)
}