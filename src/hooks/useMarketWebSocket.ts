/** @format */

// hooks/useMarketWebSocket.ts
import { useEffect, useRef } from "react";

export function useMarketWebSocket(
	marketId: string,
	onUpdate: (data: any) => void,
) {
	const wsRef = useRef<WebSocket | null>(null);

	useEffect(() => {
		// Connect to Builder API WebSocket for real-time updates
		const ws = new WebSocket("wss://gamma-api.polymarket.com/ws");

		ws.onopen = () => {
			ws.send(
				JSON.stringify({
					type: "subscribe",
					channel: "market",
					id: marketId,
				}),
			);
		};

		ws.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (data.type === "price_update") {
				onUpdate(data);
			}
		};

		wsRef.current = ws;

		return () => {
			if (wsRef.current) {
				wsRef.current.close();
			}
		};
	}, [marketId, onUpdate]);

	return wsRef.current;
}
