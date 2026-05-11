import { useEffect } from 'react'
import SideNav from '../components/SideNav'
import Messages from '../components/Messages'
import InputBar from '../components/InputBar'
import useSSE from '../hooks/useSSE'
import { useParams, useSearchParams } from 'react-router-dom'
import Chat from './Chat'
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
                <Messages setTemp={setTemp} setQuery={setSearchParams} temp={temp} chatId={chatId} />
                {/* <InputBar chatId={chatId} /> */}
                <Chat temp={temp} chatId={chatId} />
            </div>
        </div>
    )
}

export default Home;