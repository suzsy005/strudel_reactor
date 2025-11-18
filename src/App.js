import './App.css';
import { useEffect, useRef, useState } from "react";
import { StrudelMirror } from '@strudel/codemirror';
import { evalScope } from '@strudel/core';
import { drawPianoroll } from '@strudel/draw';
import { initAudioOnFirstClick } from '@strudel/webaudio';
import { transpiler } from '@strudel/transpiler';
import { getAudioContext, webaudioOutput, registerSynthSounds } from '@strudel/webaudio';
import { registerSoundfonts } from '@strudel/soundfonts';
import { stranger_tune } from './tunes';
import console_monkey_patch, { getD3Data } from './console-monkey-patch';
import DJ_Controls from './components/DJ_Controls';
import PlayButtons from './components/PlayButtons';
import ProcButtons from './components/ProcButtons';
import PreprocessTextarea from './components/PreprocessTextarea';
import * as Tone from "tone";	// for user CPM input function
import { Preprocess } from './utils/PreprocessLogic';	// for volume range bar function
import D3Graph from './components/D3Graph';


let globalEditor = null;

export default function StrudelDemo() {

	const hasRun = useRef(false);
	
	// take Ref to skip the first execution of CPM
	const isCpmMount = useRef(true); 
	
	// skips the first execution when volume changes 
	const isVolumeMount = useRef(true);
		
	const [d3Data, setD3Data] = useState([]);

	
	const handleD3Data = (event) => {
	  setD3Data(event.detail);
	};
	
	// variable for Play button
	const handlePlay = () => {
		
		// this if statement is for CPM function
		// checks if it is initialised
		if (globalEditor)
		{
			// creates the codes with CPM (CPM preprocessed codes)
			const codeWithCPM = PreprocessCode(songText, cpm);
			
			// this is for volume bar function
			// inputText: gives codeWithCPM(CPM preprocessed codes)
			// volume: gives the value of volume State
			const finalCode = Preprocess({ inputText: codeWithCPM, volume: volume });
			
			// set the finalCode and play music
			globalEditor.setCode(finalCode);
			globalEditor.evaluate()
			
		}
		else
		{
			console.error("Editor not ready.");
		}
		
	}
	
	// variable for Stop button
	const handleStop = () => {
		// checks if it is initialised
		if (globalEditor)
		{
			globalEditor.stop()
		}
		else
		{
			console.error("Editor not ready.");
		}
	}
	
	// variable for song text
	// songText is getter, setSongText is setter
	// can set initial value nothing(empty) by default, but we have stranger_tune so we use this
	const [songText, setSongText] = useState(stranger_tune)
	
	// added State to manage CPM
	const [cpm, setCpm] = useState("140"); 
	
	// receives CPM and song code and do preprocess
	const PreprocessCode = (code, cpmValue) => {
		
		// convert user input into value (140 if incorrect input)
		const cpmNumber = parseFloat(cpmValue) || 140;
		
		// calculates CPS(Cycles Per Second)
		const cps = cpmNumber / 60 / 4;
		
		// looks for existing setcps() and replace to new line
		// ^: head of line,  \s*: space more than 0, i: ignores capital and lowercase
		const codeWithoutOldCps = code.replace(/^setcps\s*\(.*\)\s*\n/i, '');
		
		// adds new setcps at the head of song code
		return `setcps(${cps})\n\n${codeWithoutOldCps}`;
			
	}
	
	// these codes below are for volume bar function
	const [volume, setVolume] = useState("1");
	
	// 	JSON Handling
	const handleSaveJson = () => {
		
		// 1. creates a data to save as a JSON obj
		const settings = {
		    cpm: cpm,
		    volume: volume,
		    timestamp: new Date().toISOString()
		};
		
		// 2. change JSON obj to string
		const jsonString = JSON.stringify(settings, null, 2);
		
		// 3. creates a Blog to donwload as file
		const blob = new Blob([jsonString], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		
		// 4. creates the link for download, which users click
		const a = document.createElement('a');
		a.href = url;
		a.download = `strudel_dj_settings_${Date.now()}.json`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
		
	}
	
	// Added JSON function: read JSON file and apply a setting
	const handleLoadJson = (event) => {
	        const file = event.target.files[0];
	        if (!file) {
	            return;
	        }
			
			const reader = new FileReader();
			reader.onload = (e) => {
				try {
				    const loadedSettings = JSON.parse(e.target.result);
				    
				    // check and set data
				    if (loadedSettings.cpm !== undefined) {
				        setCpm(loadedSettings.cpm.toString());
				    }
				    if (loadedSettings.volume !== undefined) {
				        setVolume(loadedSettings.volume.toString());
				    }

					// after applying a setting, it triggers the update if music is being played
				    if (globalEditor && globalEditor.repl.state.started === true) {
				        handlePlay();
				    }				
				} catch (error) {
					console.error("Error loading JSON settings:", error);
			    	console.warn("Errors reading a file. Check the format of JSON file.");
	          	}
			};
			reader.readAsText(file);
	};

	// Effect 1
	// integrates initialization and contents update
	// put [songText, cpm] to update them whenever the contents change
	useEffect(() => {
	
	    if (!hasRun.current) {
	        document.addEventListener("d3Data", handleD3Data);
	        console_monkey_patch();
	        hasRun.current = true;
	        //Code copied from example: https://codeberg.org/uzu/strudel/src/branch/main/examples/codemirror-repl
            //init canvas
            const canvas = document.getElementById('roll');
            canvas.width = canvas.width * 2;
            canvas.height = canvas.height * 2;
            const drawContext = canvas.getContext('2d');
            const drawTime = [-2, 2]; // time window of drawn haps
            globalEditor = new StrudelMirror({
                defaultOutput: webaudioOutput,
                getTime: () => getAudioContext().currentTime,
                transpiler,
                root: document.getElementById('editor'),
                drawTime,
                onDraw: (haps, time) => drawPianoroll({ haps, time, ctx: drawContext, drawTime, fold: 0 }),
                prebake: async () => {
                    initAudioOnFirstClick(); // needed to make the browser happy (don't await this here..)
                    const loadModules = evalScope(
                        import('@strudel/core'),
                        import('@strudel/draw'),
                        import('@strudel/mini'),
                        import('@strudel/tonal'),
                        import('@strudel/webaudio'),
                    );
                    await Promise.all([loadModules, registerSynthSounds(), registerSoundfonts()]);
                },
            });
		}	
	
		// ALWAYS executes contents updating
		if (globalEditor)
		{
			// set process code through Preprocess()
			const codeWithCPM = PreprocessCode(songText, cpm);
			// add the volume to codes with CPM
			const finalCode = Preprocess({ inputText: codeWithCPM, volume: volume });
			// whenever this func use useEffect file, set code to processCode
			globalEditor.setCode(finalCode);	 
		}
	}, [songText, cpm, volume]);
	
	
	// Effect 2
	// Live CPM update (while playing)
	useEffect(() => {
		// 1. skips the executions for the first mount to avoid music start playing when pase loaded
		if (isCpmMount.current) {
		    isCpmMount.current = false;
		    return;
		}
		
		// 2. Live update only when Editor is ready and music is playing
		// globalEditor.repl.state.started === true avoids auto playing
		if (globalEditor && globalEditor.repl.state.started === true) {
			// look at song code and effect new CPM to the playing music
		    globalEditor.evaluate();
		}
	}, [cpm]);	// executes only when CPM is changed
	
	
	// Effect 3
	// hooks volume
	useEffect(() => {
		
		// skips an execution when it is first mount
		if (isVolumeMount.current) {
			isVolumeMount.current = false;
			return;
		}
		
		// when Editor is ready AND music is "Playing", then LIVE update
		if (globalEditor && globalEditor.repl.state.started === true) {		
			handlePlay();
		}	
		
	}, [volume])
		
	
	return (
	    <div>
	        <h2>Strudel Demo</h2>
	        <main>
				{/* wrap all the contents in this wraper*/}
				<div className="phone-frame col-md-4 mx-auto p-3 mb-5">
					<div className="row">
						<i className="bi bi-music-note-beamed col text-center"></i>
					</div>
	                <div className="row mb-3">
	                    <div className="col-12" style={{ maxHeight: '25vh', overflowY: 'auto' }}>
	                    	<PreprocessTextarea defaultValue={songText} onChange={(e) => setSongText(e.target.value)} />
						</div>
	                </div>
	                <div className="row mb-3">
	                    <div className="col-12" style={{ maxHeight: '25vh', overflowY: 'auto' }}>
	                        <div id="editor" />
	                        <div id="output" />
	                    </div>
	                </div>
					<div className="text text-center fs-3 fw-bold">
						Music Title
					</div>
					<div className="text text-left fs-3 fw-bold">
						Singer Name
					</div>

					<div className="row mb-3">
						<div className="col-12">
						    <nav>
						        <br />
								<PlayButtons onPlay={handlePlay} onStop={handleStop} />
						    </nav>
						</div>
					</div>
					<div className="row mb-3">
						<div className="col-12">
						    <DJ_Controls 
								// props for CPM
								cpm={cpm} 
								onCpmChange={(newVal) => setCpm(newVal)}
								
								// props for volume range bar
								volume={volume} 
								onVolumeChange={(e) => setVolume(e.target.value)} 
								
								// props for JSON handling
								onSaveJson={handleSaveJson}
								onLoadJson={handleLoadJson}

								/>
						</div>
					</div>
					<div className="mt-4 text-center">
					    <D3Graph data={d3Data} style={{ height: "150px"}}　/>
					</div>
	            </div>
	            <canvas id="roll"></canvas>
	        </main >
	    </div >
	);
}