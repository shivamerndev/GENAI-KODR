import { useEffect } from 'react'
import SideNav from '../components/SideNav'
import Messages from '../components/Messages'
import InputBar from '../components/InputBar'
import useSSE from '../hooks/useSSE'
import { useParams, useSearchParams } from 'react-router-dom'
import Chat from './Chat'
import { CheckIcon, MessageCircle, MessageCircleDashed } from 'lucide-react'
import { useState } from 'react'

const Home = () => {

    const { handleGetSSE } = useSSE()

    const chatId = useParams().chatId
    const [temp, setTemp] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams({});


    useEffect(() => {
        document.title = 'ChatGPT'

        // handleGetSSE()

        if (searchParams.get("temp")) {
            setTemp(true)
        }

    }, [])

    return (
        <div className='h-screen flex w-full text-white bg-zinc-950'>
            <SideNav chatId={chatId} />
            <div className='  w-3/5 mx-auto flex flex-col items-center justify-between gap-4 p-4'>
                {chatId ? <Messages chatId={chatId} /> : <div className='flex flex-col justify-center h-full text-3xl items-center gap-4 mt-20'>
                    <h1>  {temp ? "Temporary Chat" : "Start A New Chat"}</h1>
                    {temp && <p className='text-base'>This chat won’t appear in your chat history, and won’t be used to train our models.</p>}

                    <button onClick={() => {
                        if (temp) {
                            setSearchParams({})
                        } else {
                            setSearchParams({ temp: "true" })
                        }
                        setTemp(!temp)
                    }} className="absolute cursor-pointer top-1 right-4 rotate-270 p-2 rounded-full">
                        <MessageCircleDashed />
                        {temp && <CheckIcon className='rotate-90 w-3 absolute top-2 right-3.5' />}
                    </button>
                </div>}

                {/* <InputBar chatId={chatId} /> */}
                <Chat temp={temp} chatId={chatId} />
            </div>
        </div>
    )
}

export default Home;