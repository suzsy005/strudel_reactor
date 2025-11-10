export function Preprocess ({ inputText, volume }) {
	
	outputText = outputText.replaceAll("{VOLUME}", volume)
	
	// use regex here to look for word matches
	let regex = /[a-zA-Z0-9_+:\s*\n[\s\S]+?\r?\n(?=[a-zA-Z0-9_]*[:\/])/gm;
	
	
	

	
}