function PlayButtons({ onPlay, onStop, handlePrevSong, handleNextSong }) {
	
	return (
		<>
			{/* wrap these buttons in button group to make it easy to track of these buttons */} 
			<div className="btn-control-wrapper" role="group" aria-label="Basic mixed styles example">
				<div className="row justify-content-evenly">
					<button id="play" className="btn btn-outline-primary m-1 col-2" onClick={onPlay}>
						<i className="bi bi-play-circle"></i>
					</button>
					<button id="stop" className="btn btn-outline-danger m-1 col-2" onClick={onStop}>
						<i className="bi bi-stop-circle"></i>
					</button>
				</div>
				
				{/* Song Skip Buttons */}
				<div className="row justify-content-evenly mt-2">
				    <button
				        id="prev"
				        className="btn btn-outline-secondary m-1 col-2"
				        onClick={handlePrevSong}
				    >
				        <i className="bi bi-chevron-left"></i>
				    </button>

				    <button
				        id="next"
				        className="btn btn-outline-secondary m-1 col-2"
				        onClick={handleNextSong}
				    >
				        <i className="bi bi-chevron-right"></i>
				    </button>
				</div>
			</div>
		</>
	);
}

export default PlayButtons; 