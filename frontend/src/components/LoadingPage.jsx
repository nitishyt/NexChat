
function LoadingPage({chatpage}){
    return(
        <div className="flex justify-center items-center h-screen">
            <span className="loading loading-ring"></span>
            {chatpage && <p className="ml-2 text-lg">Loading chat...</p>}
        </div>
    )
}

export default LoadingPage