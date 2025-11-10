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
			<input type="range" className="form-range" min="0" max="2" step="0.1" onMouseUp={onVolumeChange} id="valume_range" />

			{/* instruments checkbox feature to turn on/off instruments */}
			<div className="row justify-content-evenly pt-3">
				<div className="form-check col-2">
				  <input className="form-check-input" type="checkbox" value="" id="drums1" />
				  <label className="form-check-label" htmlFor="drums1">
				  	drums1
				  </label>
				</div>
				<div className="form-check col-2">
				  <input className="form-check-input" type="checkbox" value="" id="drums2" />
				  <label className="form-check-label" htmlFor="drums2">
				  	drums2
				  </label>
				</div>
				<div className="form-check col-2">
				  <input className="form-check-input" type="checkbox" value="" id="handcrap1" />
				  <label className="form-check-label" htmlFor="handcrap1">
				  	drums3
				  </label>
				</div>
			</div>
			<div className="row justify-content-evenly pt-3">
				<div className="form-check col-2">
				  <input className="form-check-input" type="checkbox" value="" id="drums1" />
				  <label className="form-check-label" htmlFor="drums1">
				  	handcrap1
				  </label>
				</div>
				<div className="form-check col-2">
				  <input className="form-check-input" type="checkbox" value="" id="drums2" />
				  <label className="form-check-label" htmlFor="drums2">
				  	handcrap2
				  </label>
				</div>
				<div className="form-check col-2">
				  <input className="form-check-input" type="checkbox" value="" id="handcrap1" />
				  <label className="form-check-label" htmlFor="handcrap1">
				    handcrap3
				  </label>
				</div>
			</div>

		</>
	); 
}

export default DJ_Controls;