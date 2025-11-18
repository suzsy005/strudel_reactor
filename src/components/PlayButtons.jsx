function PlayButtons({ onPlay, onStop, handlePrevSong, handleNextSong }) {
	
	return (
		<>
		<div className="d-flex justify-content-center align-items-center gap-3 my-3">
		    <button
		        id="prev"
		        className="btn btn-secondary rounded-circle btn-lg shadow-sm"
		        onClick={handlePrevSong}
		        title="Previous"
		    >
		        <i className="bi bi-chevron-left"></i>
		    </button>

		    <button
		        id="play"
		        className="btn btn-primary rounded-circle btn-lg shadow-sm"
		        onClick={onPlay}
		        title="Play"
		    >
		        <i className="bi bi-play-fill"></i>
		    </button>

		    <button
		        id="stop"
		        className="btn btn-danger rounded-circle btn-lg shadow-sm"
		        onClick={onStop}
		        title="Stop"
		    >
		        <i className="bi bi-stop-fill"></i>
		    </button>

		    <button
		        id="next"
		        className="btn btn-secondary rounded-circle btn-lg shadow-sm"
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

{/* Song Skip Buttons */}
