import { useRef } from "react";


function DJ_Controls({ cpm, onCpmChange, volume, onVolumeChange, onSaveJson, onLoadJson }){
	
	// take input value to App.js when users type CPM
	const handleCpmInputChange = (event) => {
	  	onCpmChange(event.target.value);
	};
	
	// this handler gives values of volume range bar to App.js
	const handleVolumeChange = (event) => {
		onVolumeChange(event);
	};
	
	// reference to hidden Input element to open the file choice dialog
	const fileInputRef = useRef(null);

	
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
			<input 
					type="range" 
					className="form-range" 
					min="0" 
					max="2" 
					step="0.1" 
					onChange={handleVolumeChange} 
					value={volume} 
					id="valume_range" />
					
			{/* JSON Save/Load buttons */}
			<div className="row justify-content-evenly pt-3">
			    {/* Save Button */}
				<button 
			        className="btn btn-outline-success m-1 col-5" 
			        onClick={onSaveJson}
			    >
				<i className="bi bi-download"></i> Save Settings
				</button>
			    
			    {/* Load Button */}
			    <input
			        type="file"
			        ref={fileInputRef}
			        onChange={onLoadJson}
			        style={{ display: 'none' }}
			        accept=".json"
			    />
				<button 
			        className="btn btn-outline-info m-1 col-5" 
					// clicking button starts file input
			        onClick={() => fileInputRef.current && fileInputRef.current.click()}
			    >
				<i className="bi bi-upload"></i> Load Settings
				</button>
			</div>
		</>
	); 
}

export default DJ_Controls;