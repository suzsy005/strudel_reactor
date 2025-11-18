function PreprocessTextarea({ defaultValue, onChange }) {
	
	return (
		<>
			<textarea className="form-control" rows="15" defaultValue={defaultValue} onChange={onChange} id="proc" ></textarea>
		</>
	);
}

export default PreprocessTextarea;