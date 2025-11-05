function ProcButtons() {
	
	return (
		<>
			{/* wrap these buttons in button group to make it easy to track of these buttons */} 
			<div className="btn-group" role="group" aria-label="Basic mixed styles example">
				<button id="process" className="btn btn-outline-primary m-1">Preprocess</button>
				<button id="process_play" className="btn btn-outline-secondary m-1">Proc & Play</button>
			</div>
		</>
	);
}

export default ProcButtons;