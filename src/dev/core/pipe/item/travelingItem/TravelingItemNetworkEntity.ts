/// <reference path="TravelingItemAnimation.ts" />
/// <reference path="TravelingItem.ts" />
/// <reference path="TravelingItemMoveData.ts" />

const TravelingItemNetworkType = new NetworkEntityType("bc.item")
	.setClientListSetupListener((list, target: TravelingItem, entity) => {
		const { x, y, z } = target.Coords;
		list.setupDistancePolicy(x, y, z, target.blockSource.getDimension(), 32);
	})
	.setClientEntityAddedListener((entity, packet: { coords, item, moveData }) => {
		const target = new TravelingItemAnimation(packet.coords, packet.item);
		target.updateMoveData(packet.moveData);

		Updatable.addLocalUpdatable(target);
		return target;
	})
	.setClientEntityRemovedListener((target: TravelingItemAnimation, entity) => {
		target.destroy();
	})
	.setClientAddPacketFactory((target: TravelingItem, entity, client) => {
		return { coords: target.Coords, item: target.VisualItem, moveData: target.MoveData }
	})
	.addClientPacketListener("moveData", (target: TravelingItemAnimation, entity, packetData: TravelingItemMoveData) => {
		target.updateMoveData(packetData);
	});