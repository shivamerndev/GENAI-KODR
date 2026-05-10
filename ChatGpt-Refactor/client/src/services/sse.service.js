
function eventSource() {

    const eventSource = new EventSource("http://localhost:5173/api/chats/events");

    eventSource.onmessage = (event) => {
        console.log(event.data);
    };

    eventSource.onerror = (err) => {
        console.error("SSE error", err);
    };
}

export default eventSource;