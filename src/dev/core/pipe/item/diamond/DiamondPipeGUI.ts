const DIAMOND_PIPE_COLORS = [
    "green",
    "yellow",
    "white",
    "black",
    "blue",
    "red"
];
const diamondPipeUIContext: UI.WindowContent = {
    standard: {
        header: {
            text: {text: "Diamond Transporting Pipe"}
        },
        background: {
            standard: true,
        },
        inventory: {
            standard: true
        }
    },

    elements: { }
};
const diamondPipeUI = new UI.StandartWindow(diamondPipeUIContext);

for (let i = 0; i < 6; i++){
    const color = DIAMOND_PIPE_COLORS[i];
    for (let j = 0; j < 9; j++){
        diamondPipeUI.content.elements["slot_" + i + "_" + j] = {
            type: "slot",
            bitmap: "diamond_pipe_slot_" + color,
            x: 370 + j * 65, y: 80 + i * 65
        };
    };
}