function PlayButtons({ onPlay, onStop, handlePrevSong, handleNextSong }) {
	
	return (
		<>
		<div className="d-flex justify-content-center align-items-center gap-3 my-4">
		    <button
		        id="prev"
		        className="btn-apple"
		        onClick={handlePrevSong}
		        title="Previous"
		    >
		        <i className="bi bi-chevron-left"></i>
		    </button>

		    <button
		        id="play"
		        className="btn-apple"
		        onClick={onPlay}
		        title="Play"
		    >
		        <i className="bi bi-play-fill"></i>
		    </button>

		    <button
		        id="stop"
		        className="btn-apple"
		        onClick={onStop}
		        title="Stop"
		    >
		        <i className="bi bi-stop-fill"></i>
		    </button>

		    <button
		        id="next"
		        className="btn-apple"
		        onClick={handleNextSong}
		        title="Next"
		    >
		        <i className="bi bi-chevron-right"></i>
		    </button>
		</div>

		</>
	);
}

export default PlayButtons; 
