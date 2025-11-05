function DJ_Controls(){
	
	return (
		<>
			<div className="input-group mb-3">
				{/* input feature to change the speed of music(CPM) */}
				<span className="input-group-text" id="cpm_label">setCPM</span>
			  	<input type="text" className="form-control" id="cpm_text_input "placeholder="120" aria-label="cpm" aria-describedby="cpm_label" />
			</div>
			
			{/* valume range bar feature to change the valume of music */}		  
			<label for="valume_range" className="form-label">Valume</label>
			<input type="range" className="form-range" min="0" max="1" step="0.05" id="valume_range" />

		</>
	); 
}

export default DJ_Controls;