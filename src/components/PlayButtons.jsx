function PlayButtons({ onPlay, onStop }) {
	
	return (
		<>
			{/* wrap these buttons in button group to make it easy to track of these buttons */} 
			<div className="btn-group" role="group" aria-label="Basic mixed styles example">
				<button id="play" className="btn btn-outline-primary m-1" onClick={onPlay}>Play</button>
				<button id="stop" className="btn btn-outline-danger m-1" onClick={onStop}>Stop</button>
			</div>
		</>
	);
}



export default PlayButtons; 