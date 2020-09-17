const DIAMOND_PIPE_COLORS = [
    "green",
    "yellow",
    "white",
    "black",
    "blue",
    "red"
];

const diamondPipeUI = new UI.StandartWindow({
    standart: {
        header: {
            text: {text: "Diamond Transporting Pipe"}
        },
        background: {
            standart: true,
        },
        inventory: {
            standart: true
        }
    },

    elements: { }
});

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