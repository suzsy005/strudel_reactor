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
import { PreprocessLogic } from './utils/PreprocesLodic';	// for volume range bar function



let globalEditor = null;

const handleD3Data = (event) => {
    console.log(event.detail);
};

//export function SetupButtons() {
//
//    document.getElementById('play').addEventListener('click', () => globalEditor.evaluate());
//    document.getElementById('stop').addEventListener('click', () => globalEditor.stop());
//    document.getElementById('process').addEventListener('click', () => {
//        Proc()
//    }
//    )
//    document.getElementById('process_play').addEventListener('click', () => {
//        if (globalEditor != null) {
//            Proc()
//            globalEditor.evaluate()
//        }
//    }
//    )
//}



//export function ProcAndPlay() {
//    if (globalEditor != null && globalEditor.repl.state.started == true) {
//        console.log(globalEditor)
//        Proc()
//        globalEditor.evaluate();
//    }
//}

//export function Proc() {
//
//    let proc_text = document.getElementById('proc').value
//    let proc_text_replaced = proc_text.replaceAll('<p1_Radio>', ProcessText);
//    ProcessText(proc_text);
//    globalEditor.setCode(proc_text_replaced)
//}

//export function ProcessText(match, ...args) {
//
//    let replace = ""
////    if (document.getElementById('flexRadioDefault2').checked) {
////        replace = "_"
////    }
//
//    return replace
//}

export default function StrudelDemo() {

	const hasRun = useRef(false);
	
	// take Ref to skip the first execution of CPM
	const isCpmMount = useRef(true); 
	
	// variable for Play button
	const handlePlay = () => {
		
		// this if statement is for CPM function
		// checks if it is initialised
		if (globalEditor)
		{
			// this is for volume bar function
			// this Preprocess handles everything, which is inputText(music code) and volume
			let outputText = Preprocess({ inputText: procText, volume: volume })
			globalEditor.setCode(outputText);
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
	
	// these codes below are for CPM function
	// variable for song text
	// songText is getter, setSongText is setter
	// can set initial value nothing(empty) by default
	// BUT we have stranger_tune so we use this
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
	const [state, setState] = useState("stop");
	
	// Effect 3
	// hooks volume
	useEffect(() => {
		
		// play music only when "play" button is hit
		if (state === "play") {
			handlePlay();
		}
		
	})
	

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
			const processedCode = PreprocessCode(songText, cpm);
			// whenever this func use useEffect file, set code to processCode
			globalEditor.setCode(processedCode);	 
		}
	}, [songText, cpm]);
	
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
								{/* <ProcButtons /> */}
						        <br />
								<PlayButtons onPlay={handlePlay} onStop={handleStop} />
						    </nav>
						</div>
					</div>
					<div className="row mb-3">
						<div className="col-12">
						    <DJ_Controls cpm={cpm} onCpmChange={(newVal) => setCpm(newVal)} />
						</div>
					</div>
	            </div>
	            <canvas id="roll"></canvas>
	        </main >
	    </div >
	);
}