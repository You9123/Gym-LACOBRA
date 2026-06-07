const LoadingSpinner = ()=>{

    return(

        <div
            className="
                flex
                justify-center
                items-center
                py-12
            "
        >

            <div
                className="
                    animate-spin
                    rounded-full
                    h-14
                    w-14
                    border-b-4
                    border-cyan-400
                "
            />

        </div>

    );

};

export default LoadingSpinner;