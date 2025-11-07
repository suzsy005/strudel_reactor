function DJ_Controls({ cpm, onCpmChange }){
	
	// take input value to App.js when users type CPM
	const handleCpmInputChange = (event) => {
	  	onCpmChange(event.target.value);
	};
	
	
	return (
		<>
			<div className="input-group mb-3">
				{/* input feature to change the speed of music(CPM) */}
				<span className="input-group-text" id="cpm_label">setCPM</span>
			  	<input 
					type="text" 
					className="form-control" 
					id="cpm_text_input" 
					placeholder="140" 
					aria-label="cpm" 
					aria-describedby="cpm_label"
					value={cpm} // shows "cpm state" from App.js
					onChange={handleCpmInputChange} // notifies CPM input change to App.js
				/>
			</div>
			
			{/* valume range bar feature to change the valume of music */}		  
			<label htmlFor="valume_range" className="form-label">Valume</label>
			<input type="range" className="form-range" min="0" max="1" step="0.05" id="valume_range" />

			{/* instruments checkbox feature to turn on/off instruments */}		  	
			<div className="form-check">
			  <input className="form-check-input" type="checkbox" value="" id="s1" />
			  <label className="form-check-label" htmlFor="s1">
			  	s1
			  </label>
			</div>
			<div className="form-check">
			  <input className="form-check-input" type="checkbox" value="" id="d1" />
			  <label className="form-check-label" htmlFor="d1">
			  	d1
			  </label>
			</div>
			<div className="form-check">
			  <input className="form-check-input" type="checkbox" value="" id="d2" />
			  <label className="form-check-label" htmlFor="d2">
			    d2
			  </label>
			</div>
		</>
	); 
}

export default DJ_Controls;