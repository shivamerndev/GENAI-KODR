import { useEffect } from 'react'
import SideNav from '../components/SideNav'
import Messages from '../components/Messages'
import InputBar from '../components/InputBar'
import { useParams, useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import Strat from './Strat'

const Home = () => {

    const chatId = useParams().chatId
    const [temp, setTemp] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams({});


    useEffect(() => {
        document.title = 'ChatGPT'

        if (searchParams.get("temp")) {
            setTemp(true)
        }

    }, [])

    useEffect(() => {
        setTemp(searchParams.get("temp") == "true")
    }, [searchParams])

    
    return (
        <div className='h-screen flex w-full text-white bg-zinc-950 overflow-hidden'>
            <SideNav chatId={chatId} />
            <div className='flex-1 h-full flex flex-col items-center justify-between p-4 relative overflow-hidden'>
                {chatId ?
                    <>
                        <Messages chatId={chatId} />
                        <InputBar chatId={chatId} />
                    </>
                    : <Strat setQuery={setSearchParams} temp={temp} />}
            </div>
        </div>
    )
}

export default Home;