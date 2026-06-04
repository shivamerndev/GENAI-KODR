import { MessageCircleCheckIcon, MessageCircleDashedIcon } from 'lucide-react'


const Strat = ({ temp, setQuery }) => {

    return (
        <div className='w-full h-full flex  items-center justify-center flex-col gap-4 relative'>
            <div onhover={"Temprory Chat"}  className='flex items-center  absolute top-4 right-0 '>
                {temp ? <MessageCircleCheckIcon onClick={() => {
                    setQuery({})
                }} className='w-6 h-6 text-gray-400  cursor-pointer hover:text-gray-100 ' /> : <MessageCircleDashedIcon onClick={() => {
                    setQuery({ temp: true })
                }} className='w-6 h-6 text-gray-400  cursor-pointer hover:text-gray-100 ' />}
            </div>

            <div className='flex items-center h-full'>
                <h1 className='font-semibold text-4xl text-zinc-300'>{temp ? "Temprory Chat" : "Start New Chat"}</h1>
            </div>
        </div>
    )
}

export default Strat