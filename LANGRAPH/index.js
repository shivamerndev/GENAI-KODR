import "dotenv/config";
import { HumanMessage, SystemMessage, ToolMessage, tool } from "langchain";
import { StateGraph, START, END, StateSchema, MessagesValue } from "@langchain/langgraph"
import { toolNode } from "./src/nodes.js"
import { llmNode } from "./src/ai.service.js";

const state = new StateSchema({
    messages: MessagesValue,
})

const handleGraph = async () => {

    const graph = new StateGraph(state)
        .addNode("llm", llmNode) // Adds a node named "llm".
        .addNode("tool", toolNode)
        .addEdge(START, "llm") // Workflow starts from START. First node executed is "llm".
        .addConditionalEdges("llm", (state) => {   
            const lastMessage = state.messages[state.messages.length - 1]
            if (lastMessage.tool_calls.length > 0) {
                return "tool"
            }
            return END
        }) // Adds conditional routing after "llm" finishes.
        .addEdge("tool", "llm")  // After tool execution, go back to AI model. Then again check condition and end.
        .compile() // Converts graph definition into executable workflow.

    const result = await graph.invoke({ messages: [new HumanMessage("What is the weather in new DElhi?")] })

    console.log(result)
}

handleGraph()