/// <reference path="TravelingItemAnimation.ts" />
/// <reference path="TravelingItem.ts" />
/// <reference path="TravelingItemMoveData.ts" />

// @ts-ignore
const travelingItemNetworkType = new NetworkEntityType("bc.item")
	.setClientListSetupListener((list, target: TravelingItem, entity) => {
		const { x, y, z } = target.Coords;
		list.setupDistancePolicy(x, y ,z , target.blockSource.getDimension(), 32);
	})
	.setClientEntityAddedListener((entity, packet: {coords, item}) => {
		// vectorIndex
		const anim = new TravelingItemAnimation(packet.coords, packet.item);
		Updatable.addLocalUpdatable(anim);
		return anim;
	})
	.setClientEntityRemovedListener((target: TravelingItemAnimation, entity) => {
		target.destroy();
	})
	.setClientAddPacketFactory((target: TravelingItem, entity, client) => {
		return {coords: target.Coords, item: target.VisualItem}
	})
	.addClientPacketListener("moveData", (target: TravelingItemAnimation, entity, packetData: TravelingItemMoveData) => {
		target.updateMoveData(packetData);
	});