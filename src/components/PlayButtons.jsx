function PlayButtons({ onPlay, onStop }) {
	
	return (
		<>
			{/* wrap these buttons in button group to make it easy to track of these buttons */} 
			<div className="btn-group" role="group" aria-label="Basic mixed styles example">
				<button id="play" className="btn btn-outline-primary onClick={onPlay} m-1">Play</button>
				<button id="stop" className="btn btn-outline-danger onClick={onStop} m-1">Stop</button>
			</div>
		</>
	);
}



export default PlayButtons; 