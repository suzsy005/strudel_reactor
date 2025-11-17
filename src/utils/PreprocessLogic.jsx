export function Preprocess ({ inputText, volume }) {
	
	// uses inputText as initial value
	let outputText = inputText;
	outputText = outputText.replaceAll("{VOLUME}", volume)
	
	// regex 1
	// use regex here to look for word matches
	let regex = /[a-zA-Z0-9_+:\s*\n[\s\S]+?\r?\n(?=[a-zA-Z0-9_]*[:\/])/gm;
	
	let m;
	
	// a list of matches from while loop below
	let matches = []

	// diaplays what matches that helps find errors
	while ((m = regex.exec(outputText)) !== null) {
		// this is necessary to avoid infinite loops with zero-width matches
		if (m.index === regex.lastIndex) {
			regex.lastIndex++;
		}
		
		// the result can be accessed through the 'm'-variable
		m.forEach((match, groupIndex) => {
			matches.push(match)
		});
	}
	
	// regex 2
	// finds gain but except postgain
	let matches2 = matches.map(
		match => match.replaceAll(/(?<!post)gain\(([\d.]+)\)/g, (match, captureGroup) => 
		  // example
		  //'gain(0.1*2)'
			`gain(${captureGroup}*${volume})`
		)
	);
	
	
	// replaces the origianl text with matches2
	let matches3 = matches.reduce(
		(text, original, i) => text.replaceAll(original, matches2[i]), outputText
	);
	
	console.log(matches3);
	
	// returns re-build outputText
	return matches3;
	
	

	
}