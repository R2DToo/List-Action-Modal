import {createCustomElement, actionTypes} from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
const {COMPONENT_ERROR_THROWN,COMPONENT_PROPERTY_CHANGED} = actionTypes;
import styles from './styles.scss';

import '@servicenow/now-rich-text';

const view = (state, {updateState, dispatch}) => {
	console.log('action-modal-component state: ', state);
	return (
		<div id="container">
			<ul id="response-list">
				{state.properties.responses.map((response, index) =>
					<div>
						<li class={{response: true, green: response.actionResults.status == "Success", red: response.actionResults.status != "Success"}} onclick={() => {dispatch("TOGGLE_SHOW_DETAILS", {index: index})}}>
							<div className="content" title="Click here to see additional output">
								<div className="icon">
									{response.actionResults.status == "Success"
									? <svg attrs={{xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", height: "24px", width: "24px", class: "status-icon green"}}><path attr-d="M0 0h24v24H0V0z" attr-fill="none"/><path attr-d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM9.29 16.29L5.7 12.7c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0L10 14.17l6.88-6.88c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41l-7.59 7.59c-.38.39-1.02.39-1.41 0z"/></svg>
									: <svg attrs={{xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", height: "24px", width: "24px", class: "status-icon red"}}><path attr-d="M0 0h24v24H0V0z" attr-fill="none" attr-opacity=".87"/><path attr-d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm4.3 14.3c-.39.39-1.02.39-1.41 0L12 13.41 9.11 16.3c-.39.39-1.02.39-1.41 0-.39-.39-.39-1.02 0-1.41L10.59 12 7.7 9.11c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0L12 10.59l2.89-2.89c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41L13.41 12l2.89 2.89c.38.38.38 1.02 0 1.41z"/></svg>}
								</div>
								<div>Name: {response.ci_name}</div>
								<div>IP Address: {response.ci_ip}</div>
							</div>
							{state.properties.showDetails.includes(index) && <div className="content-details">
								<hr></hr>
								<pre>{response.actionResults.error_message ? response.actionResults.error_message : response.actionResults.output}</pre>
							</div>}
						</li>
					</div>
				)}
			</ul>
		</div>
	);
};

createCustomElement('snc-action-modal-component', {
	renderer: {type: snabbdom},
	view,
	styles,
	properties: {
		responses: {
			default: []
		},
		showDetails: {
			default: []
		}
	},
	setInitialState() {
		return {
			dummyStateChange: false, //Used to re-render the component
		}
	},
	actionHandlers: {
		'TOGGLE_SHOW_DETAILS': (coeffects) => {
			const {state, updateProperties, updateState, action} = coeffects;
			console.log("TOGGLE_SHOW_DETAILS");
			console.log("payload: ", action.payload);
			let updatedShowDetails = state.properties.showDetails;
			let existingIndex = updatedShowDetails.findIndex((showDetail) => showDetail == action.payload.index);
			if (existingIndex > -1) {
				updatedShowDetails.splice(existingIndex, 1);
			} else {
				updatedShowDetails.push(action.payload.index);
			}
			updateProperties({showDetails: updatedShowDetails});
			updateState({dummyStateChange: !state.dummyStateChange});
		},
		[COMPONENT_ERROR_THROWN]: (coeffects) => {
			console.log("%cERROR_THROWN: %o", "color:red", coeffects.action.payload);
		},
		[COMPONENT_PROPERTY_CHANGED]: (coeffects) => {
			const {state, updateState} = coeffects;
			updateState({dummyStateChange: !state.dummyStateChange});
		}
	}
});
