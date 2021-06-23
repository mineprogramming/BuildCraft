/// <reference path="abstract/TransportPipeConnector.ts" />
let ITEM_MACHINES = [{ id: 54, data: -1 }];

const transportConnector = new TransportPipeConnector();
const basicRule = transportConnector.getConnectionRules()[0];

for (const instance of ITEM_MACHINES) {
	ICRender.getGroup(basicRule.name).add(instance.id, instance.data);
}

Callback.addCallback("PostLoaded", () => {
	// For StorageInterface containers
	// @ts-ignore
	for (const blockID in StorageInterface.data) {
		// @ts-ignore
		ICRender.getGroup(basicRule.name).add(blockID, -1);
	}
});
